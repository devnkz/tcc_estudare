"use client";

import { UserIcon, PencilIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { UpdateUserModal } from "./updateUserModal";
import { UpdateUserFotoModal } from "./fotoPerfilUser/index";
import { useState } from "react";
import { deleteToken } from "@/lib/deleteToken";
import { GoPencil } from "react-icons/go";
import { useGetUser } from "@/hooks/user/useListId";
import {
  BsEmojiExpressionless,
  BsEmojiGrin,
  BsEmojiAngry,
} from "react-icons/bs";
import { Pergunta } from "@/types/pergunta";
import { User } from "@/types/user";

export default function UsuarioClientPage({
  usuario: initialUser,
  perguntas,
}: {
  usuario: User;
  perguntas: Pergunta[];
}) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState<null | "usuario" | "foto">(null);
  const { data: usuario_data } = useGetUser(
    initialUser.id_usuario,
    initialUser
  );
  if (!usuario_data) return null;

  const cred = usuario_data.credibilidade_usuario;

  let CredibilidadeEmoji;
  let credibilidadeMensagem;

  if (cred < 35) {
    CredibilidadeEmoji = BsEmojiAngry;
    credibilidadeMensagem =
      "Você precisa ser mais sério com suas responsabilidades!";
  } else if (cred < 70) {
    CredibilidadeEmoji = BsEmojiExpressionless;
    credibilidadeMensagem = "Cuidado! Tome mais atenção às suas ações.";
  } else {
    CredibilidadeEmoji = BsEmojiGrin;
    credibilidadeMensagem = "Parabéns! Continue com essa credibilidade alta.";
  }

  // Redireciona para tela de perguntas com query param do post
  const handleVisualizarConteudo = (
    id_conteudo: string,
    tipo_conteudo: string
  ) => {
    router.push(
      `/home?tipo_conteudo=${tipo_conteudo}&id_conteudo=${id_conteudo}`
    );
  };

  return (
    <div className="w-full flex justify-center bg-neutral-50 p-4">
      <div className="w-[600px] flex flex-col justify-center items-center py-14 space-y-8 relative">
        {/* FOTO + NOME */}
        <div className="flex flex-col items-center space-y-3">
          <div
            className="relative cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setOpenDialog("foto")}
          >
            {usuario_data.foto_perfil ? (
              <img
                src={usuario_data.foto_perfil}
                alt="Foto do usuário"
                className="h-36 w-36 rounded-full object-cover border border-neutral-300"
              />
            ) : (
              <UserIcon className="h-36 w-36 p-8 bg-neutral-200 rounded-full" />
            )}
            <span className="absolute bottom-0 right-0 p-2 rounded-full text-neutral-700 border border-neutral-300 bg-white shadow-sm">
              <GoPencil />
            </span>
          </div>
          <h1 className="font-semibold text-2xl text-neutral-800">
            {usuario_data.nome_usuario}
          </h1>
          <p className="text-neutral-600 text-sm">
            Estudante desde{" "}
            {usuario_data.dataCriacao_usuario
              ? new Date(usuario_data.dataCriacao_usuario).toLocaleDateString(
                  "pt-BR"
                )
              : "-"}
          </p>
          <p className="text-neutral-600 text-sm">
            Apelido:{" "}
            <span className="font-medium">{usuario_data.apelido_usuario}</span>
          </p>
        </div>

        {/* CREDIBILIDADE */}
        <div
          className={`flex flex-col items-center justify-center gap-2 w-full p-4 rounded-lg border border-neutral-200`}
        >
          <CredibilidadeEmoji className="text-4xl" />
          <span className="font-medium text-base">Credibilidade: {cred}</span>
          <p className="text-sm text-center">{credibilidadeMensagem}</p>
          <div className="w-full bg-neutral-200 h-2 rounded-full mt-1">
            <div
              className="h-2 rounded-full bg-neutral-600 transition-all duration-500"
              style={{ width: `${cred}%` }}
            />
          </div>
        </div>

        {/* PENALIDADES */}
        <div className="w-full rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
          <h3 className="font-semibold text-neutral-800 text-base">
            Penalidades
          </h3>
          {usuario_data.Penalidades && usuario_data.Penalidades.length > 0 ? (
            usuario_data.Penalidades.map((penalidade) => (
              <div
                key={penalidade.id_penalidade}
                className="p-3 rounded-lg border border-neutral-200"
              >
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">Descrição:</span>{" "}
                  {penalidade.descricao}
                </p>
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">Ativa:</span>{" "}
                  {penalidade.ativa ? "Sim" : "Não"}
                </p>
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">Início:</span>{" "}
                  {new Date(
                    penalidade.dataInicio_penalidade
                  ).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">Fim:</span>{" "}
                  {new Date(penalidade.dataFim_penalidade).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">Perda de Credibilidade:</span>{" "}
                  {penalidade.perder_credibilidade}
                </p>

                <button
                  className="mt-2 text-sm text-purple-600 hover:underline"
                  onClick={() =>
                    handleVisualizarConteudo(
                      penalidade.denuncia.fkId_conteudo_denunciado,
                      penalidade.denuncia.tipo_conteudo
                    )
                  }
                >
                  Visualizar conteúdo
                </button>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-sm italic">
              Nenhuma penalidade registrada.
            </p>
          )}
        </div>

        {/* BOTÃO SAIR */}
        <div className="pt-4 border-t border-neutral-200 w-full">
          <button
            onClick={() => {
              deleteToken("token");
              router.push("/login");
            }}
            className="w-full py-2 border border-neutral-400 rounded-md text-neutral-700 hover:bg-neutral-100 transition"
          >
            Sair
          </button>
        </div>
      </div>

      {/* MODAIS */}
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
