import { fetchDenuncias } from "@/services/denuncia";
import DashboardPage from "./client";
import { fetchCursos } from "@/services/cursoService";
import { fetchComponentes } from "@/services/componenteService";
import { fetchUsers } from "@/services/userService";
import { fetchPerguntas } from "@/services/perguntaService";
import { fetchRespostas } from "@/services/respostaService";
import { fetchGrupos } from "@/services/grupos/grupoService";
import { getTokenFromCookie } from "@/lib/getTokenServer";
import { jwtDecode } from "jwt-decode";
import { isAdmin, isAdminEmail } from "@/lib/roles";
import { redirect } from "next/navigation";

type TokenPayload = {
  id_usuario?: string;
  email_usuario?: string;
  [key: string]: any;
};

export default async function DashboardPageIndex() {
  // Server-side guard: only administrators allowed
  try {
    const token = await getTokenFromCookie();
    if (!token) redirect("/Auth/Login");
    const decoded = jwtDecode<any>(token!);
    const role = decoded?.tipo_usuario as string | undefined;
    const email = decoded?.email_usuario as string | undefined;
    if (!isAdmin(role || null) && !isAdminEmail(email)) redirect("/home");
  } catch (e) {
    redirect("/home");
  }

  const resTipoUsuario = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tipousuario`
  );
  const dataTipoUsuario = await resTipoUsuario.json();
  const [cursos, denuncias, componentes, users, perguntas, grupos, respostas] =
    await Promise.all([
      fetchCursos(),
      fetchDenuncias(),
      fetchComponentes(),
      fetchUsers(),
      fetchPerguntas(),
      fetchGrupos(),
      fetchRespostas(),
    ]);

  console.log(denuncias);

  return (
    <DashboardPage
      tipousuario={dataTipoUsuario}
      cursos={cursos}
      users={users}
      denuncias={denuncias}
      componentes={componentes}
      perguntas={perguntas}
      respostas={respostas}
      grupos={grupos}
    />
  );
}
