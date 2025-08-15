"use client";

import { UserIcon, PencilIcon } from "@heroicons/react/16/solid";
import { LuFiles } from "react-icons/lu";
import { useRouter } from "next/navigation";

export default function UsuarioClientPage( {user} : {user: any} ) {
  const router = useRouter();

  return (
    <div className="w-full flex justify-center bg-white p-2">
      <div className="w-[600px] flex flex-col justify-center items-center py-14 space-y-2 relative">
        <div className="space-y-2 w-full flex flex-col justify-center items-center">
          <UserIcon className="h-20 w-20 p-4 bg-zinc-300 rounded-full" />
          <h2 className="text-sm text-zinc-600">
            Estudante desde{" "}
            {new Date(user.createdAt).toLocaleDateString("pt-BR")}
          </h2>
        </div>
        <h1 className="font-bold text-xl">{user.name}</h1>
        <h2 className="text-zinc-700 text-base">Seu apelido: {user.apelido}</h2>

        <div className="p-2 rounded-xl w-full space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold">Informações</h2>
            <PencilIcon className="h-10 w-10 bg-zinc-400 text-black p-2 rounded-full" />
          </div>

          <div className="bg-white p-2 rounded-lg h-[400px]">
            <div className="flex justify-between px-2 py-4 border-b-2 border-zinc-300">
              <div>
                <h2 className="text-zinc-600 text-xs">Série/Curso</h2>
                <h1 className="font-bold text-xl">3 Infonet</h1>
              </div>

              <div>
                <h2 className="text-zinc-600 text-xs">Perguntas Feitas</h2>
                <h1 className="font-bold text-xl">3</h1>
              </div>
            </div>

            <div className="flex gap-2 px-2 py-4 border-b-2 border-zinc-300">
              <LuFiles className="h-10 w-10 p-2 bg-blue-600 rounded-full text-white" />
              <div>
                <h1 className="font-bold text-black text-xs">TypeScript</h1>
                <p
                  className="max-w-[200px] truncate text-base text-zinc-600"
                  title="Qual a diferença entre o TypeScript e o JavaScript?"
                >
                  Qual a diferença entre o TypeScript e o JavaScript?
                </p>
              </div>
            </div>

            <div className="flex gap-2 px-2 py-4 border-b-2 border-zinc-300">
              <LuFiles className="h-10 w-10 p-2 bg-yellow-600 rounded-full text-white" />
              <div>
                <h1 className="font-bold text-black text-xs">Banco de dados</h1>
                <p
                  className="max-w-[200px] truncate text-base text-zinc-600"
                  title="Qual a diferença entre o TypeScript e o JavaScript?"
                >
                  Qual a diferença entre o TypeScript e o JavaScript?
                </p>
              </div>
            </div>

            <div className="flex gap-2 px-2 py-4 border-b-2 border-zinc-300">
              <LuFiles className="h-10 w-10 p-2 bg-red-600 rounded-full text-white" />
              <div>
                <h1 className="font-bold text-black text-xs">Matemática</h1>
                <p
                  className="max-w-[200px] truncate text-base text-zinc-600"
                  title="Qual a diferença entre o TypeScript e o JavaScript?"
                >
                  Qual a diferença entre o TypeScript e o JavaScript?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
