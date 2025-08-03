import { useQuery } from "@tanstack/react-query";
import { fetchArtigos } from "@/app/services/artigoService";

export function useListArtigos() {
  return useQuery({
    queryKey: ['artigos'],
    queryFn: fetchArtigos,
  });
}