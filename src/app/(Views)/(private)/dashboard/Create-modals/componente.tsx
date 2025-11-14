"use client";

import { CreateComponenteData } from "@/types/componente";
import { Controller, useForm } from "react-hook-form";
import { useCreateComponente } from "@/hooks/componente/useCreate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/animatedToast";
import { useState } from "react";
import * as React from "react";
import { Info, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ActionButton } from "@/components/ui/actionButton";
import { filtrarTexto } from "@/utils/filterText";

export function SignUpComponenteModal({
  openDialog,
  setOpenDialog,
  cursos,
  onFeedback,
}: {
  openDialog: null | "curso" | "componente" | "usuario";
  setOpenDialog: (value: null | "curso" | "componente" | "usuario") => void;
  cursos: any[];
  onFeedback?: (type: "success" | "error" | "info", message: string) => void;
}) {
  const { handleSubmit, control } = useForm<CreateComponenteData>({
    defaultValues: { nome: "", fkIdCurso: "" },
  });
  const { mutate, isPending } = useCreateComponente();
  const { push } = useToast();
  const [success, setSuccess] = useState(false);

  const [badWord, setBadWord] = React.useState(false);
  const onSubmit = (data: CreateComponenteData) => {
    if (badWord) {
      push({ kind: "error", message: "Remova palavras impróprias." });
      return;
    }
    mutate(data, {
      onSuccess: () => {
        setSuccess(true);
        push({ kind: "success", message: "Componente criado com sucesso." });
        onFeedback?.("success", "Componente criado com sucesso.");
        setTimeout(() => {
          setSuccess(false);
          setOpenDialog(null);
        }, 1600);
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message || "Falha ao criar componente.";
        push({ kind: "error", message: msg });
        onFeedback?.("error", msg);
      },
    });
  };

  return (
    <Dialog
      open={openDialog === "componente"}
      onOpenChange={() => setOpenDialog(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Componente</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-lg border border-purple-100 bg-purple-50/60 px-3 py-2 flex gap-2 items-start">
            <Info className="w-4 h-4 mt-0.5 text-purple-600" />
            <p className="text-xs sm:text-sm text-[var(--foreground)]">
              O nome do componente também passa pelo filtro de conteúdo.
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
                Componente criado com sucesso.
              </p>
            </motion.div>
          )}
          <Controller
            name="nome"
            control={control}
            rules={{ required: "O nome do componente é obrigatório" }}
            render={({ field }) => (
              <div className="space-y-1">
                <Input
                  {...field}
                  label="Nome do componente"
                  placeholder="Digite o nome do componente"
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

          <label className="text-sm">Selecione o curso do componente</label>
          <Controller
            name="fkIdCurso"
            control={control}
            rules={{ required: "Selecione um curso" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full bg-zinc-200 rounded-sm hover:border-purple-600 cursor-pointer">
                  <SelectValue placeholder="Selecione o curso que esse componente pertence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cursos</SelectLabel>
                    {cursos.length > 0 ? (
                      cursos.map((item) => (
                        <SelectItem
                          key={item.id_curso || item.id}
                          value={String(item.id_curso || item.id)}
                        >
                          {item.nome_curso || item.nomeCurso}
                        </SelectItem>
                      ))
                    ) : (
                      <div>Nenhum encontrado</div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <div className="flex justify-end">
            <ActionButton
              type="submit"
              textIdle="Cadastrar Componente"
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
