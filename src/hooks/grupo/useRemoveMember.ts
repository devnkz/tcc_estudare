import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToken } from "@/lib/getTokenClient";
import { RemoveMemberAndGroup } from "@/services/grupos/grupoService";

export interface RemoveGrupoMemberData {
  grupoId: string;
  membroId: string;
}

export function useRemoveGrupoMember() {
  const { token } = useToken();
  const queryClient = useQueryClient();

  return useMutation<void, Error, RemoveGrupoMemberData>({
    mutationFn: async ({ grupoId, membroId }) => {
      if (!token) throw new Error("Token não disponível ainda");
      await RemoveMemberAndGroup(grupoId, membroId, token);
    },
    onSuccess: (_, { grupoId }) => {
      queryClient.invalidateQueries({ queryKey: ["grupos", grupoId] });
    },
    onError: (err) => {
      console.error("Erro ao remover membro:", err);
    },
  });
}
