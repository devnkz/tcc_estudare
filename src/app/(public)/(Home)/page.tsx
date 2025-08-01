"use client";

import { Inter } from "next/font/google";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import { HeaderDesktopAutenticado } from "@/app/components/Header";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

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
    setShowImage(width > 1024);
  }, [width]);

  const router = useRouter();

  return (
    <div
      className={`${inter.className} w-full h-screen bg-white flex flex-col justify-between items-center`}
    >
      <main className="p-4 w-full lg:max-w-[1200px] justify-between items-center flex">
        <div className="w-full lg:w-3/5 flex flex-col items-start gap-4">
          <h3 className="text-purple-400">BEM-VINDO (A)</h3>
          <h2 className="font-bold text-black text-3xl">
            Estudare: uma iniciativa dos alunos.
          </h2>
          <p className="text-zinc-600">
            Além de apenas na escola, agora você pode acessar o site da maior
            iniciativa da ETEC de Santa Fé do Sul no seu computador ou celular,
            diretamente da sua casa.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/Dashboard")}
              className="bg-purple-600 p-4 rounded-md text-white font-bold flex gap-2 justify-center items-center hover:bg-purple-950
                            transition-all duration-300 cursor-pointer"
            >
              <p className="text-center">Começar agora</p>
              <ArrowRightIcon className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={() => router.push("/about")}
              className="bg-zinc-200 p-4 text-black rounded-lg hover:bg-zinc-300 transition-all duration-300 cursor-pointer"
            >
              Saiba mais
            </button>
          </div>
        </div>
        {showImage && (
          <Image
            src="/imagens/aprendizagem-online.png"
            height={500}
            width={500}
            style={{ objectFit: "contain" }}
            alt="Imagem representativa"
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
