import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComponente } from "@/app/services/componenteService";

export function useDeleteComponente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComponente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["componentes"] });
    },
  });
}