import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComponente } from "@/app/services/componenteService";

export function useCreateComponente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComponente,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["componentes"] });
      
      // Se o componente está associado a um curso, invalidar também a query específica
      if (data.cursoId) {
        queryClient.invalidateQueries({ queryKey: ["componentes", "curso", data.cursoId] });
      }
    },
  });
}