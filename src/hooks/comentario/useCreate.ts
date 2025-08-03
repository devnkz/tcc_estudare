import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComentario } from "@/services/comentarioService";

export function useCreateComentario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComentario,
    onSuccess: (data) => {
      // Invalidar todas as queries de comentários
      queryClient.invalidateQueries({ queryKey: ["comentarios"] });
    },
  });
}