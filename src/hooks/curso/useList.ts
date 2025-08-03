import { useQuery } from "@tanstack/react-query";
import { fetchCursos } from "@/services/cursoService";

export function useListCursos() {
  return useQuery({
    queryKey: ['cursos'],
    queryFn: fetchCursos,
  });
}