"use client";

import { useState, useRef, useEffect } from "react";
import { CreateRespostaData, Resposta } from "@/types/resposta";
import { useCreateResposta } from "@/hooks/resposta/useCreate";
import { useSearchParams } from "next/navigation";

import { useListPerguntas } from "@/hooks/pergunta/useList";
import { useListComponentes } from "@/hooks/componente/useList";
import { useListCursos } from "@/hooks/curso/useList";
import { useListRespostas } from "@/hooks/resposta/useList";
import { useDeletePergunta } from "@/hooks/pergunta/useDelete";
import { useDeleteResposta } from "@/hooks/resposta/useDelete";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import {
  BsPerson,
  BsClock,
  BsCheckCircle,
  BsTrash,
  BsPencil,
  BsReply,
} from "react-icons/bs";

import { motion } from "framer-motion";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Pergunta } from "@/types/pergunta";
import { Componente } from "@/types/componente";
import { Curso } from "@/types/curso";
import ModalUpdateQuestion from "./modalUpdateQuestion";
import ModalUpdateResponse from "./modalUpdateResponse";
import ModalCreateDenuncia from "./modalCreateReport";

export function PerguntasClientPage({
  initialPerguntas,
  initialComponentes,
  initialCursos,
  initialRespostas,
  id_usuario,
}: {
  initialPerguntas: Pergunta[];
  initialComponentes: Componente[];
  initialCursos: Curso[];
  initialRespostas: Resposta[];
  id_usuario: string;
}) {
  const searchParams = useSearchParams();
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [highlightType, setHighlightType] = useState<string | null>(null);
  const perguntasRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const respostasRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const id_conteudo = searchParams.get("id_conteudo");
    const tipo_conteudo = searchParams.get("tipo_conteudo");

    if (id_conteudo && tipo_conteudo) {
      setHighlightId(id_conteudo);
      setHighlightType(tipo_conteudo);
    }
  }, [searchParams]);

  const createResposta = useCreateResposta();
  const respostaInputRef = useRef<HTMLInputElement>(null);

  const perguntasQuery = useListPerguntas(initialPerguntas);
  const componentesQuery = useListComponentes(initialComponentes);
  const cursosQuery = useListCursos(initialCursos);
  const respostasQuery = useListRespostas(initialRespostas);

  const perguntas = perguntasQuery.data || [];
  const componentes = componentesQuery.data || [];
  const respostas = respostasQuery.data || [];

  const [responderId, setResponderId] = useState<string | null>(null);
  const [resposta, setResposta] = useState("");

  const [modalDenunciaOpen, setModalDenunciaOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const handleResponder = (fkId_pergunta: string) => {
    setResponderId(fkId_pergunta);
    setResposta("");
    setTimeout(() => respostaInputRef.current?.focus(), 100);
  };

  const deletePerguntaHook = useDeletePergunta();
  const deleteRespostaHook = useDeleteResposta();

  const handleDelete = (id: string) =>
    deletePerguntaHook.mutate(
      { id },
      {
        onSuccess: () => showToast("Pergunta excluída com sucesso 🎉"),
      }
    );

  const handleDeleteResposta = (id: string) =>
    deleteRespostaHook.mutate(
      { id },
      { onSuccess: () => showToast("Resposta excluída ✅") }
    );

  const handleEnviarResposta = (data: CreateRespostaData) => {
    createResposta.mutate(data, {
      onSuccess: () => {
        setResponderId(null);
        setResposta("");
        showToast("Resposta enviada! ✨");
      },
    });
  };

  // ephemeral ludic toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleModalDenuncia = (id: string) => {
    setModalDenunciaOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (highlightId) {
      if (highlightType === "Pergunta" && perguntasRefs.current[highlightId]) {
        perguntasRefs.current[highlightId]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (
        highlightType === "Resposta" &&
        respostasRefs.current[highlightId]
      ) {
        respostasRefs.current[highlightId]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [highlightId, highlightType, perguntas, respostas]);

  return (
    <div
      className={`${inter.className} w-full lg:p-4 grid grid-cols-1 md:grid-cols-2 gap-6`}
    >
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="fixed top-6 right-6 z-50 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {toastMessage}
        </motion.div>
      )}
      {perguntas.length > 0 ? (
        perguntas.map((pergunta) => {
          const respostasPergunta = respostas.filter(
            (r) => r.fkId_pergunta === pergunta.id_pergunta
          );
          const minhaResposta = respostasPergunta.find(
            (r) => r.usuario.id_usuario === id_usuario
          );
          const jaRespondida = !!minhaResposta;
          const temResposta = respostasPergunta.length > 0;
          const isPerguntaHighlighted =
            highlightType === "Pergunta" &&
            highlightId === pergunta.id_pergunta;

          return (
            <motion.div
              key={pergunta.id_pergunta}
              ref={(el) =>
                void (perguntasRefs.current[pergunta.id_pergunta] = el)
              }
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ translateY: -4 }}
              transition={{ duration: 0.25 }}
              className={`p-4 group relative overflow-hidden shadow-md rounded-lg flex flex-col gap-3 text-black bg-white border hover:border-purple-500 transition-colors
              ${
                isPerguntaHighlighted
                  ? "border-4 border-yellow-400 bg-yellow-50"
                  : temResposta
                  ? "border-green-200"
                  : "border-zinc-200"
              }`}
            >
              {/* Snake-like rotating border (subtle purple segments, thinner & slower) */}
              <div className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                {/* rotating dashed gradient (slower) */}
                <div
                  className="absolute inset-0 rounded-lg animate-[spin_10s_linear_infinite] opacity-90"
                  style={{
                    background:
                      "repeating-conic-gradient(from 0deg, rgba(124,58,237,0.95) 0deg 12deg, rgba(167,139,250,0.55) 12deg 18deg, transparent 18deg 30deg)",
                    boxShadow: "0 8px 30px rgba(124,58,237,0.12)",
                    mixBlendMode: "normal",
                  }}
                />

                {/* inner mask to leave only a thin border — use a small inset so ring is thin */}
                <div
                  className={`absolute rounded-lg pointer-events-none ${
                    isPerguntaHighlighted ? "bg-yellow-50" : "bg-white"
                  }`}
                  style={{ inset: "4px" }}
                />
              </div>
              {/* HEADER PERGUNTA */}
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {/* avatar circle with initial (fallback when no image) */}
                  <div>
                    {pergunta.usuario?.foto_perfil ? (
                      <Image
                        src={pergunta.usuario.foto_perfil}
                        width={36}
                        height={36}
                        alt={pergunta.usuario.nome_usuario || "avatar"}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-semibold">
                        {pergunta.usuario?.nome_usuario
                          ? pergunta.usuario.nome_usuario
                              .charAt(0)
                              .toUpperCase()
                          : "U"}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs text-zinc-500">Perguntado por:</div>
                    <h2 className="font-semibold text-sm text-gray-900">
                      {pergunta.usuario.nome_usuario}{" "}
                      <span className="text-zinc-500">
                        ({pergunta.usuario.apelido_usuario})
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 hidden sm:inline-flex">
                      {pergunta.dataCriacao_pergunta
                        ? new Date(
                            pergunta.dataCriacao_pergunta
                          ).toLocaleDateString("pt-BR")
                        : "--/--/----"}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-purple-600 font-medium">
                      {pergunta.componente.nome_componente}
                    </span>
                  </div>

                  {/* three-dot menu: Delete / Edit / Respond */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`cursor-pointer p-2 rounded-full hover:bg-purple-50 transition-colors`}
                    >
                      <BsThreeDotsVertical className="w-5 h-5 text-zinc-600" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Opções</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {/* Delete: only enabled for owner */}
                      <DropdownMenuItem
                        onClick={() => {
                          if (id_usuario === pergunta.usuario.id_usuario)
                            handleDelete(pergunta.id_pergunta);
                        }}
                        className={
                          id_usuario === pergunta.usuario.id_usuario
                            ? "cursor-pointer text-red-600"
                            : "opacity-50 cursor-not-allowed text-zinc-400"
                        }
                      >
                        Excluir
                      </DropdownMenuItem>

                      {/* Edit: only enabled for owner -> trigger existing modal trigger button if present */}
                      <DropdownMenuItem
                        onClick={() => {
                          // if owner, find and click the Edit button inside this question card (if present)
                          if (id_usuario === pergunta.usuario.id_usuario) {
                            const btn = document.querySelector(
                              `#edit-btn-${pergunta.id_pergunta}`
                            ) as HTMLButtonElement | null;
                            if (btn) btn.click();
                          }
                        }}
                        className={
                          id_usuario === pergunta.usuario.id_usuario
                            ? "cursor-pointer"
                            : "opacity-50 cursor-not-allowed text-zinc-400"
                        }
                      >
                        Editar
                      </DropdownMenuItem>

                      {/* Respond: enabled only for non-owner */}
                      <DropdownMenuItem
                        onClick={() => {
                          if (id_usuario !== pergunta.usuario.id_usuario)
                            handleResponder(pergunta.id_pergunta);
                        }}
                        className={
                          id_usuario !== pergunta.usuario.id_usuario
                            ? "cursor-pointer"
                            : "opacity-50 cursor-not-allowed text-zinc-400"
                        }
                      >
                        Responder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* CURSO E COMPONENTE */}
              <p>
                Curso:{" "}
                <span className="text-purple-600 font-bold">
                  {pergunta.curso.nome_curso}
                </span>
              </p>
              <p>
                Componente:{" "}
                <span className="text-purple-600 font-bold">
                  {pergunta.componente.nome_componente}
                </span>
              </p>

              {/* PERGUNTA */}
              <p className="p-3 rounded-md shadow-sm text-sm lg:text-base bg-zinc-50">
                {pergunta.pergunta}
              </p>

              {/* AÇÕES */}
              <div className="flex items-center gap-2">
                {id_usuario === pergunta.usuario.id_usuario && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(pergunta.id_pergunta)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500 text-white text-sm cursor-pointer hover:bg-red-600 transition-colors"
                    >
                      <BsTrash className="w-4 h-4" />{" "}
                      <span className="text-sm">Excluir</span>
                    </button>

                    <ModalUpdateQuestion
                      componentes={componentes}
                      pergunta={pergunta}
                      triggerId={`edit-btn-${pergunta.id_pergunta}`}
                    />
                  </div>
                )}

                {id_usuario !== pergunta.usuario.id_usuario && !jaRespondida ? (
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors duration-300"
                    onClick={() => handleResponder(pergunta.id_pergunta)}
                  >
                    <BsReply className="w-4 h-4" />{" "}
                    <span className="text-sm">Responder</span>
                  </button>
                ) : id_usuario !== pergunta.usuario.id_usuario &&
                  jaRespondida ? (
                  <p>Só é possível uma única resposta</p>
                ) : (
                  <span className="text-purple-600 text-sm">
                    Não é possível responder sua própria pergunta
                  </span>
                )}
              </div>

              {/* RESPOSTAS */}
              {temResposta && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Respostas:</h3>
                  {respostasPergunta.map((r) => {
                    const isRespostaHighlighted =
                      highlightType === "Resposta" &&
                      highlightId === r.id_resposta;

                    return (
                      <div
                        key={r.id_resposta}
                        ref={(el) =>
                          void (respostasRefs.current[r.id_resposta] = el)
                        }
                        className={`border p-2 rounded-md mb-2 flex items-center justify-between ${
                          isRespostaHighlighted
                            ? "border-4 border-yellow-400 bg-yellow-50"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex gap-3 items-start">
                          <BsPerson className="w-5 h-5 text-purple-600 mt-1" />
                          <div>
                            <p className="font-bold text-sm">
                              {r.usuario.nome_usuario} (
                              {r.usuario.apelido_usuario})
                            </p>
                            <p className="text-sm">{r.resposta}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 items-center">
                          {/* Denunciar apenas se não for dono da resposta */}
                          {id_usuario !== r.usuario.id_usuario && (
                            <>
                              <button
                                onClick={() =>
                                  toggleModalDenuncia(r.id_resposta)
                                }
                                className="p-1 text-xs text-red-600 hover:underline"
                              >
                                Denunciar
                              </button>

                              <ModalCreateDenuncia
                                id_conteudo={r.id_resposta}
                                id_usuario={id_usuario}
                                fkId_usuario_conteudo={r.usuario.id_usuario}
                                tipo_conteudo="Resposta"
                                isOpen={!!modalDenunciaOpen[r.id_resposta]}
                                onOpenChange={(open) =>
                                  setModalDenunciaOpen((prev) => ({
                                    ...prev,
                                    [r.id_resposta]: open,
                                  }))
                                }
                              />
                            </>
                          )}

                          {/* Deletar resposta se for dono da resposta ou dono da pergunta */}
                          {(id_usuario === r.usuario.id_usuario ||
                            id_usuario === pergunta.usuario.id_usuario) && (
                            <button
                              className="flex items-center gap-2 p-2 bg-white text-black rounded-md hover:bg-red-400 transition-colors duration-300 cursor-pointer"
                              onClick={() =>
                                handleDeleteResposta(r.id_resposta)
                              }
                            >
                              <BsTrash />{" "}
                              <span className="text-sm">Deletar</span>
                            </button>
                          )}

                          {/* Editar apenas se for dono da resposta */}
                          {id_usuario === r.usuario.id_usuario && (
                            <ModalUpdateResponse resposta={r} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* INPUT PARA RESPONDER */}
              {responderId === pergunta.id_pergunta && (
                <div className="mt-2 flex flex-col gap-2">
                  <input
                    ref={respostaInputRef}
                    type="text"
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                    placeholder="Digite sua resposta..."
                    className="p-2 rounded-md border border-zinc-300"
                    disabled={createResposta.isPending}
                  />
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-lg bg-purple-600 text-white text-xs lg:text-base hover:bg-purple-900 transition-colors duration-300"
                      onClick={() =>
                        handleEnviarResposta({
                          fkId_pergunta: pergunta.id_pergunta,
                          fkId_usuario: id_usuario!,
                          resposta,
                        })
                      }
                      disabled={createResposta.isPending}
                    >
                      {createResposta.isPending
                        ? "Enviando..."
                        : "Enviar resposta"}
                    </button>
                    <button
                      className="p-2 rounded-lg bg-zinc-400 text-white text-xs lg:text-base"
                      onClick={() => setResponderId(null)}
                      disabled={createResposta.isPending}
                    >
                      Cancelar
                    </button>
                  </div>
                  {createResposta.isError && (
                    <span className="text-red-600 text-xs">
                      Erro ao enviar resposta.{" "}
                      {createResposta.error?.message || ""}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })
      ) : (
        <div>Sem perguntas até o momento</div>
      )}
    </div>
  );
}
