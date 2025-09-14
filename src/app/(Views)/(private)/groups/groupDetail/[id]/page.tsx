import { fetchGruposById } from "@/services/grupos/grupoService";
import ClientGrupoDetail from "./client";
import { fetchUsers } from "@/services/userService";

interface GrupoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GrupoDetailPage({
  params,
}: GrupoDetailPageProps) {
  const { id } = await params;

  const grupo = await fetchGruposById({ id });
  const users = await fetchUsers();

  console.log("Grupo fetched:", grupo);

  if (!grupo) {
    return <div>Grupo não encontrado</div>;
  }

  return <ClientGrupoDetail grupoAtual={grupo} users={users} />;
}
