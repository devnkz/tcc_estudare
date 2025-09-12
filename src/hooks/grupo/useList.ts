import { useQuery } from "@tanstack/react-query";
import { fetchGrupos } from "@/services/grupos/grupoService";

export function useListGrupos() {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: fetchGrupos,
  });
}