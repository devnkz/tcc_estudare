import GroupsPage from "./client";
import { fetchUsers } from "@/services/userService";
import { fetchGruposByUser } from "@/services/grupos/BuscarGruposDoUsuarioLogado";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { user } from "@heroui/react";

interface JWTPayload {
  id: string;
  nome_usuario: string;
}

export default async function IndexGroups() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let userId: string | undefined = undefined;
  let nomeUser: string | undefined = undefined;

  if (typeof token === "string") {
    const decoded = jwtDecode<JWTPayload>(token);
    userId = decoded.id;
    nomeUser = decoded.nome_usuario;
  }

  let users = await fetchUsers();
  const grupos = await fetchGruposByUser();

  if (userId) {
    users = users.filter((user) => user.id_usuario !== userId);
  }

  console.log("Grupos do usuário logado:", grupos);
  console.log(users);

  return (
    <GroupsPage
      users={users}
      grupos={grupos}
      id_usuario={userId as string}
      nome_usuario={nomeUser as string}
    />
  );
}
