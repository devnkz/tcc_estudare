import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFotoUser } from "@/services/userService";
import { User } from "@/types/user";

export function useRemoveUserFoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeFotoUser(id),
    onSuccess: (data) => {
      // invalidate caches similar to update
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", data.id_usuario] });

      // Atualiza a lista de usuários
      queryClient.setQueryData(["users"], (old: any) => {
        if (!old) return [data];
        return old.map((u: any) => (u.id_usuario === data.id_usuario ? data : u));
      });

      // Mescla penalidades do cache anterior antes de sobrescrever o usuário individual
      const userKey = ["user", data.id_usuario] as const;
      const previous = queryClient.getQueryData<User>(userKey) as User | undefined;

      let merged = data as User;
      if (previous) {
        if (!("penalidades" in data) && previous.penalidades) {
          merged = { ...merged, penalidades: previous.penalidades } as User;
        }
      }

      queryClient.setQueryData(userKey, merged);
    },
  });
}
