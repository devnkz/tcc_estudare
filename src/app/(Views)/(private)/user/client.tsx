"use client";

import { UserIcon, PencilIcon } from "@heroicons/react/16/solid";
import { LuFiles } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { UpdateUserModal } from "./updateUserModal";
import { useState } from "react";
import { deleteToken } from "@/lib/deleteToken";

export default function UsuarioClientPage({
  user,
  perguntas,
}: {
  user: any;
  perguntas: any[];
}) {
  const router = useRouter();
  const cores = ["bg-blue-600", "bg-green-600", "bg-red-600", "bg-yellow-600"];

  const [openDialog, setOpenDialog] = useState<null | "usuario">(null);

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
            <button
              onClick={() => setOpenDialog("usuario")}
              className="rounded-full bg-zinc-200 cursor-pointer p-2 relative hover:-translate-y-1 hover:bg-purple-600 transition-all duration-300 group"
            >
              <PencilIcon className="h-8 w-8 text-black group-hover:text-white" />
              <span className="hidden group-hover:block absolute left-0 top-14 bg-zinc-400 text-white p-2 text-xs rounded-lg whitespace-nowrap">
                Editar seu perfil
              </span>
            </button>
          </div>

          <div className="bg-white p-2 rounded-lg h-[400px]">
            <div className="flex justify-between px-2 py-4 border-b-2 border-zinc-300">
              <div>
                <h2 className="text-zinc-600 text-xs">Série/Curso</h2>
                <h1 className="font-bold text-xl">3 Infonet</h1>
              </div>

              <div>
                <h2 className="text-zinc-600 text-xs">Perguntas Feitas</h2>
                <h1 className="font-bold text-xl">{perguntas.length}</h1>
              </div>
            </div>
            {perguntas.length > 0 ? (
              perguntas.map((p, index) => {
                const cor = cores[index % cores.length];
                return (
                  <div
                    key={p.id}
                    className="flex gap-2 px-2 py-4 border-b-2 border-zinc-300"
                  >
                    <LuFiles
                      className={`h-10 w-10 p-2 rounded-full text-white ${cor}`}
                    />
                    <div>
                      <h1 className="font-bold text-black text-xs">
                        {p.materia}
                      </h1>
                      <p
                        className="max-w-[200px] truncate text-base text-zinc-600"
                        title={p.pergunta}
                      >
                        {p.pergunta}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <h2 className="text-zinc-600 text-sm mt-4">
                Você ainda não fez nenhuma pergunta.
              </h2>
            )}

            <button
              onClick={() => {
                deleteToken("token");
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <UpdateUserModal
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        user={user}
      />
    </div>
  );
}
