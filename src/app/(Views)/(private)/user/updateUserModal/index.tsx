import { UpdateUserData } from "@/types/user";
import { Controller, useForm } from "react-hook-form";
import { useUpdateUser } from "@/hooks/user/useUpdate";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

export function UpdateUserModal({
  openDialog,
  setOpenDialog,
  user,
}: {
  openDialog: null | "usuario";
  setOpenDialog: (value: null | "usuario") => void;
  user: any;
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateUserData>({
    defaultValues: {
      id: user.id,
      name: user.name,
      apelido: user.apelido,
      email: user.email,
      senha: user.senha,
    },
  });

  console.log(user);

  const { mutate, isPending } = useUpdateUser();

  const onSubmit = (data: UpdateUserData) => {
    console.log("Dados enviados ao backend:", data);
    mutate(data);
  };

  return (
    <Dialog
      open={openDialog === "usuario"}
      onOpenChange={() => setOpenDialog(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar suas informações</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Seu nome"
                placeholder="Digitar seu novo nome"
                podeMostrarSenha={false}
              />
            )}
          />
          <Controller
            name="apelido"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Seu apelido"
                placeholder="Digitar seu novo apelido"
                podeMostrarSenha={false}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Seu email"
                placeholder="Digitar seu novo email"
                podeMostrarSenha={false}
              />
            )}
          />
          <Controller
            name="senha"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Sua senha"
                placeholder="Digitar sua nova senha"
                podeMostrarSenha={false}
              />
            )}
          />
          <button
            type="submit"
            disabled={isPending}
            className="p-4 rounded-md bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-950 hover:-translate-y-1 transition-all duration-300 cursor-pointer disabled:opacity-60"
          >
            <p className="text-white text-xs lg:text-lg">
              {isPending ? "Enviando..." : "Alterar"}
            </p>
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
