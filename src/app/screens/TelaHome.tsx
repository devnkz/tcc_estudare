import { Inter } from "next/font/google"
import { ArrowRightIcon } from "@heroicons/react/16/solid"

const inter = Inter({ subsets: ['latin'], weight: ['400'] })

export default function TelaHome() {
    return (
        <div className={`${inter.className} h-screen w-full bg-white flex flex-col justify-between items-center`}>
            <header className="w-full flex flex-col items-center justify-between p-4 gap-4">
                <h1 className="text-black font-bold">LOGO</h1>
                <button className="bg-purple-600 p-2 rounded-full text-white flex gap-2 justify-center items-center">
                    <p>Cadastrar-se</p>
                    <ArrowRightIcon className="h-4 w-4 text-white" />
                </button>
            </header>
            <main className="p-4 w-full flex flex-col gap-4 items-start justify-center">
                <h3 className="text-purple-400">BEM-VINDO (A)</h3>
                <h2 className="font-bold text-black text-3xl">Estudare: uma <br />iniciativa dos alunos.</h2>
                <p className="text-zinc-600">Além de apenas na escola, agora você pode acessar o site da maior iniciativa da ETEC de Santa Fé do Sul no seu
                    computador ou celular, diretamente da sua casa.
                </p>
                <div className="flex gap-4">
                    <button className="bg-purple-600 p-4 rounded-md text-white font-bold flex gap-2 justify-center items-center">
                        <p className="text-center">Começar agora</p>
                        <ArrowRightIcon className="h-4 w-4 text-white" />
                    </button>
                    <button className="bg-zinc-200 p-4 text-black rounded-lg">Saiba mais</button>
                </div>
            </main>
            <footer className="border-t-[1px] border-zinc-200 p-4 w-full flex justify-between items-center flex-col gap-12">
                <div className="text-black">
                    <h1 className="text-sm">Desenvolvido como plataforma de auxilio a estudantes</h1>
                    <h2 className="text-center font-bold">Logo</h2>
                </div>
                <div className="flex justify-evenly items-center w-full text-zinc-600">
                    <p>Principal</p>
                    <p>Aspectos</p>
                    <p>Saiba mais</p>
                </div>
                <h2 className="text-zinc-400">2025 ESTUDARE. Todos os direitos reservados.</h2>
            </footer>
        </div>
    )
}