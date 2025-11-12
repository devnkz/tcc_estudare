import { UpdateUserData, User } from "@/types/user";
import { Controller, useForm } from "react-hook-form";
import { useUpdateUser } from "@/hooks/user/useUpdate";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Info, Loader2, CheckCircle2, XCircle } from "lucide-react";
import badWordsJSON from "@/utils/badWordsPT.json";
import React from "react";
import { ActionButton } from "@/components/ui/actionButton";

export function UpdateUserModal({
  openDialog,
  setOpenDialog,
  user,
}: {
  openDialog: null | "usuario";
  setOpenDialog: (value: null | "usuario") => void;
  user: User;
}) {
  const {
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<UpdateUserData>({
    defaultValues: {
      id_usuario: user.id_usuario,
      nome_usuario: user.nome_usuario,
      apelido_usuario: user.apelido_usuario,
      email_usuario: user.email_usuario,
    },
  });

  const { mutate, isPending } = useUpdateUser();
  const values = watch();

  // normalização e checagem de palavrões (mesma lógica dos grupos)
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

  const nameHasBad = hasBadWordText(values?.nome_usuario);
  const nickHasBad = hasBadWordText(values?.apelido_usuario);

  // estados para animação de checagem (debounce)
  const [checkingNome, setCheckingNome] = React.useState(false);
  const [checkingApelido, setCheckingApelido] = React.useState(false);

  // simples debounce manual
  React.useEffect(() => {
    setCheckingNome(true);
    const t = setTimeout(() => setCheckingNome(false), 450);
    return () => clearTimeout(t);
  }, [values?.nome_usuario]);
  React.useEffect(() => {
    setCheckingApelido(true);
    const t = setTimeout(() => setCheckingApelido(false), 450);
    return () => clearTimeout(t);
  }, [values?.apelido_usuario]);

  const [success, setSuccess] = React.useState(false);

  const onSubmit = (data: UpdateUserData) => {
    console.log("Dados enviados ao backend:", data);
    // validação de palavrões
    let blocked = false;
    if (hasBadWordText(data.nome_usuario)) {
      setError("nome_usuario", {
        type: "validate",
        message: "Remova palavras impróprias do nome.",
      });
      blocked = true;
    }
    if (hasBadWordText(data.apelido_usuario)) {
      setError("apelido_usuario", {
        type: "validate",
        message: "Remova palavras impróprias do apelido.",
      });
      blocked = true;
    }
    if (blocked) return;

    mutate(data, {
      onSuccess: () => {
        setSuccess(true);
        // fecha com um pequeno delay para permitir feedback visual
        setTimeout(() => {
          setSuccess(false);
          setOpenDialog(null);
        }, 1200);
      },
    });
  };

  return (
    <Dialog
      open={openDialog === "usuario"}
      onOpenChange={() => setOpenDialog(null)}
    >
      <DialogContent className="w-[calc(100vw-2rem)] sm:w-auto max-w-sm sm:max-w-md md:max-w-lg rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            Atualizar suas informações
          </DialogTitle>
        </DialogHeader>

        {/* Aviso de orientação, alinhado ao modal de foto */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-lg border border-purple-100 bg-purple-50/60 px-3 py-2 flex gap-2 items-start"
        >
          <Info className="w-4 h-4 mt-0.5 text-purple-600" />
          <p className="text-xs sm:text-sm text-[var(--foreground)]">
            Altere seu nome e apelido. Evite palavrões ou conteúdo ofensivo —
            podemos aplicar bloqueios.
          </p>
        </motion.div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800 text-sm"
          >
            Informações atualizadas!
          </motion.div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="nome_usuario"
            control={control}
            render={({ field }) => {
              let statusIcon: React.ReactNode = null;
              if (checkingNome) {
                statusIcon = (
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                );
              } else if (field.value && !nameHasBad) {
                statusIcon = (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 animate-in fade-in" />
                );
              } else if (nameHasBad) {
                statusIcon = (
                  <XCircle className="h-4 w-4 text-red-600 animate-in fade-in" />
                );
              }
              return (
                <div className="space-y-1">
                  <Input
                    {...field}
                    label="Seu nome"
                    placeholder="Digitar seu novo nome"
                    podeMostrarSenha={false}
                    rightSlot={statusIcon}
                  />
                  {(errors?.nome_usuario?.message || nameHasBad) && (
                    <p className="text-xs text-red-600">
                      {errors?.nome_usuario?.message ||
                        "O nome contém palavras impróprias."}
                    </p>
                  )}
                </div>
              );
            }}
          />
          <Controller
            name="apelido_usuario"
            control={control}
            render={({ field }) => {
              let statusIcon: React.ReactNode = null;
              if (checkingApelido) {
                statusIcon = (
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                );
              } else if (field.value && !nickHasBad) {
                statusIcon = (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 animate-in fade-in" />
                );
              } else if (nickHasBad) {
                statusIcon = (
                  <XCircle className="h-4 w-4 text-red-600 animate-in fade-in" />
                );
              }
              return (
                <div className="space-y-1">
                  <Input
                    {...field}
                    label="Seu apelido"
                    placeholder="Digitar seu novo apelido"
                    podeMostrarSenha={false}
                    rightSlot={statusIcon}
                  />
                  {(errors?.apelido_usuario?.message || nickHasBad) && (
                    <p className="text-xs text-red-600">
                      {errors?.apelido_usuario?.message ||
                        "O apelido contém palavras impróprias."}
                    </p>
                  )}
                </div>
              );
            }}
          />
          {/* Campo de email removido conforme pedido */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setOpenDialog(null)}
              className="text-sm cursor-pointer text-zinc-600 hover:text-zinc-800 transition"
            >
              Cancelar
            </button>
            <ActionButton
              type="submit"
              textIdle={!isDirty ? "Sem mudanças" : "Salvar"}
              isLoading={isPending}
              isSuccess={success}
              disabled={!isDirty || nameHasBad || nickHasBad}
              enableRipplePulse
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
