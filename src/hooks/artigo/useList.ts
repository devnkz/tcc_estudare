import { useQuery } from "@tanstack/react-query";
import { fetchArtigos } from "@/services/artigoService";

export function useListArtigos() {
  return useQuery({
    queryKey: ['artigos'],
    queryFn: fetchArtigos,
  });
}