'use client';

import Footer from "@/app/components/Footer"
import { Inter } from "next/font/google"
import { BotoesFormulario, MensagemRedirecionamento } from "../components/button"
import { InputComIcon, InputSemIcon } from "../components/input"
import { HeaderLoginCadastro } from "../components/header"
import { EyeSlashIcon } from "@heroicons/react/16/solid"

const inter = Inter({ subsets: ['latin'], weight: ['400'] })

export default function LoginUsuario() {
    return (
        <div className={`${inter.className} bg-zinc-100 w-full h-screen p-4 flex flex-col justify-between items-center`}>
            <HeaderLoginCadastro />
            <main className="w-full lg:max-w-[1200px] flex flex-col items-center justify-center gap-4">
                <form className="flex flex-col gap-4 p-8 rounded w-full md:w-2/4 text-black">

                    <InputSemIcon label="Email" placeholder="Digite seu email" type="email" />
                    <InputComIcon label="Senha" placeholder="Digite sua senha" icon={EyeSlashIcon} podeMostrarSenha />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="lembrar" className="accent-purple-600" />
                            <span className="text-sm">Lembre de mim</span>
                        </label>
                        <button
                            type="button"
                            className="text-purple-600 text-sm hover:underline"
                        >
                            Esqueceu a senha?
                        </button>
                    </div>

                    <BotoesFormulario textButton="Entrar" />

                    <MensagemRedirecionamento
                        pergunta="Ainda não tem uma conta ?"
                        textButton="Criar agora"
                        rotaRedirecionamento="/Login_Cadastro/Cadastro"
                    />
                </form>
            </main>
            <Footer />
        </div>
    )
}