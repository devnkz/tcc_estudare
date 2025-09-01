"use client";

import { Inter } from "next/font/google";
import { HeaderDesktopNaoAutenticado } from "../components/layout/header";
import { FaceFrownIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/footer";

const interbold = Inter({ subsets: ["latin"], weight: ["700"] });
const interregular = Inter({ subsets: ["latin"], weight: ["400"] });

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="w-full h-screen bg-white flex flex-col justify-between items-center">
      <main className="p-9 w-full lg:max-w-[1300px] flex flex-col lg:flex-row justify-between items-center h-dvh gap-10 mt-10 mb-25">
        {/* Texto */}
        <div className="w-full lg:w-3/5 flex flex-col items-start gap-4">
          <h1
            className={`${interbold.className} text-purple-500 text-7xl mb-2 leading-20`}
          >
            Opa... parece que você se perdeu!
          </h1>
          <p className={`${interregular.className} text-zinc-600 text-xl`}>
            Parece que essa página não existe... ou foi abduzida por
            alienígenas. Mas calma! Você pode voltar para a segurança da nossa
            página inicial.
          </p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => router.push("/home")}
              className="bg-purple-500 p-4 rounded-md text-white font-bold flex gap-2 justify-center items-center hover:bg-purple-700 transition-all duration-500 cursor-pointer"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Voltar ao início
            </button>
            <button
              onClick={() => router.push("/about")}
              className="bg-zinc-300 p-4 text-black rounded-lg hover:bg-zinc-400 transition-all duration-500"
            >
              Saiba mais
            </button>
          </div>
        </div>

        {/* Imagem */}
        <div>
          <Image
            src="/imagens/404-astronauta.png"
            height={400}
            width={400}
            alt="Astronauta perdido no espaço"
            style={{ objectFit: "contain" }}
          />
        </div>
      </main>
    </div>
  );
}
