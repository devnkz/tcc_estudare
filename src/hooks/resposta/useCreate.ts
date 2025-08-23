import { dataTagErrorSymbol, useMutation, useQueryClient } from "@tanstack/react-query";
import { createResposta } from "@/services/respostaService";

export function useCreateResposta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResposta,
    onSuccess: (data) => {
      // Invalidar todas as queries de respostas
      console.log("Resposta criada com sucesso:", data);
      queryClient.invalidateQueries({ queryKey: ["respostas"] });
    },
  });
}