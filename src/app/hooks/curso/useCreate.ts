import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCurso } from "@/app/services/cursoService";

export function useCreateCurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCurso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cursos"] });
    },
  });
}