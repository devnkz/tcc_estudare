export function ResponderPerguntasPage() {
  return (
    <div
      id="respondaPerguntasPage"
      className="w-full lg:p-4 flex flex-col gap-10"
    >
      <h1 className="text-black text-center text-xl lg:text-3xl">
        Perguntas recentes aguardando resposta
      </h1>

      <div className="flex flex-col gap-2">
        <h2 className="px-2 text-zinc-600">Procure perguntas pela matéria!</h2>
        <nav
          className="w-full flex items-center gap-4 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>
            {`
                            #respondaPerguntasPage nav::-webkit-scrollbar {
                                display: none;
                            }
                        `}
          </style>
          <p className="p-2 text-white rounded-lg bg-purple-600 flex-shrink-0">
            Geral
          </p>
          <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer flex-shrink-0">
            Matematica
          </p>
          <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer flex-shrink-0">
            Historia
          </p>
          <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer flex-shrink-0">
            Geografia
          </p>
          <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer flex-shrink-0">
            Portugues
          </p>
          <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer flex-shrink-0">
            Quimica
          </p>
          <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer flex-shrink-0">
            Fisica
          </p>
          <p className="bg-zinc-200 p-2 text-black rounded-lg hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer flex-shrink-0">
            Outras
          </p>
        </nav>
      </div>

      <div className="p-2 w-full bg-zinc-200 shadow-md rounded-lg flex flex-col gap-2 text-black hover:-translate-y-1 transition-all duration-300">
        <h2 className="font-bold">Aluno: Nyckolas (TIO T.I)</h2>
        <p>Matéria: História</p>
        <p className="bg-white p-2 rounded-md shadow-lg text-sm lg:text-base">
          Pergunta: Quem descobriu o brasil ?
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-purple-600 text-white text-xs lg:text-base">
            Responder
          </button>
          <button className="p-2 rounded-lg bg-white text-black text-xs lg:text-base">
            Notificar respostas
          </button>
        </div>
      </div>

      <div className="p-2 w-full bg-zinc-200 shadow-md rounded-lg flex flex-col gap-2 text-black hover:-translate-y-1 transition-all duration-300">
        <h2 className="font-bold">Aluno: Nyckolas (TIO T.I)</h2>
        <p>Matéria: História</p>
        <p className="bg-white p-2 rounded-md shadow-lg text-sm lg:text-base">
          Pergunta: Quem descobriu o brasil ?
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-purple-600 text-white text-xs lg:text-base">
            Responder
          </button>
          <button className="p-2 rounded-lg bg-white text-black text-xs lg:text-base">
            Notificar respostas
          </button>
        </div>
      </div>

      <div className="p-2 w-full bg-zinc-200 shadow-md rounded-lg flex flex-col gap-2 text-black hover:-translate-y-1 transition-all duration-300">
        <h2 className="font-bold">Aluno: Nyckolas (TIO T.I)</h2>
        <p>Matéria: História</p>
        <p className="bg-white p-2 rounded-md shadow-lg text-sm lg:text-base">
          Pergunta: Quem descobriu o brasil ?
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-purple-600 text-white text-xs lg:text-base">
            Responder
          </button>
          <button className="p-2 rounded-lg bg-white text-black text-xs lg:text-base">
            Notificar respostas
          </button>
        </div>
      </div>

      <div className="p-2 w-full bg-zinc-200 shadow-md rounded-lg flex flex-col gap-2 text-black hover:-translate-y-1 transition-all duration-300">
        <h2 className="font-bold">Aluno: Nyckolas (TIO T.I)</h2>
        <p>Matéria: História</p>
        <p className="bg-white p-2 rounded-md shadow-lg text-sm lg:text-base">
          Pergunta: Quem descobriu o brasil ?
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-purple-600 text-white text-xs lg:text-base">
            Responder
          </button>
          <button className="p-2 rounded-lg bg-white text-black text-xs lg:text-base">
            Notificar respostas
          </button>
        </div>
      </div>
    </div>
  );
}
