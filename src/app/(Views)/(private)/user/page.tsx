import { fetchUsersId } from "@/services/userService";
import { fetchPerguntasByIdUser } from "@/services/perguntaService";
import UsuarioClientPage from "./client";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface JWTPayload {
  id: string;
}

export default async function IndexUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token || typeof token !== "string") {
    // No token -> require login (route is /Auth/Login)
    redirect("/Auth/Login");
  }

  let userId: string | undefined = undefined;
  try {
    const decoded = jwtDecode<JWTPayload>(token as string);
    userId = decoded.id;
  } catch (e) {
    // Invalid token -> clear token and redirect to login
    console.error("Invalid token:", e);
    try {
      cookieStore.delete("token");
    } catch (e) {
      // ignore
    }
    redirect("/Auth/Login");
  }

  let usuariosId;
  try {
    usuariosId = await fetchUsersId(userId);
  } catch (err: any) {
    console.error("Erro ao buscar usuário:", err);
    // If backend returned 500 (bad response) or user not found, clear token and redirect to login
    const status = err?.response?.status;
    if (status === 500 || status === 404 || err?.code === "ERR_BAD_RESPONSE") {
      try {
        cookieStore.delete("token");
      } catch (e) {
        // ignore
      }
      redirect("/Auth/Login");
    }
    // rethrow other errors to be handled by Next.js error boundary
    throw err;
  }

  const perguntas = await fetchPerguntasByIdUser({ userId: userId! });
  const usuario = usuariosId;

  console.log("Usuario", usuario);

  return <UsuarioClientPage usuario={usuario} perguntas={perguntas} />;
}
