import { fetchGruposById } from "@/services/grupos/grupoService";
import ClientGrupoDetail from "./client";
import { fetchUsers } from "@/services/userService";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface JWTPayload {
  id: string;
}

interface GrupoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GrupoDetailPage({
  params,
}: GrupoDetailPageProps) {
  const { id } = await params;

  const grupo = await fetchGruposById({ id });
  const users = await fetchUsers();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let userId: string | undefined = undefined;

  if (typeof token === "string") {
    const decoded = jwtDecode<JWTPayload>(token);
    userId = decoded.id;
  }

  console.log("Grupo fetched:", grupo);

  if (!grupo) {
    return <div>Grupo não encontrado</div>;
  }

  return (
    <ClientGrupoDetail
      grupoAtual={grupo}
      users={users}
      id_usuario_logado={userId as string}
    />
  );
}
