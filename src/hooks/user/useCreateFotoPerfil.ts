import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFotoUser } from "@/services/userService";

export function useUpdateUserFoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      createFotoUser(data, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Atualiza a lista de usuários
      queryClient.setQueryData(["users"], (old: any) => {
        if (!old) return [data];
        return old.map((u: any) => (u.id === data.id ? data : u));
      });

      // Atualiza o usuário individual se você tiver outra query ["user", id]
      queryClient.setQueryData(["user", data.id], data);
    },
  });
}
