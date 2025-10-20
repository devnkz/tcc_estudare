"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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

interface ModalCreateDenunciaProps {
  id_usuario: string;
  id_conteudo: string;
  fkId_usuario_conteudo: string;
  tipo_conteudo: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ModalCreateDenuncia({
  id_usuario,
  id_conteudo,
  tipo_conteudo,
  fkId_usuario_conteudo,
  isOpen,
  onOpenChange,
}: ModalCreateDenunciaProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateDenunciaData>();

  const { mutate, isPending } = useCreateDenuncia();

  const onSubmit = (data: CreateDenunciaData) => {
    const payload: CreateDenunciaData = {
      ...data,
      fkId_usuario: id_usuario,
      fkId_conteudo_denunciado: id_conteudo,
      fkId_usuario_conteudo: fkId_usuario_conteudo,
      tipo_conteudo: tipo_conteudo,
      resultado: "...",
    };
    mutate(payload, {
      onSuccess: () => onOpenChange(false),
    });
  };

  const niveis = [
    { label: "Baixo", value: 1 },
    { label: "Médio", value: 2 },
    { label: "Alto", value: 3 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Denúncia</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <Textarea
            {...register("descricao", {
              required: "A descrição é obrigatória",
            })}
            placeholder="Descreva o motivo da denúncia"
          />
          {errors.descricao && (
            <p className="text-red-600 text-sm">{errors.descricao.message}</p>
          )}

          <Controller
            name="nivel_denuncia"
            control={control}
            rules={{ required: "Selecione o nível da denúncia" }}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={String(field.value)}
              >
                <SelectTrigger className="w-full text-base cursor-pointer bg-zinc-200 rounded border border-zinc-200 hover:border-red-500 hover:shadow-md transition-all duration-300">
                  <SelectValue placeholder="Selecione o nível da denúncia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Nível</SelectLabel>
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
            <p className="text-red-600 text-sm">
              {errors.nivel_denuncia.message}
            </p>
          )}

          <DialogFooter>
            <button
              type="submit"
              disabled={isPending}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50"
            >
              {isPending ? "Enviando..." : "Enviar denúncia"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
