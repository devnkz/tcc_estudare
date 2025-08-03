import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGrupo } from "@/services/grupoService";

export function useCreateGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGrupo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
    },
  });
}