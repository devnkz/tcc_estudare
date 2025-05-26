import { PlusIcon, XMarkIcon } from "@heroicons/react/16/solid"

interface CardDuvidasProps {
    numero: string,
    duvida: string,
    texto: string
}

export function CardDuvidas({numero, duvida, texto} : CardDuvidasProps){
    return(
       <div className="flex flex-col p-4 gap-4 w-[800px] border-b-2 border-purple-600 transition-all duration-300 ease-in-out group">
  <div className="w-full flex justify-between">
    <h1 className="flex gap-4 items-center">
      <span className="text-xl font-bold">{numero}</span> {duvida}
    </h1>
    <PlusIcon className="group-hover:hidden h-5 w-5 transform transition-transform duration-300 ease-in-out scale-100 group-hover:scale-0"/>
    <XMarkIcon className="hidden group-hover:block h-5 w-5 transform transition-transform duration-300 ease-in-out scale-0 group-hover:scale-100"/>
  </div>

  <p className="hidden group-hover:block text-zinc-600 transition-all duration-300 ease-in-out transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
    {texto}
  </p>
</div>


    )
}