import { fetchPerguntas } from "@/services/perguntaService";
import { PerguntasClientPage } from "./client";
import { fetchComponentes } from "@/services/componenteService";

export default async function PerguntasIndex() {
  const perguntas = await fetchPerguntas();
  const componentes = await fetchComponentes();

  return (
    <PerguntasClientPage perguntas={perguntas} componentes={componentes} />
  );
}
