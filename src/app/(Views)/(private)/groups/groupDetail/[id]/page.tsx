import { fetchGruposById } from "@/services/grupos/grupoService";
import ClientGrupoDetail from "./client";

interface GrupoDetailPageProps {
  params: { id: string };
}

export default async function GrupoDetailPage({
  params,
}: GrupoDetailPageProps) {
  const grupoId = params.id;

  const grupo = await fetchGruposById({ id: grupoId });

  if (!grupo) {
    return <div>Grupo não encontrado</div>;
  }

  return <ClientGrupoDetail grupoAtual={grupo} />;
}
