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

  const { mutate: deletePergunta } = useDeletePergunta();
  const handleDelete = (id: string) => deletePergunta({ id });

  const { mutate: deleteResposta } = useDeleteResposta();
  const handleDeleteResposta = (id: string) => deleteResposta({ id });

  const handleEnviarResposta = (data: CreateRespostaData) => {
    createResposta.mutate(data, {
      onSuccess: () => {
        setResponderId(null);
        setResposta("");
      },
    });
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
    <div className="w-full lg:p-4 flex flex-col gap-10">
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
            <div
              key={pergunta.id_pergunta}
              ref={(el) =>
                void (perguntasRefs.current[pergunta.id_pergunta] = el)
              }
              className={`p-2 w-full shadow-md rounded-lg flex flex-col gap-2 text-black
                ${
                  isPerguntaHighlighted
                    ? "border-4 border-yellow-400 bg-yellow-100"
                    : temResposta
                    ? "bg-green-100 border-green-400"
                    : "bg-zinc-200 border-transparent"
                }`}
            >
              {/* HEADER PERGUNTA */}
              <div className="w-full flex justify-between items-center">
                <h2 className="font-bold">
                  Aluno: {pergunta.usuario.nome_usuario} (
                  {pergunta.usuario.apelido_usuario})
                </h2>

                <div className="flex flex-col items-end gap-2">
                  {id_usuario !== pergunta.usuario.id_usuario && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer">
                        <BsThreeDotsVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Opções</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            toggleModalDenuncia(pergunta.id_pergunta)
                          }
                          className="cursor-pointer"
                        >
                          Denunciar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  <ModalCreateDenuncia
                    id_conteudo={pergunta.id_pergunta}
                    id_usuario={id_usuario}
                    fkId_usuario_conteudo={pergunta.usuario.id_usuario}
                    tipo_conteudo="Pergunta"
                    isOpen={!!modalDenunciaOpen[pergunta.id_pergunta]}
                    onOpenChange={(open) =>
                      setModalDenunciaOpen((prev) => ({
                        ...prev,
                        [pergunta.id_pergunta]: open,
                      }))
                    }
                  />

                  <h3 className="text-sm text-zinc-900">
                    Realizada em:{" "}
                    {pergunta.dataCriacao_pergunta
                      ? new Date(
                          pergunta.dataCriacao_pergunta
                        ).toLocaleDateString("pt-BR")
                      : "--/--/----"}
                  </h3>

                  {temResposta && (
                    <span className="text-green-700 text-xs font-semibold">
                      Já respondida
                    </span>
                  )}
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
              <p className="bg-white p-2 rounded-md shadow-lg text-sm lg:text-base">
                {pergunta.pergunta}
              </p>

              {/* AÇÕES */}
              <div className="flex items-center gap-2">
                {id_usuario === pergunta.usuario.id_usuario && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(pergunta.id_pergunta)}
                      className="p-2 rounded-lg bg-red-500 text-white text-xs lg:text-base cursor-pointer"
                    >
                      Excluir pergunta
                    </button>

                    <ModalUpdateQuestion
                      componentes={componentes}
                      pergunta={pergunta}
                    />
                  </div>
                )}

                {id_usuario !== pergunta.usuario.id_usuario && !jaRespondida ? (
                  <button
                    className="p-2 rounded-lg bg-purple-600 text-white text-xs lg:text-base hover:bg-purple-900 transition-colors duration-300"
                    onClick={() => handleResponder(pergunta.id_pergunta)}
                  >
                    Responder
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
                            ? "border-4 border-yellow-400 bg-yellow-100"
                            : ""
                        }`}
                      >
                        <div className="flex gap-2">
                          <p className="font-bold">
                            {r.usuario.nome_usuario} (
                            {r.usuario.apelido_usuario}):{" "}
                          </p>
                          <span>{r.resposta}</span>
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
                              className="p-2 bg-white text-black rounded-md hover:bg-red-400 transition-colors duration-300 cursor-pointer"
                              onClick={() =>
                                handleDeleteResposta(r.id_resposta)
                              }
                            >
                              Deletar resposta
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
            </div>
          );
        })
      ) : (
        <div>Sem perguntas até o momento</div>
      )}
    </div>
  );
}
