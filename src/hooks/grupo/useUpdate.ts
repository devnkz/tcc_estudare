import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGrupo } from "@/services/grupos/UpdateGrupo";
import { Grupo, UpdateGrupoData } from "@/types/grupo";
import { useToken } from "@/lib/getTokenClient";

export function useUpdateGrupo() {
  const { token } = useToken();
  const queryClient = useQueryClient();

  // Usa a interface centralizada em types/grupo.ts para evitar divergência
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
