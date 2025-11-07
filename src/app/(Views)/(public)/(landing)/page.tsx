"use client";

import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import Footer from "@/components/layout/footer";
import { motion } from "framer-motion";

const interregular = Inter({ subsets: ["latin"], weight: ["400"] });
const interbold = Inter({ subsets: ["latin"], weight: ["700"] });
const interextrabold = Inter({ subsets: ["latin"], weight: ["800"] });

export default function TelaHome() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const router = useRouter();

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <main className="flex flex-col lg:flex-row items-center justify-center flex-grow px-6 sm:px-10 md:px-16 lg:px-24 pt-28 pb-24 gap-14 lg:gap-20">
        {/* IMAGEM À ESQUERDA */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 flex justify-center lg:justify-end"
        >
          <img
            src="/imagens/meeting_13543798.png"
            alt="Ilustração de formandos comemorando"
            className="w-full max-w-md sm:max-w-lg lg:max-w-xl h-auto object-contain"
          />
        </motion.div>

        {/* TEXTO À DIREITA */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left gap-5 mt-1"
        >
          <h1
            className={`${interextrabold.className} font-extrabold text-purple-600 text-4xl sm:text-5xl lg:text-6xl leading-tight`}
          >
            BEM-VINDO (A)
          </h1>
          <h2
            className={`${interbold.className} text-3xl sm:text-4xl lg:text-5xl text-gray-900 leading-snug`}
          >
            Estudare: uma iniciativa dos alunos.
          </h2>
          <p
            className={`${interregular.className} text-zinc-600 text-lg sm:text-xl max-w-lg leading-relaxed`}
          >
            Além de apenas na escola, agora você pode acessar o site da maior
            iniciativa da ETEC de Santa Fé do Sul no seu computador ou celular,
            diretamente da sua casa.
          </p>

          <div
            className={`${interregular.className} flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto justify-center lg:justify-start`}
          >
            <button
              onClick={() => router.push("/home")}
              className="bg-purple-600 px-7 py-4 rounded-md text-white font-extrabold flex gap-2 justify-center cursor-pointer items-center hover:bg-purple-700 transition-all duration-300 w-full sm:w-auto"
            >
              <p>Começar agora</p>
              <ArrowRightIcon className="h-4 w-4 text-white" />
            </button>

            <button
              onClick={() => router.push("/about")}
              className="bg-zinc-200 px-7 py-4 font-medium text-black rounded-lg hover:bg-zinc-300 cursor-pointer transition-all duration-300 w-full sm:w-auto"
            >
              Saiba mais
            </button>
          </div>
        </motion.div>
      </main>

      <footer className="mt-10 w-full">
        <Footer />
      </footer>
    </div>
  );
}
