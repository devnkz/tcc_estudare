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
      title: "Origem do Estudare",
      content:
        "O Estudare nasceu como um grupo de estudos presencial na ETEC de Santa Fé do Sul: alunos se reuniam à tarde na biblioteca para trocar exercícios, dúvidas e anotações. Com o tempo a experiência mostrou que aquelas trocas valiam para toda a comunidade — assim nasceu a ideia de transformar o grupo em uma plataforma online, mantendo o foco no estudo colaborativo.",
    },
    {
      key: "2",
      title: 'O que é o "ESTUDARE"?',
      content:
        "Hoje, Estudare é uma plataforma colaborativa de aprendizado que conecta alunos e professores para fazer e responder perguntas, compartilhar materiais e revisar conceitos. Mantemos o espírito do grupo de estudos original: colaboração, clareza e foco pedagógico.",
    },
    {
      key: "2a",
      title: "Problemáticas e o que o Estudare resolve",
      content:
        "Muitos alunos queriam participar do grupo de estudos presencial, mas enfrentavam barreiras práticas: falta de tempo após as aulas, dificuldades de transporte e compromissos que impediam a ida à biblioteca à tarde. Além disso, dúvidas simples muitas vezes ficavam sem resposta rápida — o aluno precisava ir até o grupo presencial ou esperar por alguém com disponibilidade. A organização de grupos de estudo também sofria por não haver um espaço reservado e estruturado para gerenciar membros, materiais e encontros.\n\nEstudare resolve isso ao oferecer um espaço online aberto 24/7: quem não consegue comparecer presencialmente pode participar, postar dúvidas e receber respostas; dúvidas simples são resolvidas rapidamente pela comunidade; e grupos de estudo podem ser organizados em espaços privados com convites, facilitando coordenação e mantendo recursos e discussões centralizados.",
    },
    {
      key: "3",
      title: "Por que usar o Estudare?",
      content:
        "Estudare organiza dúvidas por assunto, preserva histórico de perguntas e permite discussões estruturadas — ideal para revisão, tirar dúvidas rápidas e acessar explicações curadas. A comunidade acelera respostas e os professores garantem qualidade quando necessário.",
    },
    {
      key: "4",
      title: "Como garantimos qualidade nas respostas?",
      content:
        "Utilizamos curadoria de professores, moderação comunitária e ferramentas automáticas (filtros de linguagem). Usuários podem sinalizar conteúdo problemático; denúncias são revisadas por moderadores e, quando necessário, por especialistas.",
    },
    {
      key: "5",
      title: "Como funcionam as notificações?",
      content:
        "As notificações serão usadas exclusivamente para informar sobre o status de denúncias que você registrou. Você receberá atualizações quando a denúncia for analisada, revisada ou quando houver alguma ação tomada. Elas não serão usadas para publicidade ou avisos gerais.",
    },
    {
      key: "6",
      title: "O que acontece quando eu faço uma denúncia?",
      content:
        "Ao sinalizar conteúdo, sua denúncia entra em fila para revisão. A equipe toma ações conforme as políticas: remoção de conteúdo, advertência ou outras medidas. Você pode acompanhar o andamento pela notificação de sistema.",
    },
    {
      key: "7",
      title: "Como funcionam os grupos privados?",
      content:
        "Grupos privados são espaços restritos para estudo em pequenos times. O criador convida membros, compartilha materiais e inicia discussões que só os participantes conseguem ver — ideal para projetos, trabalhos e revisões em grupo.",
    },
    {
      key: "8",
      title: "Privacidade e segurança",
      content:
        "Coletamos apenas os dados essenciais para operação (perfil, participações e preferências). Não vendemos informações e aplicamos boas práticas de segurança. Para mudanças sensíveis aplicamos validações adicionais e logs de auditoria.",
    },
    {
      key: "9",
      title: "Tempo de desenvolvimento",
      content:
        "O projeto foi desenvolvido em fases — planejamento, implementação, testes e validação pedagógica — ao longo de vários meses. Continuamos iterando e entregando melhorias baseadas no uso real e no feedback dos usuários.",
    },
    {
      key: "10",
      title: "Preciso de ajuda — como contatar?",
      content:
        "Para suporte, entre em contato com o Grêmio Estudantil ou com o grupo responsável pelo projeto. Caso preferir, envie um email para: etecestudare@gmail.com. Por favor descreva o problema com detalhes (passos para reproduzir, prints e contexto) para que possamos ajudar rapidamente.",
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
