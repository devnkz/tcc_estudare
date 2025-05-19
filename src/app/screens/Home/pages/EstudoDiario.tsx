import { FaceSmileIcon, ArrowLongRightIcon } from "@heroicons/react/16/solid"

export function EstudoDiarioPage(){
    return(
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-2xl">Converse com alunos e tire dúvidas <span className="font-bold">expontaneamente!</span></h1>
            <p className="text-zinc-600">Poste sua <span className="text-purple-600">dúvida</span> e interaja no grupo!</p>
            </div>
            
            <div className="h-[300px] flex flex-col justify-between w-4/5 border border-zinc-300 rounded-lg">
  <div className="h-fit overflow-y-auto p-2 space-y-4">
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
  <div className="w-full flex justify-between items-center p-4 bg-white shadow-xl rounded-lg">
    <div className="w-full flex gap-2 items-center">
      <FaceSmileIcon className="text-purple-600 h-5 w-5" />
      <input placeholder="interaja agora mesmo!..." className="focus:outline-none w-full" />
    </div>
    <ArrowLongRightIcon className="text-purple-600 h-5 w-5" />
  </div>
</div>

        </div>
    )
}