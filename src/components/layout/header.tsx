import Image from "next/image";
import Link from "next/link";
import { UserIcon, BellIcon } from "@heroicons/react/16/solid";
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
    <header className="hidden w-full lg:flex justify-between items-center max-w-7xl mx-auto p-4 border-b border-zinc-200">
      {/* Logo */}
      <Link href="/" className="flex w-52 items-center">
        <Image
          src="/imagens/Logo/logoroxofundobrando.png"
          height={100}
          width={100}
          alt="Logo Estudare"
          style={{ objectFit: "contain" }}
        />
      </Link>

      {/* Navegação */}
      <nav>
        <ul className="flex gap-6 items-center justify-center">
          {[
            { href: "/home", label: "Home" },
            { href: "/about", label: "Conheça-nos" },
            { href: "/groups", label: "Grupos" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${interregular.className} cursor-pointer text-zinc-400 hover:text-purple-600 text-lg transition-colors duration-300 relative group`}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
          ))}

          {/* Notificações */}
          <li className="flex space-x-3">
            <Link href="/notifications">
              <button className="rounded-full bg-zinc-200 p-2 relative hover:-translate-y-1 hover:bg-purple-600 transition-all duration-300 group">
                <BellIcon className="h-8 w-8 text-black group-hover:text-white" />
                <span className="hidden group-hover:block absolute left-0 top-14 bg-zinc-400 text-white p-2 text-xs rounded-lg">
                  Notificações
                </span>
              </button>
            </Link>

            {/* Usuário */}
            <Link href="/user">
              <button className="rounded-full bg-zinc-200 p-2 relative hover:-translate-y-1 hover:bg-purple-600 transition-all duration-300 group">
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

/* ------------------ HEADER NÃO AUTENTICADO ------------------ */
export function HeaderDesktopNaoAutenticado() {
  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/imagens/Logo/gatopurple500transparente.png"
            height={75}
            width={75}
            style={{ objectFit: "contain" }}
            alt="Logo Estudare"
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
          src="/imagens/Logo/logoroxofundobrando.png"
          height={270}
          width={270}
          alt="Logo Estudare"
          style={{ objectFit: "contain" }}
        />
      </Link>
      {/* <div className=" w-full flex flex-col items-center justify-center mt-2">
        <p className={`${interregular.className} text-zinc-600 text-center`}>
          Entre para a maior iniciativa da <br />{" "}
          <span className="font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent ">
            ETEC de Santa Fé do Sul
          </span>
        </p>
      </div> */}
    </header>
  );
}
