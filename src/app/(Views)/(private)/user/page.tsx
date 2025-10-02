import { fetchUsersId } from "@/services/userService";
import { fetchPerguntasByIdUser } from "@/services/perguntaService";
import UsuarioClientPage from "./client";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface JWTPayload {
  id: string;
}

export default async function IndexUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let userId: string | undefined = undefined;

  if (typeof token === "string") {
    const decoded = jwtDecode<JWTPayload>(token);
    userId = decoded.id;
  }

  const usuariosId = await fetchUsersId(userId);
  const perguntas = await fetchPerguntasByIdUser({ userId: userId! });
  const usuario = usuariosId;

  return <UsuarioClientPage usuario={usuario} perguntas={perguntas} />;
}
