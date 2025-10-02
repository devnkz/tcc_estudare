import { fetchComponentes } from "@/services/componenteService";
import GroupsPage from "./client";
import { fetchUsers } from "@/services/userService";
import { fetchGruposByUser } from "@/services/grupos/BuscarGruposDoUsuarioLogado";

export default async function IndexGroups() {
  const users = await fetchUsers();
  const grupos = await fetchGruposByUser();

  return <GroupsPage users={users} grupos={grupos} />;
}
