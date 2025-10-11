import Image from "next/image";
import Link from "next/link";
import { UserIcon, BellIcon } from "@heroicons/react/24/solid";
import { Inter } from "next/font/google";
import { Button } from "../ui/button";

// Fontes Inter
const interthin = Inter({ subsets: ["latin"], weight: ["100"] });
const interextraLight = Inter({ subsets: ["latin"], weight: ["200"] });
const interlight = Inter({ subsets: ["latin"], weight: ["300"] });
const interregular = Inter({ subsets: ["latin"], weight: ["400"] });
const intermedium = Inter({ subsets: ["latin"], weight: ["500"] });
const intersemibold = Inter({ subsets: ["latin"], weight: ["600"] });
const interbold = Inter({ subsets: ["latin"], weight: ["700"] });
const interextrabold = Inter({ subsets: ["latin"], weight: ["800"] });
const interblack = Inter({ subsets: ["latin"], weight: ["900"] });

/* ------------------ HEADER AUTENTICADO ------------------ */
export function HeaderDesktopAutenticado() {
  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center ">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <Image
            src="/imagens/Transparente/7.png"
            height={100}
            width={280}
            style={{ objectFit: "contain" }}
            alt="Logo Estudare"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Navegação principal */}
        <nav className="flex items-center gap-8 cursor-pointer">
          {[
            { href: "/home", label: "Home" },
            { href: "/about", label: "Conheça-nos" },
            { href: "/groups", label: "Grupos" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${intermedium.className} text-gray-600 hover:text-purple-600 transition-colors duration-300 relative group text-lg`}
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Ações do usuário */}
        <div className="flex items-center gap-1">
          {/* Notificações */}
          <Link href="/notifications">
            <button
              className={`${intersemibold.className} flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-50 text-purple-600 cursor-pointer hover:bg-purple-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-purple-100`}
            >
              <BellIcon className="h-5 w-5" />
              <span>Notificações</span>
            </button>
          </Link>

          {/* Separador visual */}
          <div className="h-6 w-[1px] bg-gray-200 mx-1 cursor-pointer" />

          {/* Conta do usuário */}
          <Link href="/user">
            <button
              className={`${intersemibold.className} flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 text-white cursor-pointer hover:bg-purple-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300  `}
            >
              <UserIcon className="h-5 w-5" />
              <span>Minha Conta</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------ HEADER NÃO AUTENTICADO ------------------ */
export function HeaderDesktopNaoAutenticado() {
  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/imagens/Transparente/7.png"
            height={75}
            width={170}
            style={{ objectFit: "contain" }}
            alt="Logo Estudare"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Botões */}
        <div className="flex gap-3">
          <Link
            href="/Auth/Register"
            className={`${interbold.className} px-5 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-700 transition-all duration-300 shadow-sm`}
          >
            Cadastrar-se
          </Link>
          <Link
            href="/Auth/Login"
            className={`${interbold.className} px-5 py-2 rounded-lg border border-purple-500 text-purple-500 hover:bg-purple-50 transition-all duration-300`}
          >
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------ HEADER LOGIN / CADASTRO ------------------ */
export function HeaderLoginCadastro() {
  return (
    <header className="w-full max-w-7xl flex flex-col items-center mx-auto py-6">
      <Link href="/" className="flex flex-col items-center">
        <Image
          src="/imagens/Transparente/5.png"
          height={370}
          width={370}
          alt="Logo Estudare"
          style={{ objectFit: "contain" }}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
    </header>
  );
}
