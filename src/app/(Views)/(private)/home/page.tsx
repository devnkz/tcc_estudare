"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LightBulbIcon,
  PlusIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { jwtDecode } from "jwt-decode";
import { Inter } from "next/font/google";
import { fetchUsersId } from "@/services/userService";
import { deleteToken } from "@/lib/deleteToken";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/footer";
import PerguntasIndex from "./Perguntas";
import { LuFiles } from "react-icons/lu";
import {
  BsEmojiExpressionless,
  BsEmojiGrin,
  BsEmojiAngry,
} from "react-icons/bs";

const inter = Inter({ subsets: ["latin"] });

interface JWTPayload {
  id: string;
}

export default function HomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const [userPerguntas, setUserPerguntas] = useState<any[]>([]);

  const cores = ["bg-violet-600", "bg-blue-600", "bg-green-600", "bg-pink-600"];

  // Pegar altura do header
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

  // Buscar dados do usuário via token
  useEffect(() => {
    async function getUser() {
      try {
        const cookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        if (!cookie) return;

        const decoded = jwtDecode<JWTPayload>(cookie);
        const user = await fetchUsersId(decoded.id);
        setUserData(user);
        if (user?.perguntas) setUserPerguntas(user.perguntas);
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      }
    }
    getUser();
  }, []);

  // Fade-in inicial
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Lógica de credibilidade
  const cred = userData?.credibilidade_usuario ?? 0;
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
    <div
      className={`${inter.className} bg-white w-full min-h-screen flex flex-col transition-all`}
    >
      {/* conteúdo principal */}
      <div
        className={`flex flex-col items-center w-full transition-all min-h-screen duration-500 ${
          openPanel ? "lg:pr-[400px]" : ""
        }`}
        style={{ paddingTop: headerHeight }}
      >
        <div
          className={`w-full lg:max-w-[1200px] flex flex-col items-center min-h-screen p-4 transition-opacity duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* boas-vindas */}
          <div className="w-full space-y-6 my-8">
            <div className="text-black flex justify-between items-center">
              <div className="space-y-1">
                <h1 className="font-bold text-4xl text-gray-800">
                  Olá,{" "}
                  <span className="font-bold text-purple-600">
                    {userData?.nome_usuario || "usuário"}
                  </span>
                </h1>
                <p className="text-zinc-600 text-lg">Tem alguma dúvida hoje?</p>
              </div>

              {/* ícone de perfil */}
              <button
                onClick={() => setOpenPanel(!openPanel)}
                className="rounded-full bg-zinc-200 cursor-pointer p-2 hover:-translate-y-0.5 hover:shadow-md hover:bg-purple-500 hover:text-white transition-all duration-300 group"
              >
                <UserIcon className="h-6 w-6 text-black group-hover:text-white" />
              </button>
            </div>

            <h1 className="text-black text-center text-5xl lg:text-6xl font-bold mt-10">
              <span className="text-purple-600">Responda perguntas</span>
              <br />e ajude seus colegas!
            </h1>
            <p className="text-gray-500 text-center max-w-xl mx-auto text-lg">
              Compartilhe seu conhecimento e aprenda com os outros alunos.
            </p>
          </div>

          {/* botões principais */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/askQuestion"
              className="group p-3 rounded-lg bg-purple-500 flex gap-2 justify-center items-center hover:bg-purple-700 hover:transition-all cursor-pointer shadow-sm"
            >
              <LightBulbIcon className="h-5 w-5 text-white" />
              <p className="text-white font-medium text-lg lg:text-base">
                Faça uma pergunta
              </p>
            </Link>

            <Link
              href="/groups"
              className="group p-3 rounded-lg bg-purple-500 flex gap-2 justify-center items-center hover:bg-purple-700 hover:transition-all cursor-pointer shadow-sm"
            >
              <PlusIcon className="h-5 w-5 text-white" />
              <p className="text-white font-medium text-lg lg:text-base">
                Criar seu grupo
              </p>
            </Link>
          </div>

          {/* perguntas */}
          <div className="w-full mt-8">
            {userData?.id ? (
              <PerguntasIndex id_usuario={userData.id} />
            ) : (
              <p className="text-gray-500 text-center py-10 animate-pulse">
                Carregando perguntas...
              </p>
            )}
          </div>
        </div>

        {/* footer com fade */}
        <motion.div
          animate={{ opacity: openPanel ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Footer />
        </motion.div>
      </div>

      {/* painel lateral */}
      <AnimatePresence>
        {openPanel && (
          <motion.aside
            key="painel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="fixed right-0 h-[calc(100%-var(--header-height,0px))] bg-white shadow-2xl border-l border-zinc-200 z-40 flex flex-col"
            style={{ top: headerHeight, width: "380px", paddingTop: "5px" }}
          >
            <div className="flex justify-between items-center p-4 border-b border-zinc-100">
              <h2 className="text-xl font-bold text-gray-800">Seu Perfil</h2>
              <button
                onClick={() => setOpenPanel(false)}
                className="text-zinc-500 cursor-pointer hover:text-red-500 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center p-6 space-y-3 overflow-y-auto">
              {userData?.foto_perfil ? (
                <img
                  src={userData.foto_perfil}
                  alt="Foto do usuário"
                  className="h-32 w-32 rounded-full object-cover border-4 border-violet-500 shadow-md"
                />
              ) : (
                <div className="h-32 w-32 bg-zinc-300 rounded-full flex items-center justify-center border-4 border-violet-300">
                  <UserIcon className="h-14 w-14 text-zinc-500" />
                </div>
              )}

              <h1 className="font-bold text-2xl text-gray-800">
                {userData?.nome_usuario}
              </h1>
              <h2 className="text-zinc-600 text-sm">
                Apelido:{" "}
                <span className="font-medium">{userData?.apelido_usuario}</span>
              </h2>

              <div
                className={`mt-4 flex flex-col items-center gap-2 w-full p-3 rounded-xl shadow ${credCor}`}
              >
                <CredEmoji className="text-4xl p-1 animate-bounce" />
                <span className="font-semibold text-md">
                  Credibilidade: {cred}
                </span>
                <p className="text-xs text-center text-gray-700">{credMsg}</p>
              </div>

              <div className="mt-5 w-full">
                <h2 className="font-semibold text-gray-800 mb-2 text-lg">
                  Suas Perguntas
                </h2>
                <div className="bg-white rounded-lg border h-[250px] overflow-y-auto">
                  {userPerguntas?.length > 0 ? (
                    userPerguntas.map((p, index) => (
                      <div
                        key={p.id_pergunta}
                        className="flex gap-2 items-center px-2 py-3 border-b border-zinc-100"
                      >
                        <LuFiles
                          className={`h-8 w-8 p-1 rounded-full text-white ${
                            cores[index % cores.length]
                          }`}
                        />
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800">
                            {p.componente?.nome_componente}
                          </h3>
                          <p
                            className="text-zinc-600 text-sm truncate max-w-[200px]"
                            title={p.pergunta}
                          >
                            {p.pergunta}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500 text-center text-sm py-4">
                      Nenhuma pergunta feita ainda.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  deleteToken("token");
                  router.push("/login");
                }}
                className="w-full flex items-center justify-center gap-2 mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Sair
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
