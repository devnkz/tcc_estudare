import { useQuery } from "@tanstack/react-query";
import { fetchComentarios } from "@/services/comentarioService";

export function useListComentarios() {
  return useQuery({
    queryKey: ['comentarios'],
    queryFn: fetchComentarios,
  });
}