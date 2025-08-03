import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGrupo } from "@/app/services/grupoService";

export function useUpdateGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGrupo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
    },
  });
}