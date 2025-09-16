import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToken } from "@/lib/getTokenClient";
import { deleteResposta } from "@/services/respostaService";

export function useDeleteResposta() {
  const { token } = useToken();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      if (!token) throw new Error("Token não disponível ainda");

      await deleteResposta(id, token); // passa o token pro service
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["respostas"] });
      queryClient.invalidateQueries({ queryKey: ["perguntas"] }); // caso queira atualizar a lista de perguntas também
    },
  });
}
