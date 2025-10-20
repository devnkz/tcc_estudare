"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/buttonCalendar";
import { useCreatePenalidade } from "@/hooks/penalidade/useCreate";
import { CreatePenalidadeData } from "@/types/penalidade";

type Props = {
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
  fkId_usuario: string;
  fkId_denuncia: string;
};

export function PenalidadeModal({
  openDialog,
  setOpenDialog,
  fkId_usuario,
  fkId_denuncia,
}: Props) {
  const { mutate, isPending } = useCreatePenalidade();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreatePenalidadeData>({
    defaultValues: {
      fkId_usuario,
      fkId_denuncia,
      dataInicio_penalidade: undefined,
      dataFim_penalidade: undefined,
      perder_credibilidade: 0,
      descricao: "",
    },
  });

  const onSubmit = (data: CreatePenalidadeData) => {
    // garante que o valor seja Date antes de converter
    const payload: CreatePenalidadeData = {
      ...data,
      dataInicio_penalidade: data.dataInicio_penalidade
        ? new Date(data.dataInicio_penalidade).toISOString()
        : undefined,
      dataFim_penalidade: data.dataFim_penalidade
        ? new Date(data.dataFim_penalidade).toISOString()
        : undefined,
      perder_credibilidade: Number(data.perder_credibilidade),
    } as any;

    mutate(payload, {
      onSuccess: () => {
        reset();
        setOpenDialog(false);
      },
      onError: (err) => {
        console.error("Erro ao criar penalidade:", err);
      },
    });
  };

  const renderCalendarField = (
    fieldName: "dataInicio_penalidade" | "dataFim_penalidade",
    label: string
  ) => (
    <Controller
      name={fieldName}
      control={control}
      rules={{ required: `${label} é obrigatório` }}
      render={({ field }) => {
        const [open, setOpen] = React.useState(false);
        return (
          <div>
            <Label>{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {field.value
                    ? new Date(field.value).toLocaleDateString()
                    : `Selecione ${label.toLowerCase()}`}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors[fieldName] && (
              <p className="text-xs text-red-600 mt-1">
                {errors[fieldName]?.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Aplicar Penalidade</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {renderCalendarField("dataInicio_penalidade", "Data de Início")}
          {renderCalendarField("dataFim_penalidade", "Data de Fim")}

          <Controller
            name="perder_credibilidade"
            control={control}
            rules={{
              required: "Informe a perda de credibilidade",
              min: { value: 0, message: "Valor mínimo é 0" },
              max: { value: 100, message: "Valor máximo é 100" },
            }}
            render={({ field }) => (
              <div>
                <Label>Perda de Credibilidade (%)</Label>
                <input
                  type="number"
                  {...field}
                  className="w-full p-2 border rounded"
                />
                {errors.perder_credibilidade && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.perder_credibilidade.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="descricao"
            control={control}
            rules={{ required: "Descrição obrigatória" }}
            render={({ field }) => (
              <div>
                <Label>Descrição</Label>
                <textarea
                  {...field}
                  className="w-full p-2 border rounded"
                  placeholder="Motivo da penalidade"
                />
                {errors.descricao && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.descricao.message}
                  </p>
                )}
              </div>
            )}
          />

          <button
            type="submit"
            disabled={isPending}
            className="p-3 w-full bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? "Aplicando..." : "Aplicar Penalidade"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
