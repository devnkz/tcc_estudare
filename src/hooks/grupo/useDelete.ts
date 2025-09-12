import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGrupo } from "@/services/grupos/grupoService";

export function useDeleteGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGrupo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
    },
  });
}