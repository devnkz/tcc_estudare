"use client";

import Image from "next/image";
import { MenuLateral } from "@/app/components/Menu_Lateral";
import Footer from "@/app/components/Footer";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { Button } from "../(Home)/components/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export default function Saiba_Mais() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
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
    <div className={`${inter.className} bg-white min-h-screen flex flex-col`}>
      {/* Header Mobile */}
      {showMenuMobile && (
        <header className="w-full bg-white border-b border-gray-100 flex justify-between items-center px-6 py-4 shadow-sm">
          <Image
            src="/imagens/Logo/logoroxofundobrando.png"
            height={40}
            width={40}
            alt="logo Estudare"
            style={{ objectFit: "contain" }}
          />
          <MenuLateral top={7} right={6} numero={1} />
        </header>
      )}

      {/* Header Desktop */}
      {!showMenuMobile && (
        <header className="w-full bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-6">
            <Image
              src="/imagens/Logo/logoroxofundobrando.png"
              height={60}
              width={60}
              style={{ objectFit: "contain" }}
              alt="Logo Estudare"
            />
            <div className="flex gap-4">
              <Button
                textButton="Cadastrar-se"
                rotaRedirecionamento="/Auth/Register"
              />
              <Button textButton="Entrar" rotaRedirecionamento="/Auth/Login" />
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Tem dúvidas?
              <br />
              <span className="text-purple-500">A gente tem as respostas.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Estamos aqui para esclarecer suas dúvidas e oferecer o suporte que
              você precisa para seguir em frente com confiança.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Perguntas Frequentes
              </h2>
              <p className="text-gray-600">
                As dúvidas mais comuns sobre nossa plataforma
              </p>
            </div>

            <div className="space-y-4">
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem
                  value="item-1"
                  className="border border-gray-200 rounded-lg"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium text-gray-900 hover:text-purple-500 transition-colors">
                    O que é o "ESTUDARE"?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                    Estudare é uma plataforma colaborativa onde alunos podem
                    fazer perguntas e receber respostas de outros estudantes e
                    professores. É um espaço para compartilhar conhecimento e se
                    aprenderem juntos.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="single" collapsible>
                <AccordionItem
                  value="item-2"
                  className="border border-gray-200 rounded-lg"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium text-gray-900 hover:text-purple-500 transition-colors">
                    Como funciona?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                    Os alunos podem fazer perguntas sobre qualquer assunto
                    relacionado aos estudos, e outros alunos ou professores
                    podem responder. As respostas são visíveis para todos,
                    promovendo um ambiente de aprendizado colaborativo.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="single" collapsible>
                <AccordionItem
                  value="item-3"
                  className="border border-gray-200 rounded-lg"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium text-gray-900 hover:text-purple-500 transition-colors">
                    Como surgiu a ideia?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                    A ideia surgiu da necessidade de criar um espaço onde os
                    alunos pudessem se ajudar mutuamente, compartilhando dúvidas
                    e conhecimentos. O objetivo é promover a colaboração e o
                    aprendizado entre os estudantes.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Faça uma pergunta
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
