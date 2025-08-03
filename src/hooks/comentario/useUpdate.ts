import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComentario } from "@/services/comentarioService";

export function useUpdateComentario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComentario,
    onSuccess: (data) => {
      // Invalidar todas as queries de comentários
      queryClient.invalidateQueries({ queryKey: ["comentarios"] });
    },
  });
}