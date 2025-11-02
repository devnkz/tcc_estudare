import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGrupo } from "@/services/grupos/UpdateGrupo";
import { Grupo } from "@/types/grupo";
import { useToken } from "@/lib/getTokenClient";

export interface UpdateGrupoData {
  id: string;
  nome_grupo?: string;
  fkIdComponente?: string;
  novosMembrosIds?: string[];
}

export function useUpdateGrupo() {
  const { token } = useToken();
  const queryClient = useQueryClient();

  return useMutation<Grupo, any, UpdateGrupoData>({
    mutationFn: async (data: UpdateGrupoData) => {
      if (!token) throw new Error("Token não disponível ainda");
      return updateGrupo(data, token);
    },
    onSuccess: (updatedGrupo) => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      console.log("Grupo atualizado com sucesso:", updatedGrupo);
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar grupo via mutation:", error);
    },
  });
}
