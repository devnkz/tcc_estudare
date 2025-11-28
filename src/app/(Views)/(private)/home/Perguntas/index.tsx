import { fetchPerguntas } from "@/services/perguntaService";
import { PerguntasClientPage } from "./client";
import { fetchComponentes } from "@/services/componenteService";
import { fetchCursos } from "@/services/cursoService";
import { fetchRespostas } from "@/services/respostaService";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface User {
  id_usuario: string;
}
interface JWTPayload {
  tipo_usuario: string;
}

export default async function PerguntasIndex({ id_usuario }: User) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let tiposuario: string | undefined = undefined;

  if (typeof token === "string") {
    const decoded = jwtDecode<JWTPayload>(token);
    tiposuario = decoded.tipo_usuario;
  }

  const perguntas = await fetchPerguntas();
  const componentes = await fetchComponentes();
  const cursos = await fetchCursos();
  const respostas = await fetchRespostas();

  return (
    <PerguntasClientPage
      initialPerguntas={perguntas}
      initialComponentes={componentes}
      initialCursos={cursos}
      initialRespostas={respostas}
      id_usuario={id_usuario}
      tipousuario={tiposuario as string}
      token={token as string}
    />
  );
}
