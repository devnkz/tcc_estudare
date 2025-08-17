import { fetchPerguntas } from "@/services/perguntaService";
import { PerguntasClientPage } from "./client";
import { fetchComponentes } from "@/services/componenteService";
import { fetchCursos } from "@/services/cursoService";

export default async function PerguntasIndex() {
  const perguntas = await fetchPerguntas();
  const componentes = await fetchComponentes();
  const cursos = await fetchCursos();

  console.log(cursos);

  return (
    <PerguntasClientPage
      perguntas={perguntas}
      componentes={componentes}
      cursos={cursos}
    />
  );
}
