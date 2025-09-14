import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGrupo } from "@/services/grupos/UpdateGrupo";
import { Grupo } from "@/types/grupo";
import { useToken } from "@/lib/getTokenClient";

export interface UpdateGrupoData {
  id: string;
  nomeGrupo?: string;
  fkIdComponente?: string;
  novosMembrosIds?: string[];
}

export function useUpdateGrupo() {
  const { token } = useToken();
  const queryClient = useQueryClient();

  return useMutation<Grupo, Error, UpdateGrupoData>({
    mutationFn: (data: UpdateGrupoData) => {
      if (!token) throw new Error("Token não disponível ainda");
      return updateGrupo(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
    },
  });
}
