import { fetchComponentes } from "@/services/componenteService";
import AskQuestionPage from "./client";
import { fetchCursos } from "@/services/cursoService";

export default async function askQuestionIndex() {
  const componentes = await fetchComponentes();
  const cursos = await fetchCursos();

  return <AskQuestionPage componentes={componentes} cursos={cursos} />;
}
