import Footer from "@/components/layout/footer";
import Link from "next/link";
import {
  LightBulbIcon,
  PlusIcon,
  BellIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import PerguntasIndex from "./Perguntas";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { fetchUsersId } from "@/services/userService";

interface JWTPayload {
  id: string;
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let userId: string | undefined = undefined;

  if (typeof token === "string") {
    const decoded = jwtDecode<JWTPayload>(token);
    userId = decoded.id;
  }

  const usuarioId = await fetchUsersId(userId);

  return (
    <div className="bg-white w-full flex flex-col justify-between items-center">
      <div className="w-full lg:max-w-[1200px] flex p-4">
        <div className="w-full p-4 flex flex-col items-center gap-4">
          <div id="inicialPage" className="w-full space-y-6 my-4">
            <div className="text-black flex justify-between items-center">
              <div>
                <h1 className="font-bold lg:text-xl">
                  Olá, {usuarioId.nome_usuario}
                </h1>
                <p className="text-zinc-600">Tem alguma dúvida hoje?</p>
              </div>
              <div className="flex space-x-3 lg:hidden">
                <Link
                  href="/notificacoes"
                  prefetch
                  className="rounded-full bg-zinc-200 p-2 relative hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 group"
                >
                  <BellIcon className="h-6 w-6 text-black group-hover:text-white" />
                  <span className="hidden group-hover:block absolute left-0 top-14 bg-zinc-400 text-white p-2 text-xs rounded-lg">
                    Notificações
                  </span>
                </Link>
                <Link
                  href="/user"
                  prefetch
                  className="rounded-full bg-zinc-200 p-2 relative hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 group"
                >
                  <UserIcon className="h-6 w-6 text-black group-hover:text-white" />
                  <span className="hidden group-hover:flex absolute left-0 top-14 bg-zinc-400 text-white p-2 text-xs rounded-lg whitespace-nowrap">
                    Sua conta
                  </span>
                </Link>
              </div>
            </div>

            <div className="flex space-x-2 my-6">
              <Link
                href="/askQuestion"
                prefetch
                className="p-2 rounded-md bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-950 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <p className="text-white text-xs lg:text-base">
                  Faça uma pergunta
                </p>
                <LightBulbIcon className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="/groups"
                prefetch
                className="p-2 rounded-md bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-950 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <p className="text-white text-xs lg:text-base">
                  Criar seu grupo
                </p>
                <PlusIcon className="h-4 w-4 text-white" />
              </Link>
            </div>

            <h1 className="text-black text-xl lg:text-4xl font-bold mt-14">
              RESPONDA <span className="text-purple-600">PERGUNTAS</span> E
              AJUDE COLEGAS <span className="text-purple-600">!</span>
            </h1>
          </div>
          <PerguntasIndex id_usuario={userId as string} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
