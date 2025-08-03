import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePergunta } from "@/services/perguntaService";

export function useDeletePergunta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePergunta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perguntas"] });
    },
  });
}
