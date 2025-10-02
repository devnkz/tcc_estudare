import { useQuery } from "@tanstack/react-query";
import { fetchPerguntas } from "@/services/perguntaService";
import { Pergunta } from "@/types/pergunta";

export function useListPerguntas(initialData?: Pergunta[]) {
  return useQuery({
  queryKey: ['perguntas'],
  queryFn: fetchPerguntas,
  initialData,
});
}
