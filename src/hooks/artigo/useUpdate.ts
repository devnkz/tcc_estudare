import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateArtigo } from "@/services/artigoService";

export function useUpdateArtigo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArtigo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artigos"] });
    },
  });
}