import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComentario } from "@/app/services/comentarioService";

export function useUpdateComentario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComentario,
    onSuccess: (data) => {
      // Invalidar todas as queries de comentários
      queryClient.invalidateQueries({ queryKey: ["comentarios"] });
      
      // Se o comentário está associado a um artigo
      if (data.artigoId) {
        queryClient.invalidateQueries({ queryKey: ["comentarios", "artigo", data.artigoId] });
      }
      
      // Se o comentário está associado a uma pergunta
      if (data.perguntaId) {
        queryClient.invalidateQueries({ queryKey: ["comentarios", "pergunta", data.perguntaId] });
      }
      
      // Se o comentário está associado a uma resposta
      if (data.respostaId) {
        queryClient.invalidateQueries({ queryKey: ["comentarios", "resposta", data.respostaId] });
      }
    },
  });
}