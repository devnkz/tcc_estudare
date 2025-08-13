"use client";

import { ArrowRightIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/footer";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";

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
    <div className="w-full h-full  bg-white flex flex-col overflow-y-hidden">
      {/* Main */}
      <main className="flex-1 m  w-full lg:max-w-[1450px] mx-auto flex justify-between items-center">
        <div className="w-full mt-55 lg:w-3/5 flex flex-col items-start gap-5 p-5">
          <h1
            className={`${interextrabold.className} font-extrabold text-purple-600 mr-90 text-5xl gap-1`}
          >
            BEM-VINDO (A)
          </h1>
          <h2 className={`${interbold.className} text-5xl mr-5`}>
            Estudare: uma iniciativa dos alunos.
          </h2>
          <h3
            className={`${interregular.className} text-zinc-600 text-xl gap-1 mr-15`}
          >
            Além de apenas na escola, agora você pode acessar o site da maior
            iniciativa da ETEC de Santa Fé do Sul no seu computador ou celular,
            diretamente da sua casa.
          </h3>
          <div className={`${interregular.className} flex gap-3 mt-0.5`}>
            <button
              onClick={() => router.push("/home")}
              className="bg-purple-600 p-4 rounded-md text-white font-extrabold flex gap-2 justify-center items-center hover:bg-purple-800 transition-all duration-500 cursor-pointer"
            >
              <p className="text-center">Começar agora</p>
              <ArrowRightIcon className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={() => router.push("/about")}
              className="bg-zinc-200 p-4 text-black rounded-lg hover:bg-zinc-300 transition-all duration-500 cursor-pointer"
            >
              Saiba mais
            </button>
          </div>
        </div>
        {/* <Image
          src="/imagens/imagem_pergunta1.png"
          height={600}
          width={600}
          // style={{ objectFit: "contain" }}
          alt="Imagem representativa"
        /> */}
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}
