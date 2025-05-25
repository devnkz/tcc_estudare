import { FaceSmileIcon, ArrowLongRightIcon } from "@heroicons/react/16/solid"

export function ChatPage() {
  return (
    <div id="chatPage" className="w-full flex flex-col justify-center items-center space-y-4">
      <div className="flex flex-col justify-center items-center space-y-4">
        <h1 className="text-lg lg:text-3xl text-black text-center lg:text-start">Converse com alunos e tire dúvidas <span className="font-bold">expontaneamente!</span></h1>
        <h2 className="text-base lg:text-2xl font-bold text-black">GRUPO GERAL</h2>
      </div>

      <div className="h-[400px] flex flex-col justify-between w-full lg:w-4/5 border border-zinc-300 rounded-lg">
        <div className="rounded-lg">
          <p className="text-zinc-600 bg-zinc-200 p-2 text-sm lg:text-base">Poste sua <span className="text-purple-600">dúvida</span> e interaja no grupo geral!</p>
        </div>
        <div className="h-fit overflow-y-auto space-y-4">
          <div className="p-2 text-black">
            <div>
              <span className="text-xs text-zinc-400">14:45</span>
              <h1>Nome: <span className="font-bold">Nyckolas(TIO T.I)</span></h1>
              <p>Enviou: Alguém me ajuda com regra de três ?</p>
            </div>

            <div>
              <span className="text-xs text-zinc-400">14:46</span>
              <h1>Nome: <span className="font-bold">Lucas Alves(Shark)</span></h1>
              <p>Enviou: Eu ajudo</p>
            </div>

            <div>
              <span className="text-xs text-zinc-400">14:46</span>
              <h1>Nome: <span className="font-bold">Breno(NP)</span></h1>
              <p>Enviou: Eu participo também</p>
            </div>
          </div>

        </div>
        <div className="w-full flex justify-between items-center p-4 bg-white shadow-xl rounded-lg">
          <div className="w-full flex gap-2 items-center">
            <FaceSmileIcon className="text-purple-600 h-5 w-5" />
            <input placeholder="interaja agora mesmo!..." className="focus:outline-none w-full text-black" />
          </div>
          <ArrowLongRightIcon className="text-purple-600 h-5 w-5" />
        </div>
      </div>

    </div>
  )
}