import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCurso } from "@/services/cursoService";

export function useDeleteCurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCurso(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cursos"] });
    },
  });
}