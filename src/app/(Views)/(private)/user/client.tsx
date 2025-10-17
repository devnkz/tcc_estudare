"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserIcon,
  PencilSquareIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { LuFiles } from "react-icons/lu";
import { GoPencil } from "react-icons/go";
import {
  BsEmojiExpressionless,
  BsEmojiGrin,
  BsEmojiAngry,
} from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useGetUser } from "@/hooks/user/useListId";
import { deleteToken } from "@/lib/deleteToken";
import { UpdateUserModal } from "./updateUserModal";
import { UpdateUserFotoModal } from "./fotoPerfilUser";
import { Pergunta } from "@/types/pergunta";
import { User } from "@/types/user";
import Footer from "@/components/layout/footer";

export default function UsuarioClientPage({
  usuario: initialUser,
  perguntas,
}: {
  usuario: User;
  perguntas: Pergunta[];
}) {
  const router = useRouter();
  const cores = ["bg-violet-600", "bg-blue-600", "bg-green-600", "bg-pink-600"];

  const [openDialog, setOpenDialog] = useState<null | "usuario" | "foto">(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const { data: usuario_data } = useGetUser(
    initialUser.id_usuario,
    initialUser
  );
  if (!usuario_data) return null;

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

  // ----------------- Credibilidade -----------------
  const cred = usuario_data.credibilidade_usuario;
  let CredibilidadeEmoji = BsEmojiGrin;
  let credibilidadeMensagem = "";
  let credibilidadeCor = "";

  if (cred < 35) {
    CredibilidadeEmoji = BsEmojiAngry;
    credibilidadeMensagem = "Você precisa ser mais responsável!";
    credibilidadeCor = "bg-red-100 text-red-600";
  } else if (cred < 70) {
    CredibilidadeEmoji = BsEmojiExpressionless;
    credibilidadeMensagem = "Atenção! Cuide mais de suas ações.";
    credibilidadeCor = "bg-yellow-100 text-yellow-600";
  } else {
    CredibilidadeEmoji = BsEmojiGrin;
    credibilidadeMensagem = "Excelente! Continue com essa credibilidade.";
    credibilidadeCor = "bg-green-100 text-green-600";
  }

  return (
    <div className="w-full min-h-screen">
      <div
        className="w-full flex justify-center  min-h-screen p-4 font-[Inter]"
        style={{ paddingTop: headerHeight + 10 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[600px] flex flex-col items-center py-12 space-y-4"
        >
          {/* FOTO PERFIL */}
          <motion.div
            className="relative cursor-pointer group"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            onClick={() => setOpenDialog("foto")}
          >
            {usuario_data.foto_perfil ? (
              <img
                src={usuario_data.foto_perfil}
                alt="Foto do usuário"
                className="h-40 w-40 rounded-full object-cover border-4 border-violet-500 shadow-xl"
              />
            ) : (
              <div className="h-40 w-40 bg-zinc-300 rounded-full flex items-center justify-center border-4 border-violet-300 shadow-xl">
                <UserIcon className="h-20 w-20 text-zinc-500" />
              </div>
            )}

            <motion.span
              className="absolute bottom-0 right-0 bg-violet-600 p-2 rounded-full text-white text-xl shadow-md"
              whileHover={{ rotate: 15 }}
            >
              <GoPencil />
            </motion.span>
          </motion.div>

          <h1 className="font-bold text-3xl text-gray-800">
            {usuario_data.nome_usuario}
          </h1>
          <h2 className="text-zinc-600 text-base">
            Apelido:{" "}
            <span className="font-medium">{usuario_data.apelido_usuario}</span>
          </h2>
          <p className="text-sm text-zinc-500">
            Estudante desde{" "}
            {usuario_data.dataCriacao_usuario
              ? new Date(usuario_data.dataCriacao_usuario).toLocaleDateString(
                  "pt-BR"
                )
              : "-"}
          </p>

          {/* CARD CREDIBILIDADE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex flex-col items-center justify-center gap-2 w-full p-5 rounded-xl shadow-md ${credibilidadeCor}`}
          >
            <CredibilidadeEmoji className="text-5xl animate-bounce" />
            <span className="font-semibold text-lg">
              Sua credibilidade: {cred}
            </span>
            <p className="text-sm text-center text-gray-700 max-w-[400px]">
              {credibilidadeMensagem}
            </p>
            <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
              <motion.div
                className="h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${cred}%` }}
                transition={{ duration: 1 }}
                style={{
                  backgroundColor:
                    cred >= 70 ? "#16a34a" : cred >= 35 ? "#eab308" : "#dc2626",
                }}
              />
            </div>
          </motion.div>

          {/* CARD DE INFORMAÇÕES */}
          <div className="p-4 rounded-xl w-full bg-white shadow-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-800 text-lg">Informações</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="rounded-full bg-zinc-200 p-2 relative group hover:bg-violet-600 transition-all duration-300"
                onClick={() => setOpenDialog("usuario")}
              >
                <PencilSquareIcon className="h-6 w-6 text-zinc-700 group-hover:text-white" />
                <span className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-12 bg-zinc-700 text-white p-2 text-xs rounded-lg whitespace-nowrap">
                  Editar seu perfil
                </span>
              </motion.button>
            </div>

            <div className="bg-white p-2 rounded-lg h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300">
              <div className="flex justify-between px-2 py-4 border-b border-zinc-200">
                <div>
                  <h2 className="text-zinc-500 text-xs uppercase tracking-wide">
                    Perguntas Feitas
                  </h2>
                  <h1 className="font-bold text-xl text-gray-800">
                    {perguntas.length}
                  </h1>
                </div>
              </div>

              {perguntas.length > 0 ? (
                perguntas.map((p, index) => {
                  const cor = cores[index % cores.length];
                  return (
                    <motion.div
                      key={p.id_pergunta}
                      whileHover={{ scale: 1.02 }}
                      className="flex gap-2 px-2 py-4 border-b border-zinc-100 rounded-md transition-all duration-200"
                    >
                      <LuFiles
                        className={`h-10 w-10 p-2 rounded-full text-white ${cor}`}
                      />
                      <div>
                        <h1 className="font-bold text-gray-700 text-sm">
                          {p.componente.nome_componente}
                        </h1>
                        <p
                          className="max-w-[250px] truncate text-zinc-600 text-base"
                          title={p.pergunta}
                        >
                          {p.pergunta}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-zinc-500 text-center mt-4">
                  Você ainda não fez nenhuma pergunta.
                </p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                deleteToken("token");
                router.push("/login");
              }}
              className="w-full flex items-center justify-center gap-2 mt-4 bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-400"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Sair
            </motion.button>
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
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
