import { fetchGruposById } from "@/services/grupos/grupoService";
import ClientGrupoDetail from "./client";
import { fetchUsers } from "@/services/userService";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface JWTPayload {
  id: string;
}

interface GrupoDetailPageProps {
  params: { id: string };
}

export default async function GrupoDetailPage({
  params,
}: GrupoDetailPageProps) {
  const { id } = await params;

  let grupo: any = null;
  try {
    grupo = await fetchGruposById({ id });
  } catch (e: any) {
    console.error("Falha ao buscar grupo:", e?.response?.status, e?.message);
    if (e?.response?.status === 404) {
      return <div>Grupo não encontrado</div>;
    }
    return <div>Erro ao carregar grupo</div>;
  }
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
