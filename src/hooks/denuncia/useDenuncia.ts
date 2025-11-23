import { useQuery } from "@tanstack/react-query";
import { fetchDenunciaById } from "@/services/denuncia";
import { Denuncia } from "@/types/denuncia";

export function useDenuncia(id?: string) {
  return useQuery<Denuncia, Error>({
    queryKey: ["denuncia", id],
    queryFn: () => fetchDenunciaById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
