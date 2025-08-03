import DashboardPage from "./client";

export default async function DashboardPageIndex() {
  const resTipoUsuario = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tipousuario`
  );
  const dataTipoUsuario = await resTipoUsuario.json();

  const resCurso = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/curso`);
  const dataCurso = await resCurso.json();

  return <DashboardPage tipousuario={dataTipoUsuario} cursos={dataCurso} />;
}
