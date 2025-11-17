"use client";

import { Inter } from "next/font/google";
import { HeaderDesktopNaoAutenticado } from "../components/layout/header";
import { FaceFrownIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { InteractiveHoverButtonSecondary } from "@/components/ui/interactive-hover-button-secondary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/footer";

const interbold = Inter({ subsets: ["latin"], weight: ["700"] });
const interregular = Inter({ subsets: ["latin"], weight: ["400"] });

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-center items-center p-6">
      <main className="w-full max-w-3xl text-center mx-auto">
        <h1 className={`${interbold.className} text-purple-600 text-6xl mb-4`}>
          Ops — página não encontrada
        </h1>

        <p className={`${interregular.className} text-zinc-600 text-lg mb-6`}>
          A página que você procurou não existe ou foi movida. <br />
          <span className="whitespace-nowrap">Não foi sua culpa</span> — vamos
          ajudá-lo a voltar ao caminho.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto justify-center">
          <InteractiveHoverButton
            onClick={() => router.push("/")}
            text="Ir para a landing"
            className="bg-purple-600 text-white border-purple-600 w-full sm:w-auto px-7 py-4"
          />

          <InteractiveHoverButtonSecondary
            onClick={() => router.push("/home")}
            text="Ir para meu painel"
            className="w-full sm:w-auto"
          />
        </div>

        <p className={`${interregular.className} text-zinc-400 text-sm mt-6`}>
          Se acha que isso é um erro do sistema, entre em contato com o suporte.
        </p>
      </main>
    </div>
  );
}
