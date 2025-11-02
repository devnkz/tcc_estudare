"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LightBulbIcon, PlusIcon } from "@heroicons/react/16/solid";
import { motion } from "framer-motion";
import { User } from "@/types/user";

interface HomeProps {
  userData: User;
}

export function InitialPage({ userData }: HomeProps) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex flex-col items-center justify-start px-4"
      style={{ paddingTop: headerHeight + 10 }}
    >
      <div className="w-full max-w-[1200px] flex flex-col items-center text-center">
        {/* Saudação */}
        <div className="space-y-1 mt-6">
          <h1 className="font-bold text-4xl text-gray-800">
            Olá,{" "}
            <span className="text-purple-600">
              {userData?.nome_usuario || "usuário"}
            </span>
          </h1>
          <p className="text-zinc-600 text-base">Tem alguma dúvida hoje?</p>
        </div>

        {/* Título central */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-snug"
        >
          <span className="text-purple-600">Responda perguntas</span>
          <br />e ajude seus colegas!
        </motion.h1>

        <p className="text-gray-500 text-base max-w-xl mx-auto mt-2">
          Compartilhe seu conhecimento e aprenda com outros alunos.
        </p>

        {/* Botões principais */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mt-6"
        >
          <Link
            href="/askQuestion"
            prefetch
            className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium text-base shadow-md transition-all duration-300"
          >
            <LightBulbIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            Faça uma pergunta
          </Link>

          <Link
            href="/groups"
            prefetch
            className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium text-base shadow-md transition-all duration-300"
          >
            <PlusIcon className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
            Criar um grupo
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
