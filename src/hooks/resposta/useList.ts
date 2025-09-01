import { useQuery } from "@tanstack/react-query";
import { fetchRespostas } from "@/services/respostaService";

export function useListRespostas(initialData?: any[]) {
  return useQuery({
    queryKey: ['respostas'],
    queryFn: fetchRespostas,
    initialData
  });
}