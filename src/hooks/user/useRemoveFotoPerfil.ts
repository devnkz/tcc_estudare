import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFotoUser } from "@/services/userService";

export function useRemoveUserFoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeFotoUser(id),
    onSuccess: (data) => {
      // invalidate caches similar to update
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", data.id_usuario] });
      queryClient.setQueryData(["users"], (old: any) => {
        if (!old) return [data];
        return old.map((u: any) => (u.id_usuario === data.id_usuario ? data : u));
      });
      queryClient.setQueryData(["user", data.id_usuario], data);
    },
  });
}
