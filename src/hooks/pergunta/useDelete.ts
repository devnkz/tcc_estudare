import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToken } from "@/lib/getTokenClient";
import { deletePergunta } from "@/services/perguntaService";

export function useDeletePergunta() {
  const { token } = useToken();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      if (!token) throw new Error("Token não disponível ainda");

      await deletePergunta(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perguntas"] });
    },
  });
}
