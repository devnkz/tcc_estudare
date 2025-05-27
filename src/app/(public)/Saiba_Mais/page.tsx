'use client';

import Image from "next/image"
import { MenuLateral } from "@/app/components/Menu_Lateral";
import Footer from "@/app/components/Footer";
import { Inter } from "next/font/google"
import { useState, useEffect } from "react";
import { HeaderDesktop } from "@/app/components/Header";
import { CardDuvidas } from "./components/CardDuvidas";

const inter = Inter({ subsets: ['latin'], weight: ['400'] })

export default function Saiba_Mais() {

    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
    const [showMenuMobile, setShowMenuMobile] = useState(false);

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setShowMenuMobile(width < 1024);
    }, [width]);


    return (
        <div className={`${inter.className} bg-zinc-100 w-full flex flex-col justify-between items-center`}>
            {
                /* Header Mobile  */
                showMenuMobile &&
                <header className="w-full bg-zinc-200 justify-between items-center px-6 py-3">
                    <Image src="/imagens/logo.png" height={50} width={50} alt="logo Estudare" style={{ objectFit: "contain" }} />
                    <MenuLateral top={7} right={6} numero={1} />
                </header>

            }
            {
                /* Header Desktop  */
                !showMenuMobile &&
                <HeaderDesktop />
            }

            <main className="text-black">
                <div className="w-full flex flex-col justify-center items-center gap-6 p-6">
                    <h1 className="text-4xl font-bold text-center">Tem dúvidas ?<br /> A gente tem as respostas.</h1>
                    <p className="text-zinc-700 w-3/4">
                        Estamos aqui para esclarecer suas dúvidas e oferecer suporte que você precisa
                        para seguir em frente com confiança.
                    </p>

                    <button className="p-4 rounded-lg bg-purple-600 text-white">Faça uma pergunta</button>

                    <div className="bg-white p-4 rounded-lg">
                        <p className="text-zinc-600 font-bold px-3 mb-4">Perguntas frequentes</p>
                        <CardDuvidas numero="01" duvida="O que é o estudare ?" texto="Texto exemple" />

                        <CardDuvidas numero="02" duvida="O que é o estudare ?" texto="Texto exemple" />

                        <CardDuvidas numero="03" duvida="O que é o estudare ?" texto="Texto exemple" />
                    </div>
                </div>
            </main>

            <Footer />
        </div >
    )
}