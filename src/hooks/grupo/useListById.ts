import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Grupo } from "@/types/grupo"; // ajuste para o caminho do seu tipo
import { fetchGruposById } from "@/services/grupos/grupoService";

// Hook React Query
export function useGrupoById(id: string) {
  return useQuery<Grupo, Error>({
    queryKey: ["grupos", id], // chave única por ID
    queryFn: () => fetchGruposById({ id }),
    enabled: !!id, // só roda se houver ID válido
  });
}
