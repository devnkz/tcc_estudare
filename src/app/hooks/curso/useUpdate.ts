import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurso } from "@/app/services/cursoService";

export function useUpdateCurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cursos"] });
    },
  });
}