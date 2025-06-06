'use client'

import Footer from "@/app/components/Footer"
import { HeaderDesktop } from "@/app/components/Header"
import { Inter } from "next/font/google"
import Image from "next/image"

const inter = Inter({subsets: ['latin'], weight: '400'})

export default function NotificacaoPage (){
    return(
        <div className={`${inter.className} bg-zinc-50 w-full flex flex-col justify-between items-center`}>
            <HeaderDesktop/>

            <div className="w-full md:max-w-[1200px] flex flex-col gap-6 justify-center items-center my-14">
                <h1 className="font-bold text-2xl">NOTIFICAÇÕES</h1>

                <div className="w-full flex justify-center items-center">
                    <div className="flex flex-col gap-8 w-full justify-center items-center">
                        <div className="space-x-4 w-1/3 flex items-center bg-zinc-100 p-2 rounded-lg">
                            <Image src={'/imagens/avatar-exemp.jpg'} width={75} height={75} alt="avatar da notificação"
                            className="rounded-full"
                            style={{objectFit: 'cover'}}/>
                            <h1 className="text-black font-bold">Grupo: Desenvolvimento Front-end <span className="text-zinc-600 font-normal">tem novas mensagens</span></h1>
                        </div>

                        <div className="space-x-4 w-1/3 flex items-center bg-zinc-100 p-2 rounded-lg">
                            <Image src={'/imagens/avatar-exemp.jpg'} width={75} height={75} alt="avatar da notificação"
                            className="rounded-full"
                            style={{objectFit: 'cover'}}/>
                            <h1 className="text-black font-bold">Grupo: Desenvolvimento Front-end <span className="text-zinc-600 font-normal">tem novas mensagens</span></h1>
                        </div>

                        <div className="space-x-4 w-1/3 flex items-center bg-zinc-100 p-2 rounded-lg">
                            <Image src={'/imagens/avatar-exemp.jpg'} width={75} height={75} alt="avatar da notificação"
                            className="rounded-full"
                            style={{objectFit: 'cover'}}/>
                            <h1 className="text-black font-bold">Grupo: Desenvolvimento Front-end <span className="text-zinc-600 font-normal">tem novas mensagens</span></h1>
                        </div>
                        <div className="space-x-4 w-1/3 flex items-center bg-zinc-100 p-2 rounded-lg">
                            <Image src={'/imagens/avatar-exemp.jpg'} width={75} height={75} alt="avatar da notificação"
                            className="rounded-full"
                            style={{objectFit: 'cover'}}/>
                            <h1 className="text-black font-bold">Grupo: Desenvolvimento Front-end <span className="text-zinc-600 font-normal">tem novas mensagens</span></h1>
                        </div>
                        <div className="space-x-4 w-1/3 flex items-center bg-zinc-100 p-2 rounded-lg">
                            <Image src={'/imagens/avatar-exemp.jpg'} width={75} height={75} alt="avatar da notificação"
                            className="rounded-full"
                            style={{objectFit: 'cover'}}/>
                            <h1 className="text-black font-bold">Grupo: Desenvolvimento Front-end <span className="text-zinc-600 font-normal">tem novas mensagens</span></h1>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}