import { PerguntasClientPage } from "./client";

export default async function PerguntasIndex() {
  const resPerguntas = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pergunta`
  );
  const perguntas = await resPerguntas.json();

  const resComponentes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/componente`
  );
  const componentes = await resComponentes.json();

  return (
    <PerguntasClientPage perguntas={perguntas} componentes={componentes} />
  );
}
