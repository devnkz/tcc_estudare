"use client";

import Footer from "@/components/layout/footer";
import { Accordion, AccordionItem } from "@heroui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import React from "react";

const intersemibold = Inter({ subsets: ["latin"], weight: ["600"] });
const interregular = Inter({ subsets: ["latin"], weight: ["400"] });

const AnimatedPlus = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <PlusIcon
      className={`h-6 w-6 text-purple-500 transition-transform duration-300 ${
        isOpen ? "rotate-45" : "rotate-0"
      }`}
    />
  );
};

export default function Saiba_Mais() {
  const [openItems, setOpenItems] = useState<string[]>(["1"]);

  const toggleItem = (key: string) => {
    setOpenItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const perguntas = [
    {
      key: "1",
      title: "O que é o 'ESTUDARE'?",
      content:
        "Estudare é uma iniciativa da ETEC de Santa Fé do Sul, e agora também plataforma colaborativa onde alunos podem fazer perguntas e receber respostas de outros estudantes e professores. Um espaço para compartilhar conhecimento e aprenderem juntos.",
    },
    {
      key: "2",
      title: "Aspectos",
      content:
        "Oferecemos respostas rápidas e confiáveis, com a garantia de qualidade comprovada por professores especializados. Nosso compromisso é fornecer soluções precisas e eficientes.",
    },
    {
      key: "3",
      title: "Por que usar o nosso site?",
      content:
        "Porque oferecemos uma experiência de aprendizado colaborativa única, te conectando com outros alunos da ETEC. Nosso site ajuda os alunos a aprenderem de forma mais rápida e confiável.",
    },
    {
      key: "4",
      title: "Como garantimos qualidade nas respostas?",
      content:
        "A qualidade é garantida através da curadoria de professores especializados e do uso de métodos pedagógicos reconhecidos.",
    },
    {
      key: "5",
      title: "Quanto tempo levou para conclusão do projeto?",
      content:
        "O projeto levou alguns meses para ser concluído, incluindo planejamento, desenvolvimento, validação pedagógica e testes.",
    },
  ];

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

  return (
    <div
      className={`${interregular.className} w-full min-h-screen flex flex-col bg-white`}
    >
      <div
        className="w-full mx-auto flex-1 flex flex-col"
        style={{ paddingTop: headerHeight - 40 }}
      >
        <main className="flex-1 flex items-center justify-center py-16 px-2 w-full mb-8">
          <div className="max-w-4xl w-full">
            {/* Cabeçalho */}
            <div className="text-center mb-10">
              <h1 className={`${intersemibold.className} text-purple-400 mb-4`}>
                SAIBA MAIS
              </h1>
              <h1 className="text-5xl font-bold text-gray-900 mb-3 leading-tight">
                Tem dúvidas?
                <br />
                <span className="text-purple-600">
                  A gente tem as respostas.
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Estamos aqui para esclarecer suas dúvidas e oferecer o suporte
                que você precisa para seguir em frente com confiança.
              </p>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-6 max-w-3xl mx-auto">
              <Accordion
                defaultExpandedKeys={["1"]}
                hideIndicator
                variant="bordered"
                selectedKeys={openItems}
                onSelectionChange={(keys) => {
                  const updatedKeys = Array.from(keys) as string[];
                  setOpenItems(updatedKeys);
                }}
                className="divide-y divide-gray-200"
              >
                {perguntas.map((item) => (
                  <AccordionItem
                    key={item.key}
                    aria-label={item.title}
                    title={
                      <div
                        onClick={() => toggleItem(item.key)}
                        className="flex justify-between items-center w-full cursor-pointer"
                      >
                        <span className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </span>
                        <AnimatedPlus isOpen={openItems.includes(item.key)} />
                      </div>
                    }
                    className={`transition-all duration-300 ${
                      openItems.includes(item.key)
                        ? "py-4" // mais espaço quando aberto
                        : "py-2" // menos espaço quando fechado
                    }`}
                  >
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        openItems.includes(item.key)
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-100"
                      }`}
                    >
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {item.content}
                      </p>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
