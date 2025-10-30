import Footer from "@/components/layout/footer";
import PerguntasIndex from "./Perguntas";
import { getTokenFromCookie } from "@/lib/getTokenServer";

import { Inter } from "next/font/google";
import { jwtDecode } from "jwt-decode";
import { InitialPage } from "./client";
import { fetchUsersId } from "@/services/userService";
import {
  BsEmojiAngry,
  BsEmojiExpressionless,
  BsEmojiGrin,
} from "react-icons/bs";

const inter = Inter({ subsets: ["latin"] });

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

  // Lógica de credibilidade
  const cred = user?.credibilidade_usuario ?? 0;
  let CredEmoji = BsEmojiGrin;
  let credMsg = "";
  let credCor = "";

  if (cred < 35) {
    CredEmoji = BsEmojiAngry;
    credMsg = "Você precisa ser mais responsável!";
    credCor = "bg-red-100 text-red-600";
  } else if (cred < 70) {
    CredEmoji = BsEmojiExpressionless;
    credMsg = "Atenção! Cuide mais de suas ações.";
    credCor = "bg-yellow-100 text-yellow-600";
  } else {
    CredEmoji = BsEmojiGrin;
    credMsg = "Excelente! Continue com essa credibilidade.";
    credCor = "bg-green-100 text-green-600";
  }

  return (
    <div className={inter.className}>
      <main className="flex flex-col w-full items-center justify-start">
        <InitialPage userData={user} />
        <PerguntasIndex id_usuario={decoded.id} />
      </main>
    </div>
  );
}
