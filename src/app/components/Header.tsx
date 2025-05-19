import Image from "next/image"
import { LightBulbIcon } from "@heroicons/react/16/solid"

export function HeaderDesktop() {
    return (
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
                            Chat
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
    )
}