import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCurso } from "@/services/cursoService";

export function useDeleteCurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCurso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cursos"] });
    },
  });
}