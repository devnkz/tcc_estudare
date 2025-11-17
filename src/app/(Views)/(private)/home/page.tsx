import Footer from "@/components/layout/footer";
import PerguntasIndex from "./Perguntas";
import { getTokenFromCookie } from "@/lib/getTokenServer";
import { Inter } from "next/font/google";
import { jwtDecode } from "jwt-decode";
import { InitialPage } from "./client";
import { fetchUsersId } from "@/services/userService";
import { redirect } from "next/navigation";
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

  const decoded = token ? jwtDecode<JWTPayload>(token)! : null;

  if (!decoded) {
    throw new Error("Token inválido ou não encontrado");
  }

  if (!decoded.id) {
    // redireciona para a página de login quando token faltar id
    redirect("/Auth/Login");
  }

  let user;
  try {
    user = await fetchUsersId(decoded.id);
  } catch (err) {
    // Em caso de erro ao buscar usuário (id inválido, erro de rede, etc.),
    // redireciona para a tela de login para forçar nova autenticação.
    console.error("HomePage: erro ao buscar usuário:", err);
    redirect("/Auth/Login");
  }

  return (
    <div className={`${inter.className} w-full`}>
      <main className="flex flex-col w-full items-center justify-start min-h-screen pb-10">
        {/* Cabeçalho e saudação */}
        <InitialPage userData={user} />

        {/* Box de perguntas */}
        <section className="w-full max-w-[1000px] mt-12 bg-white rounded-2xl shadow-md border border-zinc-200 p-8 flex flex-col items-center">
          {/* Título */}

          {/* Lista de perguntas (ou estado vazio) */}
          <div className="w-full text-center ">
            {/* Estado vazio */}
            <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-purple-200 rounded-xl py-6 px-6">
              <div className="text-3xl font-semibold text-gray-700 justify-center">
                <PerguntasIndex id_usuario={decoded.id} />
              </div>
              <p className="text-l text-gray-500 mb-4">
                Que tal fazer uma pergunta?
              </p>
              <a
                href="/askQuestion"
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200"
              >
                Fazer uma pergunta
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer full width */}
      <Footer />
    </div>
  );
}
