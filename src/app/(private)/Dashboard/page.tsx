"use client";

import Footer from "@/app/components/Footer";
import { HeaderDesktop } from "@/app/components/Header";
import { Inter } from "next/font/google";
import { ResponderPerguntasPage } from "../pages/ResponderPerguntas";
import { InicialPage } from "../pages/InicialPage";

const inter = Inter({ subsets: ["latin"], weight: "400" });

export default function HomePage() {
  return (
    <div
      className={`${inter.className} bg-white w-full flex flex-col justify-between items-center`}
    >
      <HeaderDesktop />

      <div className="w-full lg:max-w-[1200px] flex p-4">
        <div className="w-full p-4 flex flex-col items-center gap-4">
          <InicialPage />

          <ResponderPerguntasPage />
        </div>
      </div>
      <Footer />
    </div>
  );
}
