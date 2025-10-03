import GroupsPage from "./client";
import { fetchUsers } from "@/services/userService";
import { fetchGruposByUser } from "@/services/grupos/BuscarGruposDoUsuarioLogado";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface JWTPayload {
  id: string;
}

export default async function IndexGroups() {
  const users = await fetchUsers();
  const grupos = await fetchGruposByUser();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let userId: string | undefined = undefined;

  if (typeof token === "string") {
    const decoded = jwtDecode<JWTPayload>(token);
    userId = decoded.id;
  }

  return (
    <GroupsPage users={users} grupos={grupos} id_usuario={userId as string} />
  );
}
