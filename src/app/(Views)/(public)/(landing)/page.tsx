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
    setShowImage(width > 1024);
  }, [width]);

  const router = useRouter();

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

  return (
    <div className="h-full w-full">
      <div
        className="flex flex-col scrollbar-hide"
        style={{ paddingTop: headerHeight }}
      >
        {/* Main */}
        <main className="flex justify-between items-center px-75 py-20">
          <div className="w-full lg:w-3/5 flex flex-col items-start gap-5 mt-40 mb-30 ">
            <h1
              className={`${interextrabold.className} font-extrabold text-purple-600 text-6xl gap-1`}
            >
              BEM-VINDO (A)
            </h1>
            <h2 className={`${interbold.className} text-6xl mr-5`}>
              Estudare: uma iniciativa dos alunos.
            </h2>
            <h3
              className={`${interregular.className} text-zinc-600 text-xl gap-1 mr-10`}
            >
              Além de apenas na escola, agora você pode acessar o site da maior
              iniciativa da ETEC de Santa Fé do Sul no seu computador ou
              celular, diretamente da sua casa.
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
          {showImage && (
            <div className="lg:block mb-20">
              <img
                className="h-150 w-150"
                src="/imagens/meeting_13543798.png"
                alt="Imagem ilustrativa de alunos em formatura"
              ></img>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
