import { useQuery } from "@tanstack/react-query";
import { fetchUsersId } from "@/services/userService";
import { User } from "@/types/user";

export function useGetUser(userId?: string, initialData?: User) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUsersId(userId),
    initialData,
    enabled: !!userId,
  });
}
