import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services/userService";
import { User } from "@/types/user";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser: User) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      const userKey = ["user", updatedUser.id_usuario] as const;
      const previous = queryClient.getQueryData<User>(userKey) as User | undefined;

      let mergedUser = updatedUser;
      if (previous) {
      
        if (!('penalidades' in updatedUser) && previous.penalidades) {
          mergedUser = { ...mergedUser, penalidades: previous.penalidades } as User;
        }
        
      }

 
      queryClient.setQueryData<User>(userKey, mergedUser);
    },
  });
}
