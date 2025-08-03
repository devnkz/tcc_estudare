import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResposta } from "@/app/services/respostaService";

export function useCreateResposta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResposta,
    onSuccess: (data) => {
      // Invalidar todas as queries de respostas
      queryClient.invalidateQueries({ queryKey: ["respostas"] });
      
      // Se a resposta está associada a uma pergunta
      if (data.perguntaId) {
        queryClient.invalidateQueries({ queryKey: ["respostas", "pergunta", data.perguntaId] });
        // Também invalidar a pergunta, pois o número de respostas pode ter mudado
        queryClient.invalidateQueries({ queryKey: ["pergunta", data.perguntaId] });
        queryClient.invalidateQueries({ queryKey: ["perguntas"] });
      }
    },
  });
}