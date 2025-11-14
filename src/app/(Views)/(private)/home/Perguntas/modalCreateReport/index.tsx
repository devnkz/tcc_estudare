"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateDenuncia } from "@/hooks/denuncia/useCreate";
import { useForm, Controller } from "react-hook-form";
import { CreateDenunciaData } from "@/types/denuncia";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import badWordsJSON from "@/utils/badWordsPT.json";
import { checkDenuncia } from "@/services/denuncia";
import { useToast } from "@/components/ui/animatedToast";

interface ModalCreateDenunciaProps {
  id_usuario: string;
  id_conteudo: string;
  fkId_usuario_conteudo: string;
  tipo_conteudo: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (msg?: string) => void;
}

export default function ModalCreateDenuncia({
  id_usuario,
  id_conteudo,
  tipo_conteudo,
  fkId_usuario_conteudo,
  isOpen,
  onOpenChange,
  onSuccess,
}: ModalCreateDenunciaProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateDenunciaData>();

  const [submitError, setSubmitError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(false);
  const [alreadyReported, setAlreadyReported] = useState(false);
  const descricaoText = watch("descricao") || "";

  const { mutate, isPending } = useCreateDenuncia();
  const { push } = useToast();

  // Verifica se já existe denúncia ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      checkDenuncia(id_usuario, id_conteudo, tipo_conteudo)
        .then((result) => {
          if (result.exists) {
            setAlreadyReported(true);
            push({
              kind: "error",
              title: "Você já denunciou este conteúdo",
              message: "A denúncia está em análise pela equipe Estudare.",
              duration: 4000,
            });
          } else {
            setAlreadyReported(false);
          }
        })
        .catch((err) => {
          console.error("Erro ao verificar denúncia:", err);
        });
    }
  }, [isOpen, id_usuario, id_conteudo, tipo_conteudo]);

  // Badwords normalization & checking
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

  const badSet = useMemo(() => {
    const list = (badWordsJSON as any)?.words ?? [];
    return new Set<string>(list.map((w: string) => normalize(String(w))));
  }, []);

  function hasBadWordText(s: string) {
    if (!s) return false;
    const normalized = normalize(s)
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    return normalized.some((token) => badSet.has(token));
  }

  const hasBadWord = useMemo(
    () => hasBadWordText(descricaoText),
    [descricaoText, badSet]
  );

  // Debounced checking animation
  useEffect(() => {
    if (!descricaoText.trim()) {
      setChecking(false);
      return;
    }
    setChecking(true);
    const timer = setTimeout(() => setChecking(false), 450);
    return () => clearTimeout(timer);
  }, [descricaoText]);

  const onSubmit = (data: CreateDenunciaData) => {
    if (alreadyReported) {
      push({
        kind: "error",
        title: "Você já denunciou este conteúdo",
        message: "A denúncia está em análise pela equipe Estudare.",
        duration: 4000,
      });
      return;
    }

    if (hasBadWord) {
      setSubmitError("A descrição contém palavras impróprias.");
      return;
    }

    const payload: CreateDenunciaData = {
      ...data,
      fkId_usuario: id_usuario,
      fkId_conteudo_denunciado: id_conteudo,
      fkId_usuario_conteudo: fkId_usuario_conteudo,
      tipo_conteudo: tipo_conteudo,
      resultado: "...",
    };

    setSubmitError("");
    mutate(payload, {
      onSuccess: () => {
        setSuccess(true);
        push({
          kind: "success",
          title: "Denúncia registrada com sucesso!",
          message: "Nossa equipe irá analisar em breve.",
          duration: 3000,
        });
        onSuccess?.("Denúncia registrada! Nossa equipe irá analisar em breve.");
        setTimeout(() => {
          reset();
          setSuccess(false);
          setAlreadyReported(true);
          onOpenChange(false);
        }, 2500);
      },
      onError: (err: any) => {
        setSubmitError(
          err?.response?.data?.message ||
            err?.message ||
            "Erro ao enviar denúncia"
        );
      },
    });
  };

  const niveis = [
    { label: "Baixo", value: 1 },
    { label: "Médio", value: 2 },
    { label: "Alto", value: 3 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl border border-red-200 bg-white shadow-xl z-[110]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent flex flex-col gap-1">
            Registrar Denúncia
            <span className="text-xs font-medium text-red-500/70">
              Sua denúncia será analisada pela equipe de moderação
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Mensagem de sucesso */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-3 text-emerald-800 text-sm flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">
              Denúncia registrada com sucesso! Nossa equipe irá analisar.
            </span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Textarea com badwords */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-red-700">
              Descrição da Denúncia
            </Label>
            <div className="relative">
              <Textarea
                {...register("descricao", {
                  required: "A descrição é obrigatória",
                  maxLength: { value: 191, message: "Máximo 191 caracteres" },
                  onChange: (e) => {
                    if (e.target.value.length <= 191) {
                      setValue("descricao", e.target.value);
                    }
                    // Auto-resize
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${target.scrollHeight}px`;
                  },
                })}
                maxLength={191}
                placeholder="Descreva o motivo da denúncia..."
                className="min-h-[100px] max-h-[300px] overflow-y-auto resize-y pr-10 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
                ) : descricaoText.trim() && !hasBadWord ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 animate-in fade-in" />
                ) : hasBadWord ? (
                  <XCircle className="h-4 w-4 text-red-600 animate-in fade-in" />
                ) : null}
              </div>
            </div>
            {/* Contador e erros */}
            <div className="flex justify-between items-center">
              <div>
                {(errors.descricao || hasBadWord) && (
                  <p className="text-[11px] text-red-600">
                    {errors.descricao?.message ||
                      "A descrição contém palavras impróprias."}
                  </p>
                )}
              </div>
              <p
                className={`text-xs font-medium ${
                  descricaoText.length >= 191 ? "text-red-600" : "text-zinc-500"
                }`}
              >
                {descricaoText.length}/191
              </p>
            </div>
          </div>

          {/* Select de nível */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-red-700">
              Nível de Gravidade *
            </Label>
            <Controller
              name="nivel_denuncia"
              control={control}
              rules={{ required: "Selecione o nível da denúncia" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger
                    className={`w-full rounded-lg border transition-all duration-300 ${
                      field.value
                        ? "border-red-500 bg-red-50 text-red-900"
                        : "border-red-200 bg-white hover:border-red-400"
                    }`}
                  >
                    <SelectValue placeholder="Selecione o nível de gravidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Nível de Gravidade</SelectLabel>
                      {niveis.map((n) => (
                        <SelectItem key={n.value} value={String(n.value)}>
                          {n.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.nivel_denuncia && (
              <p className="text-[11px] text-red-600">
                {errors.nivel_denuncia.message}
              </p>
            )}
          </div>

          {submitError && (
            <p className="text-red-600 text-sm font-medium">{submitError}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                setAlreadyReported(false);
                onOpenChange(false);
              }}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-800 transition cursor-pointer"
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              disabled={
                isPending ||
                hasBadWord ||
                !descricaoText.trim() ||
                success ||
                alreadyReported
              }
              className="relative inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-500 hover:to-rose-500 transition cursor-pointer overflow-hidden"
              whileTap={{ scale: 0.98 }}
              animate={
                success
                  ? {
                      backgroundColor: ["#dc2626", "#10b981", "#dc2626"],
                    }
                  : {}
              }
              transition={{ duration: 0.6 }}
            >
              {isPending ? (
                <motion.span
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.span
                    className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "linear",
                    }}
                  />
                  Enviando...
                </motion.span>
              ) : success ? (
                <motion.span
                  className="flex items-center gap-2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.4 }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </motion.div>
                  Enviado
                </motion.span>
              ) : (
                "Enviar Denúncia"
              )}
            </motion.button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
