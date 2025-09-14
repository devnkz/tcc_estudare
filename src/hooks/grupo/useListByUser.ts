import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Grupo } from "@/types/grupo";
import { useToken } from "@/lib/getTokenClient";

export function useListGruposByUser(initialData: Grupo[]) {
  const { token }  = useToken();

  return useQuery<Grupo[], Error>({
    queryKey: ["grupos", "byUser"],
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/grupo/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    initialData,
    refetchOnMount: "always",
    staleTime: 1000 * 60,
  });
}
