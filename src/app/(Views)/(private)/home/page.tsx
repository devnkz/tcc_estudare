import Footer from "@/components/layout/footer";
import PerguntasIndex from "./Perguntas";
import { getTokenFromCookie } from "@/lib/getTokenServer";

import { Inter } from "next/font/google";
import { jwtDecode } from "jwt-decode";
import { InitialPage } from "./client";
import { fetchUsersId } from "@/services/userService";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface JWTPayload {
  id: string;
}

export default async function HomePage() {
  const token = await getTokenFromCookie();

  // Força o TS a tratar decoded como não nulo
  const decoded = token ? jwtDecode<JWTPayload>(token)! : null;

  if (!decoded) {
    throw new Error("Token inválido ou não encontrado");
  }

  console.log("ID do usuário decodificado:", decoded.id);

  const user = await fetchUsersId(decoded.id);

  return (
    <div className={inter.className}>
      <InitialPage userData={user} />
      <PerguntasIndex id_usuario={decoded.id} />
      <Footer />
    </div>
  );
}
