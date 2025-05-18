'use client'

import Footer from "@/app/components/Footer"
import { Inter } from "next/font/google"
import { EyeSlashIcon, EnvelopeIcon } from "@heroicons/react/16/solid"
import { InputComIcon, InputSemIcon } from "../components/input"
import { BotoesFormulario, MensagemRedirecionamento } from "../components/button"
import { HeaderLoginCadastro } from "../components/header"

const inter = Inter({ subsets: ['latin'], weight: ['400'] })

export default function CadastroUsuario() {
    return (
        <div className={`${inter.className} bg-zinc-100 w-full p-4 flex flex-col justify-between items-center`}>
            <HeaderLoginCadastro />

            <main className="w-full lg:max-w-[1200px] flex flex-col items-center justify-center gap-4">

                <form className="flex flex-col gap-4 p-8 rounded w-full md:w-2/4 text-black">
                    <InputSemIcon
                        label="Nome"
                        placeholder="Digite seu nome"
                    />

                    <InputSemIcon
                        label="Apelido"
                        placeholder="Digite seu apelido"
                    />

                    <InputComIcon
                        type="email"
                        icon={EnvelopeIcon}
                        placeholder="Digite seu email"
                        label="Email"
                    />
                    <InputComIcon
                        podeMostrarSenha={true}
                        icon={EyeSlashIcon}
                        placeholder="Digite sua senha"
                        label="Senha"
                    />

                    <BotoesFormulario textButton="Cadastrar-se" />

                    <MensagemRedirecionamento
                        pergunta="Já possui uma conta?"
                        textButton="Entrar agora"
                        rotaRedirecionamento="/screens/Login_Cadastro/Login"
                    />
                </form>
            </main>
            <Footer />
        </div>
    )
}