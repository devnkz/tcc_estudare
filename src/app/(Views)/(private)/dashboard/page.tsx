import { fetchDenuncias } from "@/services/denuncia";
import DashboardPage from "./client";
import { fetchCursos } from "@/services/cursoService";

export default async function DashboardPageIndex() {
  const resTipoUsuario = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tipousuario`
  );
  const dataTipoUsuario = await resTipoUsuario.json();
  const cursos = await fetchCursos();
  const denuncias = await fetchDenuncias();

  console.log(denuncias);

  return (
    <DashboardPage
      tipousuario={dataTipoUsuario}
      cursos={cursos}
      denuncias={denuncias}
    />
  );
}
