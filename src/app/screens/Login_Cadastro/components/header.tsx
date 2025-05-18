import Image from "next/image"

export function HeaderLoginCadastro() {
    return (
        <header className="w-full lg:max-w-[1200px] flex flex-col items-center">
            <Image src="/imagens/logo.png" height={100} width={100} alt="Logo estudare" style={{ objectFit: "contain" }} />
            <div className="text-black w-full flex flex-col items-center justify-center gap-2">
                <h1 className="text-3xl font-bold text-purple-600">ESTUDARE</h1>
                <p className="text-zinc-600">Entre na maior iniciativa da <span className="font-bold text-black">ETEC</span></p>
            </div>
        </header>
    )
}