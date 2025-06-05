"use client"

import Footer from "@/app/components/Footer";
import { HeaderDesktop } from "@/app/components/Header";
import { Inter } from "next/font/google";
import { ResponderPerguntasPage } from "./pages/ResponderPerguntas";
import { ChatPage } from "./pages/ChatPage";
import { SuaPerguntaPage } from "./pages/SuaPergunta";
import { InicialPage } from "./pages/InicialPage";
import { useEffect, useRef, useState } from "react";
import GruposPage from "./pages/GruposPage";

const inter = Inter({ subsets: ['latin'], weight: '400' })

export default function HomePage() {

    const [telaAtivada, setTelaAtivada] = useState<string>('inicialPage')

    const telasId = ['inicialPage', 'respondaPerguntasPage', 'suaPerguntaPage', 'gruposPage']
    const observar = useRef<any>(null);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6,
        };

        observar.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTelaAtivada(entry.target.id)
                }
            })
        }, options)

        telasId.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observar.current.observe(el);
        })
    }, [])

    const btnStyle = ({ id }: { id: string }) =>
        `p-2 rounded-lg text-xs cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-white hover:bg-purple-600
    ${telaAtivada === id ? "bg-purple-600 text-white" : "bg-zinc-200 text-black"}`;

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };


    return (
        <div className={`${inter.className} bg-zinc-100 w-full flex flex-col justify-between items-center`}>

            <HeaderDesktop />

            <div className="w-full lg:max-w-[1200px] flex p-4">
                <div className="w-1/6 lg:p-4 h-[4000px] lg:border-r-2 border-purple-300">

                    {/* menu lateral home */}

                    <div className="hidden lg:block lg:sticky h-fit lg:top-8 space-y-8">
                        <h1 className="text-purple-600 font-bold text-center">ESTUDARE</h1>
                        <div>
                            <div className="flex flex-col gap-4">
                                <button onClick={() => scrollTo("inicialPage")} className={btnStyle({ id: "inicialPage" })}>Página inicial</button>
                                <button onClick={() => scrollTo("respondaPerguntasPage")} className={btnStyle({ id: "respondaPerguntasPage" })}>Responda perguntas</button>
                                <button onClick={() => scrollTo("suaPerguntaPage")} className={btnStyle({ id: "suaPerguntaPage" })}>Faça sua pergunta</button>
                                <button onClick={() => scrollTo("gruposPage")} className={btnStyle({ id: "gruposPage" })}>Seus grupos</button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="w-full p-4 flex flex-col items-center gap-4">

                    <InicialPage />

                    <ChatPage />

                    <ResponderPerguntasPage />

                    <SuaPerguntaPage />

                    <GruposPage />
                </div>
            </div>
            <Footer />
        </div >
    )
}