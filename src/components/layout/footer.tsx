"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";

const interthin = Inter({ subsets: ["latin"], weight: ["100"] });
const interextraLight = Inter({ subsets: ["latin"], weight: ["200"] });
const interlight = Inter({ subsets: ["latin"], weight: ["300"] });
const interregular = Inter({ subsets: ["latin"], weight: ["400"] });
const intermedium = Inter({ subsets: ["latin"], weight: ["500"] });
const intersemibold = Inter({ subsets: ["latin"], weight: ["600"] });
const interbold = Inter({ subsets: ["latin"], weight: ["700"] });
const interextrabold = Inter({ subsets: ["latin"], weight: ["800"] });
const interblack = Inter({ subsets: ["latin"], weight: ["900"] });

export default function Footer() {
  const router = useRouter();

  return (
    <footer
      className="bg-gradient-to-b from-white via-violet-50 to-purple-100
    00 w-full mt-auto"
    >
      <div className="relative inline-flex items-center justify-center  w-full">
        <hr className="w-128 h-px my-8 bg-gray-400 border-0" />
        <span
          className={`${interbold.className} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 font-medium text-gray-400 bg-white text-center whitespace-nowrap`}
        >
          Continue estudando com a gente!
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Logo e Descrição */}
          <div className="flex flex-col items-center lg:items-start space-y-5">
            <div className="flex items-center gap-3">
              <Image
                src="/imagens/Transparente/3.png"
                height={50}
                width={50}
                alt="Logo Estudare"
                style={{ objectFit: "contain" }}
              />
            </div>
            <p
              className={`${interregular.className} text-gray-600 text-center lg:text-left max-w-xs leading-relaxed`}
            >
              Plataforma colaborativa para auxílio de estudantes.
            </p>
            <p
              className={`${interlight.className} text-sm text-gray-500 text-center lg:text-left`}
            >
              Desenvolvido por Enzo, Gabriel, Nyckolas e Vinicius.
            </p>
          </div>

          {/* Links de Navegação */}
          <div className="flex justify-center lg:justify-center">
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-3">
                <h3
                  className={`${intersemibold.className} bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent text-lg`}
                >
                  Navegação
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      onClick={() => router.push("/home")}
                      className={`${interregular.className} cursor-pointer text-gray-600 hover:text-purple-600 hover:translate-x-1 inline-block transition-all duration-300 text-sm`}
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => router.push("/about")}
                      className={`${interregular.className} cursor-pointer text-gray-600 hover:text-purple-600 hover:translate-x-1 inline-block transition-all duration-300 text-sm`}
                    >
                      Saiba mais
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3
                  className={`${intersemibold.className} bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent text-lg`}
                >
                  Plataforma
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      onClick={() => router.push("/groups")}
                      className={`${interregular.className} cursor-pointer text-gray-600 hover:text-purple-600 hover:translate-x-1 inline-block transition-all duration-300 text-sm`}
                    >
                      Seus grupos
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => router.push("/")}
                      className={`${interregular.className} cursor-pointer text-gray-600 hover:text-purple-600 hover:translate-x-1 inline-block transition-all duration-300 text-sm`}
                    >
                      Apresentação
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="flex flex-col items-center lg:items-end space-y-4">
            <div className="text-center lg:text-right">
              <h3
                className={`${intersemibold.className} bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent text-lg`}
              >
                Sobre o Estudare
              </h3>
              <p
                className={`${interregular.className} text-gray-600 text-sm max-w-xs leading-relaxed`}
              >
                Uma plataforma inovadora que conecta estudantes para
                compartilhar conhecimento e resolver dúvidas juntos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
