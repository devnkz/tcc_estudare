import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services/userService";
import { User } from "@/types/user"; // ajuste os tipos conforme seu projeto

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser: User) => {
      // Atualiza cache de todos os usuários, se tiver listagem
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // Atualiza cache de um usuário específico
      queryClient.setQueryData<User>(["user", updatedUser.id_usuario], updatedUser);
    },
  });
}
