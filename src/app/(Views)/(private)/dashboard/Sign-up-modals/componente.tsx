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

export function SignUpComponenteModal({
  openDialog,
  setOpenDialog,
  cursos
}: {
  openDialog: null | "curso" | "componente" | "usuario";
  setOpenDialog: (value: null | "curso" | "componente" | "usuario") => void;
  cursos: any[]
}) {

const {
  handleSubmit,
  control,
  formState: { errors },
} = useForm<CreateComponenteData>({
  defaultValues: {
    nomeComponente: "",
  },
});

const { mutate, isPending } = useCreateComponente();

const onSubmit = (data: CreateComponenteData) => {
  console.log("Dados enviados ao backend:", data);
  mutate(data);
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
          <Controller
            name="nomeComponente"
            control={control}
            rules={{ required: "O nome do curso é obrigatório" }}
            render={({ field }) => (
              <Input
                {...field}
                label="Nome do componente"
                placeholder="Digite o nome do componente"
                podeMostrarSenha={false}
              />
            )}
          />

          <label className="text-sm">Selecione o curso do componente</label>
          <Controller
            name="fkIdCurso"
            control={control}
            rules={{ required: "Selecione um curso" }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger className="w-full bg-zinc-200 rounded-sm hover:border-purple-600 cursor-pointer">
                  <SelectValue placeholder="Selecione o curso que esse componente pertence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cursos</SelectLabel>
                    {cursos.length > 0 ? (
                      cursos.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.nomeCurso}
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

          <button
            type="submit"
            disabled={isPending}
            className="p-4 rounded-md bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-950 hover:-translate-y-1 transition-all duration-300 cursor-pointer disabled:opacity-60"
          >
            <p className="text-white text-xs lg:text-lg">
              {isPending ? "Enviando..." : "Cadastrar Componente"}
            </p>
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
