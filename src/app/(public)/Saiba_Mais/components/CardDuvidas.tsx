interface CardDuvidasProps {
  numero: string,
  duvida: string,
  texto: string
}

export function CardDuvidas({ numero, duvida, texto }: CardDuvidasProps) {
  return (
    <div className="flex flex-col p-4 gap-4 w-[800px] border-b-2 border-purple-600 transition-all duration-300 ease-in-out group cursor-pointer">
      <div className="w-full flex justify-between items-center">
        <h1 className="flex gap-4 items-center">
          <span className="text-xl font-bold">{numero}</span> {duvida}
        </h1>

        {/* Ícone animado */}
        <div className="relative h-5 w-5 flex items-center justify-center">
          {/* Linha vertical */}
          <span
            className="
          absolute h-5 w-0.5 bg-black rounded-sm
          transition-transform duration-300 ease-in-out
          origin-center
          group-hover:rotate-45
        "
          ></span>
          {/* Linha horizontal */}
          <span
            className="
          absolute h-0.5 w-5 bg-black rounded-sm
          transition-transform duration-300 ease-in-out
          origin-center
          group-hover:rotate-45
        "
          ></span>
        </div>
      </div>

      {/* Texto que aparece ao hover */}
      <p className="text-zinc-600 transform transition-all duration-300 ease-in-out opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100">
        {texto}
      </p>
    </div>

  )
}