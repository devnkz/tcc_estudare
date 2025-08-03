import { useQuery } from "@tanstack/react-query";
import { fetchComentarios } from "@/app/services/comentarioService";

export function useListComentarios() {
  return useQuery({
    queryKey: ['comentarios'],
    queryFn: fetchComentarios,
  });
}