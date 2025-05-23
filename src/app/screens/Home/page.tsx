"use client"

import Footer from "@/app/components/Footer";
import { HeaderDesktop } from "@/app/components/Header";
import { Inter } from "next/font/google";
import { ResponderPerguntasPage } from "./pages/ResponderPerguntas";
import { ChatPage } from "./pages/ChatPage";
import { SuaPerguntaPage } from "./pages/SuaPergunta";
import { TopicosLeitura } from "./pages/TopicosLeituraPage";
import { InicialPage } from "./pages/InicialPage";

const inter = Inter({ subsets: ['latin'], weight: '400' })

export default function HomePage() {
    return (
        <div className={`${inter.className} bg-zinc-100 w-full flex flex-col justify-between items-center`}>
            <HeaderDesktop />
            <div className="w-full lg:max-w-[1200px] flex p-4">
                <div className="w-1/6 p-4 h-[2000px] border-r-2 border-purple-300">

                    <div className="lg:sticky h-fit lg:top-8 space-y-8">
                        <h1 className="text-purple-600 font-bold text-center">ESTUDARE</h1>
                        <div>
                            <div className="flex flex-col gap-4">
                                <button className="bg-purple-600 text-white p-2 rounded-lg text-xs hover:-translate-y-1 hover:text-white
                                hover:bg-purple-600 transition-all duration-300">Página inicial</button>
                                <button className="bg-zinc-200 text-black p-2 rounded-lg text-xs hover:-translate-y-1 hover:text-white
                                hover:bg-purple-600 transition-all duration-300">Responda perguntas</button>
                                <button className="bg-zinc-200 text-black p-2 rounded-lg text-xs hover:-translate-y-1 hover:text-white
                                hover:bg-purple-600 transition-all duration-300">Tópicos para leitura</button>
                                <button className="bg-zinc-200 text-black p-2 rounded-lg text-xs hover:-translate-y-1 hover:text-white
                                hover:bg-purple-600 transition-all duration-300">Faça sua pergunta</button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="w-full p-4 flex flex-col items-center gap-4">

                    <InicialPage/>

                    <ChatPage/>

                    <ResponderPerguntasPage/>

                    <TopicosLeitura/>

                    <SuaPerguntaPage/>

                </div>
            </div>
            <Footer />
        </div>
    )
}