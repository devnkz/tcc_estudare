'use client';

import Image from "next/image"
import { MenuLateral } from "@/app/components/Menu_Lateral";
import Footer from "@/app/components/Footer";
import { Inter } from "next/font/google"
import { LightBulbIcon } from "@heroicons/react/16/solid";

const inter = Inter({ subsets: ['latin'], weight: ['400'] })

export default function Saiba_Mais() {
    return (
        <div className={`${inter.className} bg-zinc-100 w-full lg:h-screen flex flex-col justify-between items-center`}>
            {/* Header Mobile  */}

            <header className="w-full bg-zinc-200 justify-between items-center px-6 py-3">
                <Image src="/imagens/logo.png" height={50} width={50} alt="logo Estudare" style={{ objectFit: "contain" }} />
                <MenuLateral top={7} right={6} numero={1} />
            </header>


            {/* Header Desktop
            <header className="w-full flex justify-between items-center lg:max-w-[1200px] p-4 border-b-2 border-zinc-200">
                <div className="flex w-52"><Image src="/imagens/logo.png" height={50} width={50} alt="logo Estudare" style={{ objectFit: "contain" }} /></div>
                <nav>
                    <ul className="flex gap-4 items-center justify-center">
                        <li>
                            <a href="#home"
                                className="menu-link text-zinc-800 hover:text-purple-600 text-lg transition-colors duration-300 relative group">
                                Home
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 
                                group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                        <li>
                            <a href="#sobreNos"
                                className="menu-link text-zinc-800 hover:text-purple-600 text-lg transition-colors duration-300 relative group">
                                Saiba mais
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 
                                group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                        <li>
                            <a href="#comoFunciona"
                                className="menu-link text-zinc-800 hover:text-purple-600 text-lg transition-colors duration-300 relative group">
                                Chat de dúvidas
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 
                                group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                        <button className="p-2 rounded-xl bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-950 transition-all duration-300 cursor-pointer">
                            <p>Faça uma pergunta</p>
                            <LightBulbIcon className="h-4 w-4 text-white" />
                        </button>
                    </ul>
                </nav>
            </header>
            */}



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