"use client";

import { Inter } from "next/font/google";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/footer";
import { useRouter } from "next/navigation";

const interthin = Inter({ subsets: ["latin"], weight: ["100"] });
const interextraLight = Inter({ subsets: ["latin"], weight: ["200"] });
const interlight = Inter({ subsets: ["latin"], weight: ["300"] });
const interregular = Inter({ subsets: ["latin"], weight: ["400"] });
const intermedium = Inter({ subsets: ["latin"], weight: ["500"] });
const intersemibold = Inter({ subsets: ["latin"], weight: ["600"] });
const interbold = Inter({ subsets: ["latin"], weight: ["700"] });
const interextrabold = Inter({ subsets: ["latin"], weight: ["800"] });
const interblack = Inter({ subsets: ["latin"], weight: ["900"] });


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
    <div className="w-full h-screen bg-white flex flex-col justify-between items-center">
      <main className="p-9 w-full lg:max-w-[1300px] justify-between items-center flex">
        <div className="w-full lg:w-3/5 flex flex-col items-start gap-4">
          <h1 className={`${interextrabold.className} text-purple-500 text-3xl`}>BEM-VINDO (A)</h1>
          <h2 className={`${interbold.className} text-3xl`}>
            Estudare: uma iniciativa dos alunos.
          </h2>
          <p className={`${intersemibold.className}text-zinc-600 text-xl mr-4`}>
            Além de apenas na escola, agora você pode acessar o site da maior
            iniciativa da ETEC de Santa Fé do Sul no seu computador ou celular,
            diretamente da sua casa.
          </p>
          <div className={`${interregular.className} flex gap-3`}>
            <button
              onClick={() => router.push("/home")}
              className="bg-purple-600 p-4 rounded-md text-white font-extrabold font-weight:900 flex gap-2 justify-center items-center hover:bg-purple-700
                            transition-all duration-500 cursor-pointer"
            >
              <p className="text-center">Começar agora</p>
              <ArrowRightIcon className="h-4 w-4 text-white font-extrabold font-weight:900" />
            </button>
            <button
              onClick={() => router.push("/about")}
              className="bg-zinc-300 p-4 text-black rounded-lg hover:bg-zinc-400 transition-all duration-500 cursor-pointer"
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
