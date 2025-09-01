import { useQuery } from "@tanstack/react-query";
import { fetchPerguntas } from "@/services/perguntaService";

export function useListPerguntas(initialData?: any[]) {
  return useQuery({
  queryKey: ['perguntas'],
  queryFn: fetchPerguntas,
  initialData,
});
}
