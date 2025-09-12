import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGrupo } from "@/services/grupos/grupoService";
import { CreateGrupoData, Grupo } from "@/types/grupo";

export function useCreateGrupo() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Grupo, Error, CreateGrupoData>({
    mutationFn: createGrupo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
    },
    onError: (error, variables) => {
      console.error("Erro ao criar grupo:", error);
      console.log("Dados enviados:", variables);
    },
  });

  return mutation;
}
