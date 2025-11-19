"use client";

import { UserIcon, PencilIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { UpdateUserModal } from "./updateUserModal";
import { UpdateUserFotoModal } from "./fotoPerfilUser/index";
import { useEffect, useState } from "react";
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
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { ActionButton } from "@/components/ui/actionButton";
import {
  Dialog as ConfirmDialog,
  DialogContent as ConfirmContent,
  DialogHeader as ConfirmHeader,
  DialogTitle as ConfirmTitle,
} from "@/components/ui/dialog";

export default function UsuarioClientPage({
  usuario: initialUser,
  perguntas,
}: {
  usuario: User;
  perguntas: Pergunta[];
}) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState<null | "usuario" | "foto">(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const userId = initialUser?.id_usuario;

  const { data: usuario_data, isError } = useGetUser(userId, initialUser);

  // If initialUser is not present, clear token and redirect to login
  useEffect(() => {
    if (!initialUser) {
      try {
        deleteToken();
      } catch (e) {
        // ignore
      }
      router.push("/Auth/Login");
    }
  }, [initialUser, router]);

  // If fetching user fails (invalid token / user missing), redirect to login
  useEffect(() => {
    if (isError) {
      try {
        deleteToken();
      } catch (e) {}
      router.push("/Auth/Login");
    }
  }, [isError, router]);

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

  // Corrige sobreposição do header (Android): mede altura do header fixo
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div
      className="min-h-screen w-full flex justify-center bg-white px-4 md:px-6"
      style={{ paddingTop: headerHeight ? headerHeight + 2 : undefined }}
    >
      <div className="w-full max-w-3xl flex flex-col justify-start items-stretch py-7 md:py-7 space-y-8 relative">
        {/* TÍTULO */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent"
        >
          Meu perfil
        </motion.h1>
        {/* FOTO + NOME */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-3"
        >
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
            <span className="absolute bottom-0 right-0 p-2 rounded-full text-neutral-700 border border-neutral-300 bg-white shadow-sm cursor-pointer">
              <GoPencil />
            </span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-semibold text-2xl md:text-3xl text-neutral-800">
              {usuario_data.nome_usuario}
            </h2>
            <p className="text-neutral-600 text-md">
              Mais conhecido como:{" "}
              <span className="font-bold">{usuario_data.apelido_usuario}</span>
            </p>
            {/* Botão pill colocado ABAIXO das infos (acima de credibilidade) */}
          </div>
          <p className="text-neutral-600 text-md">
            Desde{" "}
            {usuario_data.dataCriacao_usuario
              ? new Date(usuario_data.dataCriacao_usuario).toLocaleDateString(
                  "pt-BR"
                )
              : "-"}
          </p>
          <button
            onClick={() => setOpenDialog("usuario")}
            className="inline-flex items-center gap-2 rounded-full border border-purple-400/60 text-purple-700 px-6 py-2 bg-white hover:bg-purple-50 shadow-sm transition cursor-pointer"
            title="Editar dados"
            aria-label="Editar dados"
          >
            <GoPencil className="text-purple-700" />
            <span className="text-sm font-medium">Editar dados</span>
          </button>
        </motion.div>

        {/* CREDIBILIDADE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col items-center justify-center gap-2 w-full p-4 rounded-xl border border-zinc-200 bg-white shadow-sm`}
        >
          <CredibilidadeEmoji className="text-4xl" />
          <span className="font-medium text-base">Credibilidade: {cred}</span>
          <p className="text-sm text-center">{credibilidadeMensagem}</p>
          <div className="w-full bg-zinc-200 h-2 rounded-full mt-1">
            <div
              className="h-2 rounded-full bg-purple-600 transition-all duration-500"
              style={{ width: `${cred}%` }}
            />
          </div>
        </motion.div>

        {/* PENALIDADES */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-3"
        >
          <h3 className="font-semibold text-zinc-800 text-base">Penalidades</h3>
          {usuario_data.Penalidades && usuario_data.Penalidades.length > 0 ? (
            usuario_data.Penalidades.map((penalidade) => (
              <div
                key={penalidade.id_penalidade}
                className="p-3 rounded-lg border border-zinc-200"
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
                  className="mt-2 text-sm text-purple-600 hover:underline cursor-pointer"
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
        </motion.div>

        {/* BOTÃO SAIR */}
        <div className="pt-4 border-t border-zinc-200 w-full">
          <button
            onClick={() => setLogoutOpen(true)}
            className="w-full inline-flex items-center cursor-pointer justify-center gap-2 py-2 rounded-md border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400 transition"
          >
            <LogOut className="h-4 w-4" />
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

      {/* CONFIRM SAIR */}
      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={(v) => {
          setLogoutOpen(v);
          if (!v) setLeaving(false);
        }}
      >
        <ConfirmContent className="bg-white">
          <ConfirmHeader>
            <ConfirmTitle className="text-zinc-900">Sair da conta</ConfirmTitle>
          </ConfirmHeader>
          <div className="text-sm text-zinc-600">
            Tem certeza que deseja sair da sua conta?
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-md border cursor-pointer border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              onClick={() => setLogoutOpen(false)}
              type="button"
            >
              Cancelar
            </button>
            <ActionButton
              type="button"
              textIdle="Sair"
              isLoading={leaving}
              onClick={() => {
                if (leaving) return;
                setLeaving(true);
                setTimeout(() => {
                  deleteToken("token");
                  router.push("/Auth/Login");
                }, 450);
              }}
              className="bg-red-600 cursor-pointer hover:bg-red-700"
              enableRipplePulse
            />
          </div>
        </ConfirmContent>
      </ConfirmDialog>
    </div>
  );
}
