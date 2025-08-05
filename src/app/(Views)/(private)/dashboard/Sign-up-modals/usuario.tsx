"use client";

import { CreateUserData } from "@/types/user";
import { useCreateUser } from "@/hooks/user/useCreate";
import { Controller, useForm } from "react-hook-form";

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

type Props = {
  openDialog: null | "curso" | "componente" | "usuario";
  setOpenDialog: (value: null | "curso" | "componente" | "usuario") => void;
  tipousuarios: any[]; // ideal substituir any por tipo real
};

export function SignUpUserModal({
  openDialog,
  setOpenDialog,
  tipousuarios,
}: Props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateUserData>({
    defaultValues: {
      name: "",
      email: "",
      senha: "",
      apelido: "",
      fkIdTipoUsuario: "",
    },
  });

  const { mutate, isPending } = useCreateUser();

  const onSubmit = (data: CreateUserData) => {
    console.log("Dados enviados ao backend:", data);
    mutate(data, {
      onSuccess: () => {
        reset(); // limpa o form
        setOpenDialog(null); // fecha o modal
      },
      // você pode adicionar onError etc.
    });
  };

  return (
    <Dialog
      open={openDialog === "usuario"}
      onOpenChange={() => setOpenDialog(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar usuário</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* NAME */}
          <Controller
            name="name"
            control={control}
            rules={{ required: "O nome do usuário é obrigatório" }}
            render={({ field }) => (
              <>
                <Input {...field} label="Nome" placeholder="Nome completo" />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </>
            )}
          />

          {/* EMAIL */}
          <Controller
            name="email"
            control={control}
            rules={{
              required: "O email é obrigatório",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Email inválido" },
            }}
            render={({ field }) => (
              <>
                <Input
                  {...field}
                  label="Email"
                  placeholder="email@exemplo.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </>
            )}
          />

          {/* APELIDO */}
          <Controller
            name="apelido"
            control={control}
            rules={{ required: "O apelido é obrigatório" }}
            render={({ field }) => (
              <>
                <Input
                  {...field}
                  label="Apelido"
                  placeholder="Digite seu apelido"
                />
                {errors.apelido && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.apelido.message}
                  </p>
                )}
              </>
            )}
          />

          {/* SENHA */}
          <Controller
            name="senha"
            control={control}
            rules={{
              required: "A senha é obrigatória",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            }}
            render={({ field }) => (
              <>
                <Input
                  {...field}
                  label="Senha"
                  placeholder="Senha"
                  podeMostrarSenha={true}
                />
                {errors.senha && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.senha.message}
                  </p>
                )}
              </>
            )}
          />

          {/* TIPO DE USUÁRIO (SELECT) */}
          <Controller
            name="fkIdTipoUsuario"
            control={control}
            rules={{ required: "Selecione um tipo de usuário" }}
            render={({ field }) => (
              <>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full bg-zinc-200 rounded-sm hover:border-purple-600 cursor-pointer">
                    <SelectValue placeholder="Selecione o tipo de usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipo usuário</SelectLabel>
                      {tipousuarios && tipousuarios.length > 0 ? (
                        tipousuarios.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {/* tenta usar campos mais prováveis, com fallback */}
                            {item.nomeTipoUsuario}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm">Nenhum encontrado</div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.fkIdTipoUsuario && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.fkIdTipoUsuario.message}
                  </p>
                )}
              </>
            )}
          />

          <button
            type="submit"
            disabled={isPending}
            className="p-4 rounded-md bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-700 transition-all duration-300 disabled:opacity-60"
          >
            <p className="text-white text-xs lg:text-lg">
              {isPending ? "Enviando..." : "Cadastrar Usuário"}
            </p>
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
