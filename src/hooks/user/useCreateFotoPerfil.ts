import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFotoUser } from "@/services/userService";
import { User } from "@/types/user";

export function useUpdateUserFoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      createFotoUser(data, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // Atualiza a lista de usuários (preserva penalidades ao mesclar)
      queryClient.setQueryData(["users"], (old: any) => {
        if (!old) return [data];
        return old.map((u: any) => (u.id === data.id_usuario ? data : u));
      });

      // Atualiza o usuário individual se você tiver outra query ["user", id]
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
