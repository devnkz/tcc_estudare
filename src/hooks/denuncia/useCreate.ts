import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDenuncia } from "@/services/denuncia";
import { CreateDenunciaData } from "@/types/denuncia";

export function useCreateDenuncia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDenuncia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["denuncias"] });
    },
    onError: (error: any, payload: CreateDenunciaData) => {
      console.error("Erro ao criar denúncia:", error);
      console.log("Payload que causou erro:", payload);
      // Aqui você pode exibir toast, alert, ou fazer log remoto
    },
  });
}
