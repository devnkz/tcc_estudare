import { fetchPerguntas } from "@/services/perguntaService";
import { PerguntasClientPage } from "./client";
import { fetchComponentes } from "@/services/componenteService";
import { fetchCursos } from "@/services/cursoService";
import { fetchRespostas } from "@/services/respostaService";

interface User {
  id_usuario: string;
}

export default async function PerguntasIndex({ id_usuario }: User) {
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
    />
  );
}
