// hooks/grupo/useCreate.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGrupo } from "@/services/grupos/grupoService"
import { CreateGrupoData, Grupo } from "@/types/grupo";

export function useCreateGrupo() {
  const queryClient = useQueryClient();

  return useMutation<Grupo, Error, CreateGrupoData>({
    mutationFn: createGrupo,
    onSuccess: (newGrupo) => {
      queryClient.invalidateQueries({ queryKey: ["grupos", "byUser"] });
      queryClient.setQueryData<Grupo[]>(["grupos"], (old) =>
        old ? [...old, newGrupo] : [newGrupo]
      );
    },
  });
}
