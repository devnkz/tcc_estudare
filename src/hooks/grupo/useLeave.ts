import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToken } from "@/lib/getTokenClient";
import { LeaveGroup } from "@/services/grupos/leaveGroup";

export function useLeaveGroup() {
  const { token } = useToken();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { grupoId: string }>({
    mutationFn: async ({ grupoId }) => {
      if (!token) throw new Error("Token não disponível ainda");

      await LeaveGroup(grupoId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
    },
  });
}
