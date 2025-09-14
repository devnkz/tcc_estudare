import { useQuery } from "@tanstack/react-query";
import { fetchGrupos } from "@/services/grupos/grupoService";
import { Grupo } from "@/types/grupo";

export function useListGrupos(initialData?: Grupo[]) {
  return useQuery({
    queryKey: ["grupos"],
    queryFn: fetchGrupos,
    initialData,
  });
}
