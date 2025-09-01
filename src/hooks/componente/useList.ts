import { useQuery } from "@tanstack/react-query";
import { fetchComponentes } from "@/services/componenteService";

export function useListComponentes(initialData?: any[]) {
  return useQuery({
    queryKey: ['componentes'],
    queryFn: fetchComponentes,
    initialData
  });
}