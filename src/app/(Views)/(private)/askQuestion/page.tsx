import { fetchComponentes } from "@/services/componenteService";
import AskQuestionPage from "./client";

export default async function askQuestionIndex() {
  const componentes = await fetchComponentes();

  return <AskQuestionPage componentes={componentes} />;
}
