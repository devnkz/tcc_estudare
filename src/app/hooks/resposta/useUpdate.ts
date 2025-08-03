import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateResposta } from "@/app/services/respostaService";

export function useUpdateResposta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateResposta,
    onSuccess: (data) => {
      // Invalidar todas as queries de respostas
      queryClient.invalidateQueries({ queryKey: ["respostas"] });
    },
  });
}