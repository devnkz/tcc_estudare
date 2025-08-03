import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteArtigo } from "@/services/artigoService";

export function useDeleteArtigo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:deleteArtigo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artigos"] });
    },
  });
}