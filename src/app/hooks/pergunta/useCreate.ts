import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPergunta } from "@/app/services/perguntaService";

export function useCreatePergunta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPergunta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perguntas"] });
    },
  });
}
