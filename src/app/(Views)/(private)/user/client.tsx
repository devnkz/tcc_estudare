"use client";

import { UserIcon, PencilIcon } from "@heroicons/react/16/solid";
import { LuFiles } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { UpdateUserModal } from "./updateUserModal";
import { UpdateUserFotoModal } from "./fotoPerfilUser/index";
import { useState } from "react";
import { deleteToken } from "@/lib/deleteToken";
import { GoPencil } from "react-icons/go";
import { useGetUser } from "@/hooks/user/useListId";
import { Pergunta } from "@/types/pergunta";
import { User } from "@/types/user";
import {
  BsEmojiExpressionless,
  BsEmojiGrin,
  BsEmojiAngry,
} from "react-icons/bs";

export default function UsuarioClientPage({
  usuario: initialUser,
  perguntas,
}: {
  usuario: User;
  perguntas: Pergunta[];
}) {
  const router = useRouter();
  const cores = ["bg-blue-600", "bg-green-600", "bg-red-600", "bg-yellow-600"];

  const [openDialog, setOpenDialog] = useState<null | "usuario" | "foto">(null);

  const { data: usuario_data } = useGetUser(
    initialUser.id_usuario,
    initialUser
  );

  if (!usuario_data) return null;

  // Lógica de credibilidade
  let CredibilidadeEmoji;
  let credibilidadeMensagem;
  let credibilidadeCor;

  const cred = usuario_data.credibilidade_usuario;

  if (cred < 35) {
    CredibilidadeEmoji = BsEmojiAngry;
    credibilidadeMensagem =
      "Você precisa ser mais sério com suas responsabilidades!";
    credibilidadeCor = "bg-red-100 text-red-600";
  } else if (cred < 70) {
    CredibilidadeEmoji = BsEmojiExpressionless;
    credibilidadeMensagem = "Cuidado! Tome mais atenção às suas ações.";
    credibilidadeCor = "bg-yellow-100 text-yellow-600";
  } else {
    CredibilidadeEmoji = BsEmojiGrin;
    credibilidadeMensagem = "Parabéns! Continue com essa credibilidade alta.";
    credibilidadeCor = "bg-green-100 text-green-600";
  }

  return (
    <div className="w-full flex justify-center bg-gray-50 p-4">
      <div className="w-[600px] flex flex-col justify-center items-center py-14 space-y-4 relative">
        <div className="space-y-2 w-full flex flex-col justify-center items-center">
          <div
            className="relative cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setOpenDialog("foto")}
          >
            {usuario_data.foto_perfil ? (
              <img
                src={usuario_data.foto_perfil}
                alt="Foto do usuário"
                className="h-40 w-40 rounded-full object-cover border-4 border-purple-500 shadow-lg"
              />
            ) : (
              <UserIcon className="h-40 w-40 p-8 bg-zinc-300 rounded-full shadow-lg" />
            )}
            <span className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full text-white text-xl shadow-md">
              <GoPencil />
            </span>
          </div>

          <h2 className="text-sm text-zinc-600">
            Estudante desde{" "}
            {usuario_data.dataCriacao_usuario
              ? new Date(usuario_data.dataCriacao_usuario).toLocaleDateString(
                  "pt-BR"
                )
              : "-"}
          </h2>
        </div>

        <h1 className="font-bold text-3xl text-gray-800">
          {usuario_data.nome_usuario}
        </h1>
        <h2 className="text-zinc-700 text-lg">
          Seu apelido: {usuario_data.apelido_usuario}
        </h2>

        {/* Card de Credibilidade */}
        <div
          className={`flex flex-col items-center justify-center gap-2 w-full p-4 rounded-xl shadow-md transition-all duration-300 ${credibilidadeCor}`}
        >
          <CredibilidadeEmoji className="text-5xl animate-bounce" />
          <span className="font-semibold text-lg">
            Sua credibilidade: {cred}
          </span>
          <p className="text-sm text-center">{credibilidadeMensagem}</p>
          <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-500`}
              style={{
                width: `${cred}%`,
                backgroundColor:
                  cred >= 70 ? "#16a34a" : cred >= 35 ? "#eab308" : "#dc2626",
              }}
            />
          </div>
        </div>

        <div className="p-2 rounded-xl w-full space-y-4 bg-white shadow-md">
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

          <div className="bg-white p-2 rounded-lg h-[400px] overflow-y-auto">
            <div className="flex justify-between px-2 py-4 border-b-2 border-zinc-300">
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
                    key={p.id_pergunta}
                    className="flex gap-2 px-2 py-4 border-b-2 border-zinc-300 hover:bg-gray-100 rounded-md transition-all duration-200"
                  >
                    <LuFiles
                      className={`h-10 w-10 p-2 rounded-full text-white ${cor}`}
                    />
                    <div>
                      <h1 className="font-bold text-black text-xs">
                        {p.componente.nome_componente}
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
                router.push("/login");
              }}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <UpdateUserModal
        openDialog={openDialog === "usuario" ? "usuario" : null}
        setOpenDialog={setOpenDialog}
        user={usuario_data}
      />
      <UpdateUserFotoModal
        openDialog={openDialog === "foto" ? "foto" : null}
        setOpenDialog={setOpenDialog}
        user={usuario_data}
      />
    </div>
  );
}
