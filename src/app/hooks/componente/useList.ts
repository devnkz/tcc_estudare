import { useQuery } from "@tanstack/react-query";
import { fetchComponentes } from "@/app/services/componenteService";

export function useListComponentes() {
  return useQuery({
    queryKey: ['componentes'],
    queryFn: fetchComponentes,
  });
}