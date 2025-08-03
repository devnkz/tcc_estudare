import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComentario } from "@/services/comentarioService";

export function useDeleteComentario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComentario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comentarios"] });
    },
  });
}