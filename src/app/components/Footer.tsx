import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Footer() {

    const router = useRouter();

    return (
        <footer className="border-t-[1px] border-zinc-200 p-4 w-full lg:max-w-[1200px] flex flex-col justify-center items-center gap-12">
            <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-4">
                <div className="text-black flex justify-center items-center gap-2">
                    <Image src="/imagens/Logo/gatopretotransparente.png" height={50} width={50} alt="Logo Estudare" style={{ objectFit: 'contain' }} />
                    <div className="flex flex-col items-center">
                        <h1 className="text-sm">Desenvolvido como plataforma de auxilio a estudantes</h1>
                        <p className="text-sm text-zinc-500">Nyckolas, Gabriel, Enzo e Vinicius</p>
                    </div>
                </div>
                <div className="flex justify-center items-center text-zinc-600">
                    <ul className="flex flex-col w-full gap-4 items-center">
                        <li>
                            <a onClick={() => router.push("/Home")}
                                className="cursor-pointer text-zinc-600 hover:text-purple-600 text-lg transition-colors duration-300 relative group">
                                Home
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 
                                group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => router.push("/Saiba_Mais")}
                                className="cursor-pointer text-zinc-600 hover:text-purple-600 text-lg transition-colors duration-300 relative group">
                                Saiba mais
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 
                                group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => router.push('/Home')}
                                className="cursor-pointer text-zinc-600 hover:text-purple-600 text-lg transition-colors duration-300 relative group">
                                Seus grupos
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 
                                group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>

                        <li>
                            <a onClick={() => router.push("/")}
                                className="cursor-pointer text-zinc-600 hover:text-purple-600 text-lg transition-colors duration-300 relative group">
                                Apresentação
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 
                                group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>

                    </ul>
                </div>
            </div>

            <h2 className="text-zinc-400">2025 ESTUDARE. Todos os direitos reservados.</h2>
        </footer>
    )
}