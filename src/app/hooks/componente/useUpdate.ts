import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComponente } from "@/app/services/componenteService";

export function useUpdateComponente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComponente,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["componentes"] });
      
      // Se o componente está associado a um curso, invalidar também a query específica
      if (data.cursoId) {
        queryClient.invalidateQueries({ queryKey: ["componentes", "curso", data.cursoId] });
      }
    },
  });
}