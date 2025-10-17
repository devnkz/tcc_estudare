"use client";

import Image from "next/image";
import Link from "next/link";
import {
  UserIcon,
  BellIcon,
  HomeIcon,
  UsersIcon,
  InformationCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function HeaderDesktopAutenticado({
  tipo_usuario,
}: {
  tipo_usuario: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-1  flex items-center justify-between">
        {/* LADO ESQUERDO — LOGO + MENU */}
        <div className="flex items-center gap-4">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250, damping: 14 }}
              className="flex items-center"
            >
              <Image
                src="/imagens/Transparente/7.png"
                height={85}
                width={180}
                style={{ objectFit: "contain" }}
                alt="Logo Estudare"
                className="transition-transform"
              />
            </motion.div>
          </Link>

          {/* MENU (ÍCONE) */}
        </div>

        {/* LADO DIREITO — AÇÕES DO USUÁRIO */}
        <div className="flex items-center gap-4">
          {/* Notificações */}
          <motion.div whileHover={{ y: -0.5 }} transition={{ duration: 0.3 }}>
            <Link href="/notifications">
              <button
                className={`${inter.className} flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 cursor-pointer hover:bg-purple-100 hover:shadow-md transition-all duration-300`}
              >
                <BellIcon className="h-5 w-5" />
                <span>Notificações</span>
              </button>
            </Link>
          </motion.div>

          {/* Conta do usuário */}
          <motion.div whileHover={{ y: -0.5 }} transition={{ duration: 0.3 }}>
            <Link href="/user">
              <button
                className={`${inter.className} flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white cursor-pointer hover:bg-purple-700 hover:shadow-lg transition-all duration-300`}
              >
                <UserIcon className="h-5 w-5" />
                <span>Minha Conta</span>
              </button>
            </Link>
          </motion.div>
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center justify-center w-11 h-11 rounded-lg border border-gray-200 text-purple-600 hover:bg-purple-50 transition-all duration-300 cursor-pointer"
            >
              <motion.div
                animate={{
                  rotate: isOpen ? 90 : 0,
                  scale: isOpen ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 250, damping: 14 }}
              >
                <Bars3Icon className="h-6 w-6 " />
              </motion.div>
            </motion.button>
            {/* Botão MENU */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute left-0 mt-3 w-56 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden cursor-pointer"
                >
                  {[
                    {
                      href: "/home",
                      label: "Home",
                      icon: <HomeIcon className="h-5 w-5 text-purple-600" />,
                    },
                    {
                      href: "/about",
                      label: "Conheça-nos",
                      icon: (
                        <InformationCircleIcon className="h-5 w-5 text-purple-600" />
                      ),
                    },
                    {
                      href: "/groups",
                      label: "Grupos",
                      icon: <UsersIcon className="h-5 w-5 text-purple-600" />,
                    },
                    {
                      href: "/dashboard",
                      label: "Dashboard",
                      icon: (
                        <TbLayoutDashboardFilled className="h-5 w-5 text-purple-600" />
                      ),
                    },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`${inter.className} flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Linha decorativa suave */}
      <div className="w-full h-[1px] bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 opacity-10"></div>
    </header>
  );
}

/* ------------------ HEADER NÃO AUTENTICADO ------------------ */
export function HeaderDesktopNaoAutenticado() {
  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Image
              src="/imagens/Transparente/7.png"
              height={75}
              width={170}
              alt="Logo Estudare"
              style={{ objectFit: "contain" }}
            />
          </motion.div>
        </Link>

        {/* Botões */}
        <div className="flex gap-4">
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <Link
              href="/Auth/Register"
              className={`${inter.className} px-5 py-2 rounded-lg bg-purple-500 text-white cursor-pointer hover:bg-purple-700 transition-all duration-300 shadow-md`}
            >
              Cadastrar-se
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <Link
              href="/Auth/Login"
              className={`${inter.className} px-5 py-2 rounded-lg border border-purple-500 text-purple-500 cursor-pointer hover:bg-purple-50 transition-all duration-300 `}
            >
              Entrar
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

/* ------------------ HEADER LOGIN / CADASTRO ------------------ */
export function HeaderLoginCadastro() {
  return (
    <header className="w-full max-w-7xl flex flex-col items-center mx-auto py-6">
      <Link
        href="/"
        className="flex flex-col items-center group cursor-pointer"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 250, damping: 14 }}
        >
          <Image
            src="/imagens/Transparente/5.png"
            height={370}
            width={370}
            alt="Logo Estudare"
            style={{ objectFit: "contain" }}
          />
        </motion.div>
      </Link>
    </header>
  );
}
