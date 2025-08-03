import { useQuery } from "@tanstack/react-query";
import { fetchGrupos } from "@/app/services/grupoService";

export function useListGrupos() {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: fetchGrupos,
  });
}