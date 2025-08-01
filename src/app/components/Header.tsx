import Image from "next/image";
import { UserIcon, BellIcon } from "@heroicons/react/16/solid";
import { Button } from "./button";
import Link from "next/link";

export function HeaderDesktopAutenticado() {
  return (
    <header className="hidden w-full lg:flex justify-between items-center lg:max-w-[1200px] p-4 border-b-2 border-zinc-200">
      <div className="flex w-52">
        <Image
          src="/imagens/Logo/logoroxofundobrando.png"
          height={100}
          width={100}
          alt="logo Estudare"
          style={{ objectFit: "contain" }}
        />
      </div>
      <nav>
        <ul className="flex gap-4 items-center justify-center">
          <li>
            <Link
              href="/Dashboard"
              className="cursor-pointer text-zinc-400 hover:text-purple-600 text-lg transition-colors duration-300 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="cursor-pointer text-zinc-400 hover:text-purple-600 text-lg transition-colors duration-300 relative group"
            >
              Conheça-nos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>
          <li>
            <a
              href="#comoFunciona"
              className="cursor-pointer text-zinc-400 hover:text-purple-600 text-lg transition-colors duration-300 relative group"
            >
              Grupos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </li>
          {/* Itens de notificação e usuário também devem ser <li> */}
          <li className="flex space-x-3">
            <Link href="/notificacoes">
              <button className="rounded-full bg-zinc-200 p-2 relative cursor-pointer hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 group">
                <BellIcon className="h-8 w-8 text-black group-hover:text-white" />
                <span className="hidden group-hover:block absolute left-0 top-14 bg-zinc-400 text-white p-2 text-xs rounded-lg">
                  Notificações
                </span>
              </button>
            </Link>

            <Link href="/Usuario">
              <button className="rounded-full bg-zinc-200 p-2 relative cursor-pointer hover:-translate-y-1 hover:bg-purple-600 hover:text-white transition-all duration-300 group">
                <UserIcon className="h-8 w-8 text-black group-hover:text-white" />
                <span className="hidden group-hover:flex absolute left-0 top-14 bg-zinc-400 text-white p-2 text-xs rounded-lg whitespace-nowrap">
                  Sua conta
                </span>
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export function HeaderDesktopNaoAutenticado() {
  return (
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
  );
}
