import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArtigo } from "@/app/services/artigoService";

export function useCreateArtigo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArtigo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artigos"] });
    },
  });
}