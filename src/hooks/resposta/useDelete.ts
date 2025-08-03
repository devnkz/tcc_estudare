import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteResposta } from "@/services/respostaService";

export function useDeleteResposta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteResposta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["respostas"] });
      // Como não temos acesso ao perguntaId aqui, invalidamos todas as perguntas também
      queryClient.invalidateQueries({ queryKey: ["perguntas"] });
    },
  });
}