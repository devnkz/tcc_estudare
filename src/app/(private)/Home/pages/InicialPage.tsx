import { MagnifyingGlassIcon, LightBulbIcon, PlusIcon, BellIcon, UserIcon } from "@heroicons/react/16/solid"
import { useRouter } from "next/navigation"

export function InicialPage() {

    const router = useRouter();

    return (
        <div id="inicialPage" className="w-full lg:w-4/5 space-y-4 my-4">
            <div className="text-black flex justify-between items-center">
                <div>
                    <h1 className="font-bold lg:text-xl">Olá, Nyckolas</h1>
                    <p className="text-zinc-600">Tem alguma dúvida hoje ?</p>
                </div>

                <div className="flex space-x-3 lg:hidden">
                    <button onClick={() => router.push('/notificacoes')} className="rounded-full bg-zinc-200 p-2 relative cursor-pointer
                    hover:-transplate-y-1 hover:bg-purple-600 hover:text-white trasition-all duration-300 group">
                        <BellIcon className="h-6 w-6 text-black group-hover:text-white" />

                        <span className="hidden group-hover:block absolute left-0 top-14 bg-zinc-400 text-white p-2 text-xs rounded-lg
                        ">Notificações</span>
                    </button>

                    <button onClick={() => router.push('/Usuario')} className="rounded-full bg-zinc-200 p-2 relative cursor-pointer
                    hover:-transplate-y-1 hover:bg-purple-600 hover:text-white trasition-all duration-300 group">
                        <UserIcon className="h-6 w-6 text-black group-hover:text-white" />
                        <span className="hidden group-hover:flex absolute left-0 top-14 bg-zinc-400 text-white p-2 text-xs rounded-lg whitespace-nowrap">
                            Sua conta
                        </span>
                    </button>
                </div>
            </div>


            <div className="flex space-x-2 my-6">
                <button className="p-2 rounded-xl bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-950 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <p className="text-white text-xs lg:text-base">Faça uma pergunta</p>
                    <LightBulbIcon className="h-4 w-4 text-white" />
                </button>

                <button className="p-2 rounded-xl bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-950 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <p className="text-white text-xs lg:text-base">Criar seu grupo</p>
                    <PlusIcon className="h-4 w-4 text-white" />
                </button>
            </div>


            <div className="w-full flex space-x-2 p-2 rounded-lg bg-zinc-200 text-black">
                <MagnifyingGlassIcon className="h-5 w-5" />
                <input placeholder="Procure por perguntas, matérias e tudo mais..." className="outline-none w-full" />
            </div>
        </div>
    )
}