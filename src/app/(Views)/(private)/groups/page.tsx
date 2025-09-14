import { fetchComponentes } from "@/services/componenteService";
import GroupsPage from "./client";
import { fetchUsers } from "@/services/userService";
import { fetchGruposByUser } from "@/services/grupos/BuscarGruposDoUsuarioLogado";

export default async function IndexGroups() {
  const users = await fetchUsers();
  const componentes = await fetchComponentes();
  const grupos = await fetchGruposByUser();

  console.log("Grupos buscados na página de grupos:", grupos);

  return <GroupsPage users={users} componentes={componentes} grupos={grupos} />;
}
