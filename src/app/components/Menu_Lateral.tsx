import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function MenuLateral({ numero, top, right }: { numero: number, top: number, right: number }) {

    const [menuAberto, setMenuAberto] = useState(false);
    const [Pagina, setPagina] = useState(numero);

    function toggleMenu() {
        setMenuAberto(!menuAberto);
    }

    function menu(num: number) {
        setPagina(num)
    }

    return (
        <div>
            <div className="absolute" style={{ top: `${top * 4}px`, right: `${right * 4}px` }}>
                <Bars3Icon onClick={toggleMenu} className="h-12 w-12 text-purple-600 cursor-pointer"></Bars3Icon>
            </div>

            <div className={`fixed z-1000 top-0 right-0 h-full border-l-1 border-zinc-400  bg-white font-bold text-black w-64 transform ${menuAberto ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
                <div className="p-4 mt-4">
                    <div className="flex justify-between w-full items-center">
                        <h1 className="font-bold text-purple-600">ESTUDARE</h1>
                        <Bars3Icon onClick={toggleMenu} className="h-10 w-10 text-black cursor-pointer" />
                    </div>
                    <ul className="mt-4 space-y-2 flex flex-col gap-1">
                        <li onClick={() => menu(3)} className={`cursor-pointer transition-all duration-100 hover:bg-zinc-200 p-2 rounded ${Pagina == 3 ? "bg-zinc-200" : ""}`}>Principal</li>
                        <li onClick={() => menu(4)} className={`cursor-pointer transition-all duration-100 hover:bg-zinc-200 p-2 rounded ${Pagina == 4 ? "bg-zinc-200" : ""}`}>Aspectos</li>
                        <li onClick={() => menu(5)} className={`cursor-pointer transition-all duration-100 hover:bg-zinc-200 p-2 rounded ${Pagina == 5 ? "bg-zinc-200" : ""}`}>Saiba_Mais</li>
                    </ul>
                </div>
            </div>
        </div>



    )
}