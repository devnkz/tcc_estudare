import { useQuery } from "@tanstack/react-query";
import { fetchRespostas } from "@/app/services/respostaService";

export function useListRespostas() {
  return useQuery({
    queryKey: ['respostas'],
    queryFn: fetchRespostas,
  });
}