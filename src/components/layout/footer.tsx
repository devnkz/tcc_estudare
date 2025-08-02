"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Logo e Descrição */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/imagens/Logo/logoroxofundobrando.png"
                height={40}
                width={40}
                alt="Logo Estudare"
                style={{ objectFit: "contain" }}
              />
              <span className="text-xl font-semibold text-gray-900">
                Estudare
              </span>
            </div>
            <p className="text-gray-600 text-center lg:text-left max-w-xs">
              Plataforma colaborativa de auxílio a estudantes
            </p>
            <p className="text-sm text-gray-500 text-center lg:text-left">
              Desenvolvido por Nyckolas, Gabriel, Enzo e Vinicius
            </p>
          </div>

          {/* Links de Navegação */}
          <div className="flex justify-center lg:justify-center">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Navegação</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      onClick={() => router.push("/Dashboard")}
                      className="cursor-pointer text-gray-600 hover:text-purple-500 transition-colors duration-200 text-sm"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => router.push("/about")}
                      className="cursor-pointer text-gray-600 hover:text-purple-500 transition-colors duration-200 text-sm"
                    >
                      Saiba mais
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Plataforma</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      onClick={() => router.push("/Home")}
                      className="cursor-pointer text-gray-600 hover:text-purple-500 transition-colors duration-200 text-sm"
                    >
                      Seus grupos
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => router.push("/")}
                      className="cursor-pointer text-gray-600 hover:text-purple-500 transition-colors duration-200 text-sm"
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
              <h3 className="font-semibold text-gray-900 mb-2">
                Sobre o Estudare
              </h3>
              <p className="text-gray-600 text-sm max-w-xs">
                Uma plataforma inovadora que conecta estudantes para
                compartilhar conhecimento e resolver dúvidas juntos.
              </p>
            </div>
          </div>
        </div>

        {/* Linha de Copyright */}
        <div className="border-t border-gray-100 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 ESTUDARE. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
