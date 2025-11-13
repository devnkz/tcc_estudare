import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComponente } from "@/services/componenteService";

export function useDeleteComponente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteComponente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["componentes"] });
    },
  });
}