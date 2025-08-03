import { useQuery } from "@tanstack/react-query";
import { fetchComponentes } from "@/services/componenteService";

export function useListComponentes() {
  return useQuery({
    queryKey: ['componentes'],
    queryFn: fetchComponentes,
  });
}