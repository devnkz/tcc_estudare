import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToken } from "@/lib/getTokenClient";
import { updatePergunta } from "@/services/perguntaService";
import { UpdatePerguntaData, Pergunta } from "@/types/pergunta";

export function useUpdatePergunta() {
  const { token } = useToken();
  const queryClient = useQueryClient();

  return useMutation<Pergunta, Error, UpdatePerguntaData>({
    mutationFn: async (data) => {
      if (!token) throw new Error("Token não disponível ainda");
      return await updatePergunta(data, token);
    },
    onSuccess: (data, variables) => {
      console.log("✅ Retorno da API:", data);
      console.log("📦 Payload enviado:", variables);

      queryClient.invalidateQueries({ queryKey: ["perguntas"] });
    },
    onError: (error, variables) => {
      console.error("❌ Erro ao atualizar pergunta:", error);
      console.log("📦 Payload que causou erro:", variables);
    },
  });
}
