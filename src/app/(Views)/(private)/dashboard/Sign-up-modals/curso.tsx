import { CreateCursoData } from "@/types/curso";
import { Controller, useForm } from "react-hook-form";
import { useCreateCurso } from "@/hooks/curso/useCreate";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

export function SignUpCursoModal({openDialog, setOpenDialog}: {
  openDialog: null | "curso" | "componente" | "usuario";
  setOpenDialog: (value: null | "curso" | "componente" | "usuario") => void;
}) {

const {
  handleSubmit,
  control,
  formState: { errors },
} = useForm<CreateCursoData>({
  defaultValues: {
    nomeCurso: "",
  },
});

const { mutate, isPending } = useCreateCurso();

const onSubmit = (data: CreateCursoData) => {
  console.log("Dados enviados ao backend:", data);
  mutate(data);
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
            <Controller
              name="nomeCurso"
              control={control}
              rules={{ required: "O nome do curso é obrigatório" }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nome do curso"
                  placeholder="Digite o nome do curso"
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
                {isPending ? "Enviando..." : "Cadastrar Curso"}
              </p>
            </button>
          </form>
        </DialogContent>
      </Dialog>
    );
}
