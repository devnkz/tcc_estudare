"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Resposta } from "@/types/resposta";
import { useUpdateResposta } from "@/hooks/resposta/useUpdate";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Info, XCircle } from "lucide-react";
import badWordsJSON from "@/utils/badWordsPT.json";
import { ActionButton } from "@/components/ui/actionButton";

interface ModalUpdateResponseProps {
  resposta: Resposta;
  triggerId?: string;
  triggerClassName?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (msg?: string) => void;
}

export default function ModalUpdateResponse({
  resposta,
  triggerId,
  triggerClassName,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
}: ModalUpdateResponseProps) {
  const [conteudoUpdate, setConteudoUpdate] = useState(resposta.resposta);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Usa controlled se fornecido, senão usa interno
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledOnOpenChange || setInternalIsOpen;

  const { mutate: updateResposta, isPending } = useUpdateResposta();

  // Reseta conteúdo e erro quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setConteudoUpdate(resposta.resposta);
      setError("");
      setSuccess(false);
    }
  }, [isOpen, resposta.resposta]);

  // Normalização e checagem de badwords
  function normalize(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[@4]/g, "a")
      .replace(/3/g, "e")
      .replace(/[1!]/g, "i")
      .replace(/0/g, "o")
      .replace(/\$/g, "s")
      .replace(/(\w)\1{2,}/g, "$1");
  }

  const badSet = new Set<string>(
    (((badWordsJSON as any) ?? {}).words || []).map((w: string) =>
      normalize(String(w))
    )
  );

  function hasBadWordText(s?: string) {
    if (!s) return false;
    const normalized = normalize(s)
      .replace(/[^a-z0-9\s]/g, " ")
      .trim();
    const tokens = normalized.split(/\s+/).filter(Boolean);
    return tokens.some((t) => badSet.has(t));
  }

  const hasBadWord = hasBadWordText(conteudoUpdate);

  // Auto-resize do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [conteudoUpdate]);

  const isDirty = conteudoUpdate.trim() !== resposta.resposta.trim();

  const handleUpdate = () => {
    if (!conteudoUpdate.trim()) return;

    if (hasBadWord) {
      setError("Remova palavras impróprias antes de salvar.");
      return;
    }

    setError("");

    updateResposta(
      {
        id_resposta: resposta.id_resposta,
        fkId_pergunta: resposta.fkId_pergunta,
        fkId_usuario: resposta.fkId_usuario,
        resposta: conteudoUpdate,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            setIsOpen(false);
            onSuccess?.("Resposta atualizada");
          }, 1200);
        },
        onError: (err: any) => {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Erro ao atualizar resposta"
          );
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerId && (
        <DialogTrigger asChild>
          <button
            id={triggerId}
            className={
              triggerClassName ??
              "px-4 py-2 bg-purple-600 rounded-md text-white cursor-pointer hover:bg-purple-700 transition-transform duration-200"
            }
          >
            Editar
          </button>
        </DialogTrigger>
      )}
      <DialogContent
        // ensure overlay created by this inner dialog sits above the question modal
        // but below the edit modal content
        overlayClassName="z-[210]"
        contentClassName="z-[220] w-[calc(100vw-2rem)] sm:w-auto max-w-sm sm:max-w-md md:max-w-lg"
        className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900"
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            Editar sua resposta
          </DialogTitle>
        </DialogHeader>

        {/* Aviso informativo */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-lg border border-purple-100 bg-purple-50/60 px-3 py-2 flex gap-2 items-start"
        >
          <Info className="w-4 h-4 mt-0.5 text-purple-600" />
          <p className="text-xs sm:text-sm text-[var(--foreground)]">
            Altere sua resposta. Evite palavrões ou conteúdo ofensivo — podemos
            aplicar bloqueios.
          </p>
        </motion.div>

        {/* Mensagem de sucesso */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800 text-sm"
          >
            Resposta atualizada com sucesso!
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={conteudoUpdate}
                onChange={(e) => {
                  if (e.target.value.length <= 191) {
                    setConteudoUpdate(e.target.value);
                  }
                }}
                placeholder="Digite sua resposta..."
                maxLength={191}
                className="min-h-[60px] max-h-[400px] overflow-y-auto resize-none pr-10"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              />
              {/* Status icon */}
              <div className="absolute right-3 top-3">
                {hasBadWord ? (
                  <XCircle className="h-4 w-4 text-red-600" />
                ) : null}
              </div>
            </div>
            {/* Contador de caracteres */}
            <div className="flex justify-between items-center">
              <div>
                {(error || hasBadWord) && (
                  <p className="text-xs text-red-600">
                    {error || "A resposta contém palavras impróprias."}
                  </p>
                )}
              </div>
              <p
                className={`text-xs ${
                  conteudoUpdate.length >= 191
                    ? "text-red-600 font-semibold"
                    : "text-zinc-500"
                }`}
              >
                {conteudoUpdate.length}/191
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm cursor-pointer text-zinc-600 hover:text-zinc-800 transition"
            >
              Cancelar
            </button>
            <ActionButton
              onClick={handleUpdate}
              textIdle={!isDirty ? "Sem mudanças" : "Salvar alterações"}
              isLoading={isPending}
              isSuccess={success}
              disabled={!isDirty || hasBadWord || !conteudoUpdate.trim()}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
