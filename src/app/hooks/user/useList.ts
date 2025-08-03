import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/app/services/userService";

export function useListUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}