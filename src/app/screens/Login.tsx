import { Inter } from "next/font/google";
import { MagnifyingGlassIcon, LockClosedIcon, UserIcon } from "@heroicons/react/16/solid";

const inter = Inter({ subsets: ['latin'], weight: ['400'] })

export default function Login() {
    return (
        <div className={`${inter.className} bg-zinc-100 h-screen w-full flex flex-col justify-around items-center`}>
            <header>
                <h1 className="font-bold text-4xl">LOGO</h1>
            </header>
            <div className="flex flex-col gap-4">
                <div className="w-full flex flex-col justify-center items-center">
                    <h1 className="font-bold text-3xl">Cadastre-se</h1>
                    <p>Cadastre-se para maior iniciativa da <span className="font-bold">ETEC</span></p>
                </div>
                <form className="w-full p-4 flex flex-col gap-4 items-center rounded-lg">
                    <div>
                        <label>Email institucional</label>
                        <div className="flex gap-4 p-2 shadow-xl">
                            <MagnifyingGlassIcon height={20} width={20} />
                            <input placeholder="email@etec.sp.gov.br" />
                        </div>
                    </div>

                    <div>
                        <label>Email institucional</label>
                        <div className="flex gap-4 p-2 shadow-xl">
                            <MagnifyingGlassIcon height={20} width={20} />
                            <input placeholder="email@etec.sp.gov.br" />
                        </div>
                    </div>

                    <div>
                        <label>RM aluno</label>
                        <div className="flex gap-4 p-2 shadow-xl">
                            <UserIcon height={20} width={20} />
                            <input placeholder="231.000.000" />
                        </div>
                    </div>

                    <div>
                        <label>Senha</label>
                        <div className="flex gap-4 p-2 shadow-xl">
                            <LockClosedIcon height={20} width={20} />
                            <input placeholder="Sua_Senha@123" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}