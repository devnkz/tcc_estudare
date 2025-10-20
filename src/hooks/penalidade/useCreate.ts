import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPenalidade } from "@/services/penalidadeService";
import { CreatePenalidadeData } from "@/types/penalidade";

export function useCreatePenalidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPenalidade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["penalidades"] });
    },
    onError: (error: any, payload: CreatePenalidadeData) => {
      console.error("Erro ao criar denúncia:", error);
      console.log("Payload que causou erro:", payload);
    },
  });
}
