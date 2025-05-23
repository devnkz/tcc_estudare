import { MagnifyingGlassIcon, LightBulbIcon, PlusIcon } from "@heroicons/react/16/solid" 

export function InicialPage(){
    return(
        <div className="w-4/5 space-y-4 my-4">
            <div>
               <h1 className="font-bold text-xl">Olá, Nyckolas</h1>
                <p className="text-zinc-600">Tem alguma dúvida hoje ?</p>
            </div>
            

            <div className="flex space-x-2">
                <button className="p-2 rounded-xl bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-950 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <p className="text-white">Faça uma pergunta</p>
                        <LightBulbIcon className="h-4 w-4 text-white" />
                    </button>

                    <button className="p-2 rounded-xl bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-950 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <p className="text-white">Criar seu grupo</p>
                        <PlusIcon className="h-4 w-4 text-white" />
                    </button>
            </div>
            

            <div className="w-full flex space-x-2 p-2 rounded-lg bg-zinc-200">
                <MagnifyingGlassIcon className="h-5 w-5"/>
                <input placeholder="Procure por perguntas, matérias e tudo mais..." className="outline-none w-full"/>
            </div>
        </div>
    )
}