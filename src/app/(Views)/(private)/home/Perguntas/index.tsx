import { fetchPerguntas } from "@/services/perguntaService";
import { PerguntasClientPage } from "./client";
import { fetchComponentes } from "@/services/componenteService";
import { fetchCursos } from "@/services/cursoService";
import { fetchRespostas } from "@/services/respostaService";

export default async function PerguntasIndex() {
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
    />
  );
}
