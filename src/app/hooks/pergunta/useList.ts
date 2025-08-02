import { useQuery } from "@tanstack/react-query";
import { fetchPerguntas } from "@/app/services/perguntaService";

export function useListPerguntas() {
  return useQuery({
  queryKey: ['perguntas'],
  queryFn: fetchPerguntas,
});
}
