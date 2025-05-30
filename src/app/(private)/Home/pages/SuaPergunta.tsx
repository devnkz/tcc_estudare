import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { FaRegLightbulb } from "react-icons/fa";

export function SuaPerguntaPage() {
    return (
        <div id="suaPerguntaPage" className="h-screen w-full my-12 flex flex-col items-center space-y-8">
            <div className="space-y-4 w-4/5">
                <h1 className="text-black text-center font-bold text-4xl">Faça sua pergunta !</h1>
                <p className="text-gray-600 text-center">
                    Tem alguma dúvida? Não hesite em perguntar! Aproveite este espaço para esclarecer seus questionamentos e avançar nos seus estudos.
                </p>
            </div>

            <div className="w-4/5 flex justify-between items-center">
                <div className="w-3/5 bg-zinc-200 h-fit p-2 flex items-center rounded-xl gap-4 ">
                    <FaRegLightbulb className="text-xl"/>
                    <input placeholder="Faça sua pergunta..." className="w-full outline-none"/>
                </div>

                <button className="flex space-x-4 bg-purple-600 text-white p-2 rounded-lg items-center">
                    <h1>Enviar pergunta</h1>
                    <ArrowRightIcon className="h-5 w-5"/>
                </button>
            </div>
        </div>
    )
}