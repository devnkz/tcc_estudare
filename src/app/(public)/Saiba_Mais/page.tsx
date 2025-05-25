'use client';

import Image from "next/image"
import { MenuLateral } from "@/app/components/Menu_Lateral";
import Footer from "@/app/components/Footer";
import { Inter } from "next/font/google"
import { useState, useEffect } from "react";
import { HeaderDesktop } from "@/app/components/Header";

const inter = Inter({ subsets: ['latin'], weight: ['400'] })

export default function Saiba_Mais() {

    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
    const [showMenuMobile, setShowMenuMobile] = useState(false);

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setShowMenuMobile(width < 1024);
    }, [width]);


    return (
        <div className={`${inter.className} bg-zinc-100 w-full lg:h-screen flex flex-col justify-between items-center`}>
            {
                /* Header Mobile  */
                showMenuMobile &&
                <header className="w-full bg-zinc-200 justify-between items-center px-6 py-3">
                    <Image src="/imagens/logo.png" height={50} width={50} alt="logo Estudare" style={{ objectFit: "contain" }} />
                    <MenuLateral top={7} right={6} numero={1} />
                </header>

            }
            {
                /* Header Desktop  */
                !showMenuMobile &&
                <HeaderDesktop />
            }

            <main>
                <div className="w-full lg:max-w-[1200px] flex flex-col lg:flex-row items-center justify-center md:justify-between">
                    <div className="flex flex-col gap-4 w-full p-4 lg:p-0 items-center justify-center lg:items-start">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold text-black">PROJETO ESTUDARE</h1>
                            <Image src="/imagens/criatividade.png" height={50} width={50} alt="Logo estudare" style={{ objectFit: "contain" }} />
                        </div>

                        <p className="text-zinc-600 text-sm md:text-base text-justify w-full md:w-3/4">O Estudare nasceu como uma iniciativa extracurricular voltada ao apoio educacional entre os próprios alunos. Inicialmente, o projeto consistia em encontros realizados fora do horário de aula, dentro da escola, onde os estudantes se reuniam para revisar conteúdos, tirar dúvidas e ajudar uns aos outros de forma colaborativa.
                            Com o tempo, nós — alunos do 3º ano do curso técnico de Informática para Internet (Infonet) — enxergamos o potencial de ampliar esse projeto utilizando a tecnologia como aliada. Assim, decidimos transformar o Estudare em uma plataforma digital, acessível para todos.
                            Criamos um sistema web onde os alunos podem se conectar diretamente de suas casas, enviar dúvidas, colaborar com respostas, compartilhar materiais e aprender juntos. O objetivo continua o mesmo: promover o apoio mútuo entre estudantes, mas agora de forma mais acessível, moderna e contínua.
                        </p>
                    </div>
                    <Image src="/imagens/monitoramento.png" height={400} width={400} alt="Imagem representativa" style={{ objectFit: "contain" }} />
                </div>
            </main>

            <Footer />
        </div >
    )
}