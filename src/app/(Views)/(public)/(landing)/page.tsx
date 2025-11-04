"use client";

import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import Footer from "@/components/layout/footer";

const interregular = Inter({ subsets: ["latin"], weight: ["400"] });
const interbold = Inter({ subsets: ["latin"], weight: ["700"] });
const interextrabold = Inter({ subsets: ["latin"], weight: ["800"] });

export default function TelaHome() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setShowImage(width > 1084);
  }, [width]);

  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Main */}
      <main className="flex flex-col-reverse lg:flex-row justify-between items-center flex-grow px-6 sm:px-10 md:px-16 lg:px-24 py-16 lg:py-32">
        {/* Texto principal */}
        <div className="w-full lg:w-3/5 flex flex-col items-start gap-5 text-center lg:text-left mt-10 lg:mt-0">
          <h1
            className={`${interextrabold.className} font-extrabold text-purple-600 text-5xl sm:text-6xl leading-tight`}
          >
            BEM-VINDO (A)
          </h1>
          <h2
            className={`${interbold.className} text-4xl sm:text-5xl lg:text-6xl text-gray-900`}
          >
            Estudare: uma iniciativa dos alunos.
          </h2>
          <h3
            className={`${interregular.className} text-zinc-600 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0`}
          >
            Além de apenas na escola, agora você pode acessar o site da maior
            iniciativa da ETEC de Santa Fé do Sul no seu computador ou celular,
            diretamente da sua casa.
          </h3>

          <div
            className={`${interregular.className} flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto justify-center lg:justify-start`}
          >
            <button
              onClick={() => router.push("/home")}
              className="bg-purple-600 px-6 py-4 rounded-md text-white font-extrabold flex gap-2 justify-center items-center hover:bg-purple-700 transition-all duration-300 cursor-pointer w-full sm:w-auto"
            >
              <p>Começar agora</p>
              <ArrowRightIcon className="h-4 w-4 text-white" />
            </button>

            <button
              onClick={() => router.push("/about")}
              className="bg-zinc-200 px-6 py-4 font-medium text-black rounded-lg hover:bg-zinc-300 transition-all duration-300 cursor-pointer w-full sm:w-auto"
            >
              Saiba mais
            </button>
          </div>
        </div>

        {/* Imagem — aparece apenas em telas grandes */}
        {showImage && (
          <div className="hidden lg:block">
            <img
              className="h-[420px] w-auto object-contain"
              src="/imagens/meeting_13543798.png"
              alt="Imagem ilustrativa de alunos em formatura"
            />
          </div>
        )}
      </main>

      {/* Footer encostado nas bordas */}
      <footer className="mt-auto w-full">
        <Footer />
      </footer>
    </div>
  );
}
