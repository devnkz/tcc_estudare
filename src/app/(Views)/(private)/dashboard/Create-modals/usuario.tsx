"use client";

import * as React from "react";
import { CreateUserData } from "@/types/user";
import { useCreateUser } from "@/hooks/user/useCreate";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/animatedToast";
import { motion, AnimatePresence } from "framer-motion";
import { checkEmail } from "@/services/userService";

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
import { filtrarTexto } from "@/utils/filterText";
import { ActionButton } from "@/components/ui/actionButton";

// Pequena implementação local de debounce para evitar dependência externa
function debounce<F extends (...args: any[]) => void>(fn: F, wait = 300) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<F>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

type Props = {
  openDialog: null | "curso" | "componente" | "usuario";
  setOpenDialog: (value: null | "curso" | "componente" | "usuario") => void;
  tipousuarios: any[]; // ideal substituir any por tipo real
  onFeedback?: (type: "success" | "error" | "info", message: string) => void;
};

export function SignUpUserModal({
  openDialog,
  setOpenDialog,
  tipousuarios,
  onFeedback,
}: Props) {
  const [badFields, setBadFields] = React.useState<{
    nome?: boolean;
    apelido?: boolean;
  }>({});
  const [justSubmitted, setJustSubmitted] = React.useState(false);
  const [emailState, setEmailState] = React.useState<{
    checking: boolean;
    exists: boolean;
    touched: boolean;
    error?: string;
  }>({ checking: false, exists: false, touched: false });
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateUserData>({
    defaultValues: {
      nome_usuario: "",
      email_usuario: "",
      senha_usuario: "",
      apelido_usuario: "",
      fkIdTipoUsuario: "",
    },
  });

  const { mutate, isPending } = useCreateUser();
  const { push } = useToast();

  const onSubmit = (data: CreateUserData) => {
    setJustSubmitted(true);
    // bloqueia se estados em tempo real indicarem problema
    if (badFields.nome || badFields.apelido) {
      push({
        kind: "error",
        message: "Remova palavras impróprias antes de enviar.",
      });
      return;
    }
    if (emailState.exists) {
      push({ kind: "error", message: "Email já está em uso." });
      return;
    }
    mutate(data, {
      onSuccess: () => {
        push({ kind: "success", message: "Usuário criado com sucesso." });
        onFeedback?.("success", "Usuário criado com sucesso.");
        reset();
        setOpenDialog(null);
        setBadFields({});
        setJustSubmitted(false);
        setEmailState({ checking: false, exists: false, touched: false });
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Falha ao criar usuário.";
        push({ kind: "error", message: msg });
        onFeedback?.("error", msg);
      },
    });
  };

  const debouncedCheckEmail = React.useMemo(
    () =>
      debounce(async (value: string) => {
        if (!value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
          setEmailState((prev) => ({
            ...prev,
            checking: false,
            exists: false,
            error: value ? "Formato de email inválido" : "",
          }));
          return;
        }
        try {
          setEmailState((prev) => ({
            ...prev,
            checking: true,
            error: undefined,
          }));
          const res = await checkEmail(value);
          setEmailState((prev) => ({
            ...prev,
            checking: false,
            exists: res.exists,
          }));
        } catch (e: any) {
          setEmailState((prev) => ({
            ...prev,
            checking: false,
            error: "Falha ao validar email",
          }));
        }
      }, 450),
    []
  );

  return (
    <Dialog
      open={openDialog === "usuario"}
      onOpenChange={() => setOpenDialog(null)}
    >
      <DialogContent className="rounded-2xl border border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            Cadastrar usuário
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* NOME */}
          <Controller
            name="nome_usuario"
            control={control}
            rules={{ required: "O nome do usuário é obrigatório" }}
            render={({ field }) => (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                <Input
                  {...field}
                  label="Nome"
                  placeholder="Nome completo"
                  error={!!(errors as any).nome_usuario || !!badFields.nome}
                  onChange={(e) => {
                    field.onChange(e);
                    const val = e.target.value;
                    const resultado = filtrarTexto(val);
                    setBadFields((p) => ({
                      ...p,
                      nome: resultado.contemPalavraOfensiva,
                    }));
                  }}
                />
                <AnimatePresence>
                  {(errors as any).nome_usuario && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-600"
                    >
                      {(errors as any).nome_usuario?.message}
                    </motion.p>
                  )}
                  {badFields.nome && !(errors as any).nome_usuario && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-600"
                    >
                      Remova palavras impróprias do nome.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          />

          {/* EMAIL */}
          <Controller
            name="email_usuario"
            control={control}
            rules={{
              required: "O email é obrigatório",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Email inválido" },
            }}
            render={({ field }) => (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                <Input
                  {...field}
                  label="Email"
                  placeholder="email@exemplo.com"
                  error={
                    !!(errors as any).email_usuario ||
                    emailState.exists ||
                    !!emailState.error
                  }
                  onChange={(e) => {
                    field.onChange(e);
                    const val = e.target.value;
                    setEmailState((prev) => ({ ...prev, touched: true }));
                    debouncedCheckEmail(val);
                  }}
                />
                <AnimatePresence>
                  {!(errors as any).email_usuario &&
                    emailState.touched &&
                    emailState.checking && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-zinc-600"
                      >
                        Verificando email...
                      </motion.p>
                    )}
                  {!(errors as any).email_usuario &&
                    emailState.touched &&
                    emailState.error && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-600"
                      >
                        {emailState.error}
                      </motion.p>
                    )}
                  {!(errors as any).email_usuario &&
                    emailState.touched &&
                    emailState.exists && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-600"
                      >
                        Email já está em uso.
                      </motion.p>
                    )}
                  {(errors as any).email_usuario && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-600"
                    >
                      {(errors as any).email_usuario?.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          />

          {/* APELIDO */}
          <Controller
            name="apelido_usuario"
            control={control}
            rules={{ required: "O apelido é obrigatório" }}
            render={({ field }) => (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                <Input
                  {...field}
                  label="Apelido"
                  placeholder="Digite seu apelido"
                  error={
                    !!(errors as any).apelido_usuario || !!badFields.apelido
                  }
                  onChange={(e) => {
                    field.onChange(e);
                    const val = e.target.value;
                    const resultado = filtrarTexto(val);
                    setBadFields((p) => ({
                      ...p,
                      apelido: resultado.contemPalavraOfensiva,
                    }));
                  }}
                />
                <AnimatePresence>
                  {(errors as any).apelido_usuario && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-600"
                    >
                      {(errors as any).apelido_usuario?.message}
                    </motion.p>
                  )}
                  {badFields.apelido && !(errors as any).apelido_usuario && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-600"
                    >
                      Remova palavras impróprias do apelido.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          />

          {/* SENHA */}
          <Controller
            name="senha_usuario"
            control={control}
            rules={{
              required: "A senha é obrigatória",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            }}
            render={({ field }) => (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                <Input
                  {...field}
                  label="Senha"
                  placeholder="Senha"
                  podeMostrarSenha
                  error={!!(errors as any).senha_usuario}
                />
                <AnimatePresence>
                  {(errors as any).senha_usuario && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-600"
                    >
                      {(errors as any).senha_usuario?.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          />

          <label className="text-sm">Selecione o tipo de usuário</label>

          {/* TIPO DE USUÁRIO */}
          <Controller
            name="fkIdTipoUsuario"
            control={control}
            rules={{ required: "Selecione um tipo de usuário" }}
            render={({ field }) => (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full bg-zinc-200 rounded-sm hover:border-purple-600 cursor-pointer transform-gpu hover:-translate-y-0.5">
                    <SelectValue placeholder="Selecione o tipo de usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipo usuário</SelectLabel>
                      {tipousuarios && tipousuarios.length > 0 ? (
                        tipousuarios
                          .map((item: any) => {
                            const rawId =
                              item.id_tipoUsuario ??
                              item.id_tipousuario ??
                              item.id_tipo_usuario ??
                              item.idTipoUsuario ??
                              item.id ??
                              item.pkId_tipoUsuario;
                            const id = rawId ? String(rawId) : "";
                            if (!id) return null;
                            const label =
                              item.nomeTipoUsuario ??
                              item.nome_tipoUsuario ??
                              item.nome ??
                              item.descricao ??
                              `Tipo ${id}`;
                            return (
                              <SelectItem key={id} value={id}>
                                {label}
                              </SelectItem>
                            );
                          })
                          .filter(Boolean)
                      ) : (
                        <div className="p-2 text-sm">Nenhum encontrado</div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <AnimatePresence>
                  {errors.fkIdTipoUsuario && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-600"
                    >
                      {errors.fkIdTipoUsuario.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          />

          <div className="flex justify-end">
            <ActionButton
              type="submit"
              textIdle={isPending ? "Enviando..." : "Cadastrar Usuário"}
              isLoading={isPending}
              enableRipplePulse
              className="cursor-pointer"
              disabled={
                emailState.exists ||
                !!emailState.error ||
                badFields.nome ||
                badFields.apelido
              }
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
