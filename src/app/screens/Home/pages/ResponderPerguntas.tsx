export function ResponderPerguntasPage(){
    return(
        <div className="w-4/5 p-4 flex flex-col gap-10">
                        <h1 className="text-black text-center text-3xl">Perguntas recentes aguardando resposta</h1>

                        <div className="flex flex-col gap-2">
                            <h2 className="px-2 text-zinc-600">Procure perguntas pela materia!</h2>
                            <nav className="w-full flex justify-center items-center gap-4">
                                <p className="p-2 text-white rounded-lg bg-purple-600">Geral</p>
                                <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer">Matematica</p>
                                <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer">Historia</p>
                                <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer">Geografia</p>
                                <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer">Portugues</p>
                                <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer">Quimica</p>
                                <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer">Fisica</p>
                                <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer">Outras</p>
                            </nav>
                        </div>

                        <div className="p-2 w-full bg-zinc-200 shadow-md rounded-lg flex flex-col gap-2 text-black hover:-translate-y-1 transition-all duration-300">
                            <h2 className="font-bold">Aluno: Nyckolas (TIO T.I)</h2>
                            <p>Matéria: História</p>
                            <p className="bg-white p-2 rounded-md shadow-lg">Pergunta: Quem descobriu o brasil ?</p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg bg-purple-600 text-white">Responder</button>
                                <button className="p-2 rounded-lg bg-white text-black">Notificar quando respondida</button>
                            </div>
                        </div>

                        <div className="p-2 w-full bg-zinc-200 shadow-md rounded-lg flex flex-col gap-2 text-black hover:-translate-y-1 transition-all duration-300">
                            <h2 className="font-bold">Aluno: Nyckolas (TIO T.I)</h2>
                            <p>Matéria: História</p>
                            <p className="bg-white p-2 rounded-md shadow-lg">Pergunta: Quem descobriu o brasil ?</p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg bg-purple-600 text-white">Responder</button>
                                <button className="p-2 rounded-lg bg-white text-black">Notificar quando respondida</button>
                            </div>
                        </div>

                        <div className="p-2 w-full bg-zinc-200 shadow-md rounded-lg flex flex-col gap-2 text-black hover:-translate-y-1 transition-all duration-300">
                            <h2 className="font-bold">Aluno: Nyckolas (TIO T.I)</h2>
                            <p>Matéria: História</p>
                            <p className="bg-white p-2 rounded-md shadow-lg">Pergunta: Quem descobriu o brasil ?</p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg bg-purple-600 text-white">Responder</button>
                                <button className="p-2 rounded-lg bg-white text-black">Notificar quando respondida</button>
                            </div>
                        </div>

                        <div className="p-2 w-full bg-zinc-200 shadow-md rounded-lg flex flex-col gap-2 text-black hover:-translate-y-1 transition-all duration-300">
                            <h2 className="font-bold">Aluno: Nyckolas (TIO T.I)</h2>
                            <p>Matéria: História</p>
                            <p className="bg-white p-2 rounded-md shadow-lg">Pergunta: Quem descobriu o brasil ?</p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg bg-purple-600 text-white">Responder</button>
                                <button className="p-2 rounded-lg bg-white text-black">Notificar quando respondida</button>
                            </div>
                        </div>
                    </div>
    )
}