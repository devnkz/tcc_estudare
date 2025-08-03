import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComponente } from "@/services/componenteService";

export function useUpdateComponente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComponente,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["componentes"] });
      
     
    },
  });
}