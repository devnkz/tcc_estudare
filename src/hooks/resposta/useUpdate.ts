import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateResposta } from "@/services/respostaService";
import {  Resposta, UpdateRespostaData } from "@/types/resposta";

export function useUpdateResposta() {
  const queryClient = useQueryClient();

  return useMutation<Resposta, Error, UpdateRespostaData>({
    mutationFn: async (data) => {
      return await updateResposta(data);
    },
    onSuccess: (data, variables) => {
      console.log("✅ Resposta atualizada:", data);
      console.log("📦 Payload enviado:", variables);

      queryClient.invalidateQueries({ queryKey: ["respostas"] });
    },
    onError: (error, variables) => {
      console.error("❌ Erro ao atualizar resposta:", error);
      console.log("📦 Payload que causou erro:", variables);
    },
  });
}
