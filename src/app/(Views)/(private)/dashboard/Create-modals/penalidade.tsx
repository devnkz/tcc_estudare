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
import { useToast } from "@/components/ui/animatedToast";
import { CreatePenalidadeData } from "@/types/penalidade";
import { isBefore, startOfDay, startOfToday } from "date-fns";
import { fetchUsersId } from "@/services/userService";

type Props = {
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
  fkId_usuario: string;
  fkId_denuncia: string;
  usuarioNome?: string;
  denunciaNivel?: number;
  onFeedback?: (type: "success" | "error" | "info", message: string) => void;
};

export function PenalidadeModal({
  openDialog,
  setOpenDialog,
  fkId_usuario,
  fkId_denuncia,
  usuarioNome,
  denunciaNivel,
  onFeedback,
}: Props) {
  const { mutate, isPending } = useCreatePenalidade();
  const { push } = useToast();

  const {
    handleSubmit,
    control,
    reset,
    watch,
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

  const [userName, setUserName] = React.useState<string | null>(
    usuarioNome ?? null
  );

  React.useEffect(() => {
    let mounted = true;
    if (!usuarioNome && fkId_usuario) {
      // try to fetch user name by id
      fetchUsersId(fkId_usuario)
        .then((u) => {
          if (!mounted) return;
          const name = u?.nome_usuario || u?.apelido_usuario || null;
          setUserName(name);
        })
        .catch(() => {
          if (!mounted) return;
          setUserName(null);
        });
    } else {
      setUserName(usuarioNome ?? null);
    }
    return () => {
      mounted = false;
    };
  }, [fkId_usuario, usuarioNome]);

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
        push({ kind: "success", message: "Penalidade aplicada." });
        onFeedback?.("success", "Penalidade aplicada.");
        reset();
        setOpenDialog(false);
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message || "Erro ao aplicar penalidade.";
        push({ kind: "error", message: msg });
        onFeedback?.("error", msg);
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
        const inicio = watch("dataInicio_penalidade");
        const today = startOfToday();
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
              <PopoverContent className="w-auto p-0 z-[100]" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(date);
                    setOpen(false);
                  }}
                  disabled={(date) => {
                    const d = startOfDay(date);
                    if (fieldName === "dataInicio_penalidade") {
                      return isBefore(d, today);
                    }
                    // dataFim não pode ser antes de hoje nem antes do início selecionado
                    const minEnd = inicio
                      ? startOfDay(new Date(inicio))
                      : today;
                    return isBefore(d, minEnd);
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
      <DialogContent className="max-w-lg rounded-2xl border border-red-200 bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent flex flex-col gap-1">
            Aplicar Penalidade
            <span className="text-xs font-medium text-red-500/70">
              Ação moderadora permanente no histórico
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-red-100 bg-red-50/60 p-3 flex flex-col gap-1">
            <span className="font-semibold text-red-700 text-sm truncate">
              Usuário
            </span>
            <span className="text-red-600/80 truncate">
              {userName ?? usuarioNome ?? fkId_usuario}
            </span>
          </div>
          <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-3 flex flex-col gap-1">
            <span className="font-semibold text-rose-700 text-sm truncate">
              Denúncia Nível
            </span>
            <span className="text-rose-600/80">{denunciaNivel ?? "—"}</span>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderCalendarField("dataInicio_penalidade", "Data de Início")}
            {renderCalendarField("dataFim_penalidade", "Data de Fim")}
          </div>

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
                <Label className="text-sm font-semibold text-red-700">
                  Perda de Credibilidade (%)
                </Label>
                <input
                  type="number"
                  {...field}
                  className="w-full mt-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.perder_credibilidade && (
                  <p className="text-[11px] text-red-600 mt-1">
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
                <Label className="text-sm font-semibold text-red-700">
                  Descrição
                </Label>
                <textarea
                  {...field}
                  rows={4}
                  className="w-full mt-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-y"
                  placeholder="Explique o motivo, impacto e evidências breves."
                />
                {errors.descricao && (
                  <p className="text-[11px] text-red-600 mt-1">
                    {errors.descricao.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpenDialog(false)}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-800 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="relative inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-500 hover:to-rose-500 transition cursor-pointer"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />{" "}
                  Aplicando...
                </span>
              ) : (
                "Aplicar Penalidade"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
