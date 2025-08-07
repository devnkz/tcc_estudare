import { fetchUsers } from "@/services/userService";
import UsuarioClientPage from "./client";
export default async function UsuarioPage() {

  const users = await fetchUsers();
  console.log(users)

  return <UsuarioClientPage users={users}/>
}
