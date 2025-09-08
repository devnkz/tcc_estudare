import { fetchComponentes } from "@/services/componenteService";
import GroupsPage from "./client";
import { fetchUsers } from "@/services/userService";
import { fetchGrupos } from "@/services/grupoService";

export default async function IndexGroups() {
  const users = await fetchUsers();
  const componentes = await fetchComponentes();
  const grupos = await fetchGrupos();

  return <GroupsPage users={users} componentes={componentes} grupos={grupos} />;
}
