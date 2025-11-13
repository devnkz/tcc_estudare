"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Componente } from "@/types/componente";
import { Pergunta } from "@/types/pergunta";
import { useUpdatePergunta } from "@/hooks/pergunta/useUpdate";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Info, Loader2, CheckCircle2, XCircle } from "lucide-react";
import badWordsJSON from "@/utils/badWordsPT.json";
import { ActionButton } from "@/components/ui/actionButton";

interface ModalUpdateQuestionProps {
  componentes?: Componente[];
  pergunta: Pergunta;
  triggerId?: string;
  triggerClassName?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (msg?: string) => void;
}

export default function ModalUpdateQuestion({
  pergunta,
  triggerId,
  triggerClassName,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
}: ModalUpdateQuestionProps) {
  const [conteudoUpdate, setConteudoUpdate] = useState(pergunta.pergunta);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Usa controlled se fornecido, senão usa interno
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledOnOpenChange || setInternalIsOpen;

  const { mutate: updatePergunta, isPending } = useUpdatePergunta();

  // Reseta conteúdo e erro quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setConteudoUpdate(pergunta.pergunta);
      setError("");
      setSuccess(false);
    }
  }, [isOpen, pergunta.pergunta]);

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

  // Debounce para animação de checking
  useEffect(() => {
    setChecking(true);
    const t = setTimeout(() => setChecking(false), 450);
    return () => clearTimeout(t);
  }, [conteudoUpdate]);

  // Auto-resize do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [conteudoUpdate]);

  const isDirty = conteudoUpdate.trim() !== pergunta.pergunta.trim();

  const handleUpdate = () => {
    if (!conteudoUpdate.trim()) return;

    if (hasBadWord) {
      setError("Remova palavras impróprias antes de salvar.");
      return;
    }

    setError("");

    updatePergunta(
      {
        id_pergunta: pergunta.id_pergunta,
        pergunta: conteudoUpdate,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            setIsOpen(false);
            onSuccess?.("Pergunta atualizada");
          }, 1200);
        },
        onError: (err: any) => {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Erro ao atualizar pergunta"
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
      <DialogContent className="z-[100] w-[calc(100vw-2rem)] sm:w-auto max-w-sm sm:max-w-md md:max-w-lg rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            Editar sua pergunta
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
            Altere sua pergunta. Evite palavrões ou conteúdo ofensivo — podemos
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
            Pergunta atualizada com sucesso!
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
                placeholder="Digite sua pergunta..."
                maxLength={191}
                className="min-h-[80px] max-h-[400px] overflow-y-auto resize-none pr-10"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              />
              {/* Status icon */}
              <div className="absolute right-3 top-3">
                {checking ? (
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                ) : conteudoUpdate.trim() && !hasBadWord ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 animate-in fade-in" />
                ) : hasBadWord ? (
                  <XCircle className="h-4 w-4 text-red-600 animate-in fade-in" />
                ) : null}
              </div>
            </div>
            {/* Contador de caracteres */}
            <div className="flex justify-between items-center">
              <div>
                {(error || hasBadWord) && (
                  <p className="text-xs text-red-600">
                    {error || "A pergunta contém palavras impróprias."}
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
              enableRipplePulse
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
