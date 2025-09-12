import { fetchCursos } from "@/services/cursoService";
import CadastroUsuario from "./client";

export default async function indexPageRegister() {
  const cursos = await fetchCursos();

  return <CadastroUsuario cursos={cursos} />;
}
