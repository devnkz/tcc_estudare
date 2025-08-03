import AskQuestionPage from "./client";

export default async function askQuestionIndex() {
  const resComponentes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/componente`
  );
  const componentes = await resComponentes.json();

  return <AskQuestionPage componentes={componentes} />;
}
