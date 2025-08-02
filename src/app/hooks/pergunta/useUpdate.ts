import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePergunta } from "@/app/services/perguntaService";

export function useUpdatePergunta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePergunta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perguntas"] });
    },
  });
}
