import { fetchComponentes } from "@/services/componenteService";
import AskQuestionPage from "./client";
import { fetchCursos } from "@/services/cursoService";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface JWTPayload {
  id: string;
}

export default async function askQuestionIndex() {
  const componentes = await fetchComponentes();
  const cursos = await fetchCursos();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let userId: string | undefined = undefined;

  if (typeof token === "string") {
    const decoded = jwtDecode<JWTPayload>(token);
    userId = decoded.id;
  }

  return (
    <AskQuestionPage
      componentes={componentes}
      cursos={cursos}
      id_usuario={userId as string}
    />
  );
}
