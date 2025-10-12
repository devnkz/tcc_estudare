"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/layout/footer";
import PerguntasIndex from "./Perguntas";
import {
  LightBulbIcon,
  PlusIcon,
  BellIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { Inter } from "next/font/google";
import { jwtDecode } from "jwt-decode";
import { fetchUsersId } from "@/services/userService";
import { useHeaderOffset } from "@/hooks/useHeaderOffset";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface JWTPayload {
  id: string;
}

export default function HomePage() {
  const [userData, setUserData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  // 1️⃣ Detecta altura do header
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  // 2️⃣ Busca usuário via cookie no client
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
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      }
    }

    getUser();
  }, []);

  // 3️⃣ Fade-in ao montar o conteúdo
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${
        inter.className
      } bg-white w-full flex flex-col min-h-screen justify-between items-center transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="w-full lg:max-w-[1200px] flex flex-col items-center p-4 transition-all duration-500"
        style={{ paddingTop: headerHeight }}
      >
        {/* Seção de boas-vindas */}
        <div id="inicialPage" className="w-full space-y-6 my-8">
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

            {/* Ícones mobile */}
            <div className="flex space-x-3 lg:hidden">
              <Link
                href="/notificacoes"
                prefetch
                className="rounded-full bg-zinc-200 p-2 relative hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 group"
              >
                <BellIcon className="h-6 w-6 text-black group-hover:text-white" />
                <span className="hidden group-hover:block absolute left-0 top-14 bg-purple-600 text-white p-2 text-xs rounded-lg shadow-md">
                  Notificações
                </span>
              </Link>

              <Link
                href="/user"
                prefetch
                className="rounded-full bg-zinc-200 p-2 relative hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 group"
              >
                <UserIcon className="h-6 w-6 text-black group-hover:text-white" />
                <span className="hidden group-hover:flex absolute left-0 top-14 bg-purple-600 text-white p-2 text-xs rounded-lg shadow-md whitespace-nowrap">
                  Sua conta
                </span>
              </Link>
            </div>
          </div>

          {/* Título de incentivo */}
          <h1 className="text-black text-center text-5xl lg:text-6xl font-bold mt-10">
            <span className="text-purple-600">Responda perguntas</span>
            <br />e ajude seus colegas!
          </h1>

          <p className="text-gray-500 text-center max-w-xl mx-auto text-lg">
            Compartilhe seu conhecimento e aprenda com os outros alunos.
          </p>
        </div>

        {/* Botões principais */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/askQuestion"
            prefetch
            className="group p-3 rounded-lg bg-purple-500 flex gap-2 justify-center items-center hover:bg-purple-700 hover: transition-all duration-600 cursor-pointer shadow-sm"
          >
            <LightBulbIcon className="h-5 w-5 text-white transition-transform group-hover:rotate-45" />
            <p className="text-white font-medium text-lg lg:text-base">
              Faça uma pergunta
            </p>
          </Link>

          <Link
            href="/groups"
            prefetch
            className="group p-3 rounded-lg bg-purple-500 flex gap-2 justify-center items-center hover:bg-purple-700 hover: transition-all duration-600 cursor-pointer shadow-sm"
          >
            <PlusIcon className="h-5 w-5 text-white transition-transform group-hover:rotate-45" />
            <p className="text-white font-medium text-sm lg:text-base">
              Criar seu grupo
            </p>
          </Link>
        </div>

        {/* Lista de perguntas */}
        <div className="w-full">
          {userData?.id ? (
            <PerguntasIndex id_usuario={userData.id} />
          ) : (
            <p className="text-gray-500 text-center animation-delay-75 py-10 animate-pulse cursor-pointer ">
              Carregando perguntas...
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
