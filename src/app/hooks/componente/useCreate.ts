import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComponente } from "@/app/services/componenteService";

export function useCreateComponente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComponente,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["componentes"] });
    },
  });
}