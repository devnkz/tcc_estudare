import { CreateCursoData } from "@/types/curso";
import { useState } from "react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateCurso } from "@/hooks/curso/useCreate";
import { useToast } from "@/components/ui/animatedToast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Info, CheckCircle } from "lucide-react";
import { ActionButton } from "@/components/ui/actionButton";
import { filtrarTexto } from "@/utils/filterText";
import { motion, AnimatePresence } from "framer-motion";

export function SignUpCursoModal({
  openDialog,
  setOpenDialog,
  onFeedback,
}: {
  openDialog: null | "curso" | "componente" | "usuario";
  setOpenDialog: (value: null | "curso" | "componente" | "usuario") => void;
  onFeedback?: (type: "success" | "error" | "info", message: string) => void;
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateCursoData>({
    defaultValues: {
      nome: "",
    },
  });

  const { mutate, isPending } = useCreateCurso();
  const { push } = useToast();
  const [success, setSuccess] = useState(false as boolean);

  const [badWord, setBadWord] = React.useState(false);
  const onSubmit = (data: CreateCursoData) => {
    if (badWord) {
      push({ kind: "error", message: "Remova palavras impróprias." });
      return;
    }
    mutate(data, {
      onSuccess: () => {
        setSuccess(true);
        onFeedback?.("success", "Curso criado com sucesso.");
        push({ kind: "success", message: "Curso criado com sucesso." });
        setTimeout(() => {
          setSuccess(false);
          setOpenDialog(null);
        }, 1600);
      },
      onError: (err: any) => {
        // backend envia { error: "..." } em vez de { message } no controller de curso
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Falha ao criar curso.";
        onFeedback?.("error", msg);
        push({ kind: "error", message: msg });
      },
    });
  };

  return (
    <Dialog
      open={openDialog === "curso"}
      onOpenChange={() => setOpenDialog(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Curso</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Aviso estilo perfil */}
          <div className="rounded-lg border border-purple-100 bg-purple-50/60 px-3 py-2 flex gap-2 items-start">
            <Info className="w-4 h-4 mt-0.5 text-purple-600" />
            <p className="text-xs sm:text-sm text-[var(--foreground)]">
              Os nomes passam por um filtro anti-palavrões e caracteres
              inválidos.
            </p>
          </div>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-lg border border-purple-200 bg-purple-100/60 px-3 py-2 flex gap-2 items-start"
            >
              <CheckCircle className="w-4 h-4 mt-0.5 text-purple-700" />
              <p className="text-xs sm:text-sm text-[var(--foreground)]">
                Curso criado com sucesso.
              </p>
            </motion.div>
          )}
          <Controller
            name="nome"
            control={control}
            rules={{ required: "O nome do curso é obrigatório" }}
            render={({ field }) => (
              <div className="space-y-1">
                <Input
                  {...field}
                  label="Nome do curso"
                  placeholder="Digite o nome do curso"
                  podeMostrarSenha={false}
                  onChange={(e) => {
                    field.onChange(e);
                    const check = filtrarTexto(e.target.value || "");
                    setBadWord(check.contemPalavraOfensiva);
                  }}
                  error={badWord}
                />
                <AnimatePresence>
                  {badWord && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-600"
                    >
                      Remova palavras impróprias.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          />
          <div className="flex justify-end">
            <ActionButton
              type="submit"
              textIdle="Cadastrar Curso"
              isLoading={isPending}
              isSuccess={success}
              enableRipplePulse
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
