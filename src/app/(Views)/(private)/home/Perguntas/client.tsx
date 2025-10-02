"use client";

import { useState, useRef } from "react";
import { CreateRespostaData, Resposta } from "@/types/resposta";
import { useCreateResposta } from "@/hooks/resposta/useCreate";
import { useUser } from "@/context/userContext";

import { useListPerguntas } from "@/hooks/pergunta/useList";
import { useListComponentes } from "@/hooks/componente/useList";
import { useListCursos } from "@/hooks/curso/useList";
import { useListRespostas } from "@/hooks/resposta/useList";
import { useDeletePergunta } from "@/hooks/pergunta/useDelete";
import { useDeleteResposta } from "@/hooks/resposta/useDelete";

import { Pergunta } from "@/types/pergunta";
import { Componente } from "@/types/componente";
import { Curso } from "@/types/curso";
import ModalUpdateQuestion from "../modalUpdateQuestion";
import { UpdatePerguntaData } from "@/types/pergunta";
import { useUpdatePergunta } from "@/hooks/pergunta/useUpdate";

export function PerguntasClientPage({
  initialPerguntas,
  initialComponentes,
  initialCursos,
  initialRespostas,
}: {
  initialPerguntas: Pergunta[];
  initialComponentes: Componente[];
  initialCursos: Curso[];
  initialRespostas: Resposta[];
}) {
  const { userId } = useUser();
  const createResposta = useCreateResposta();
  const respostaInputRef = useRef<HTMLInputElement>(null);

  // Queries com React Query
  const perguntasQuery = useListPerguntas(initialPerguntas);
  const componentesQuery = useListComponentes(initialComponentes);
  const cursosQuery = useListCursos(initialCursos);
  const respostasQuery = useListRespostas(initialRespostas);

  const perguntas = perguntasQuery.data || [];
  const componentes = componentesQuery.data || [];
  const respostas = respostasQuery.data || [];

  // Estados para responder
  const [responderId, setResponderId] = useState<string | null>(null);
  const [resposta, setResposta] = useState("");

  const handleResponder = (fkId_pergunta: string) => {
    setResponderId(fkId_pergunta);
    setResposta("");
    setTimeout(() => respostaInputRef.current?.focus(), 100);
  };

  const { mutate: deletePergunta } = useDeletePergunta();
  const handleDelete = (id: string) => {
    deletePergunta({ id });
  };

  const { mutate: deleteResposta } = useDeleteResposta();
  const handleDeleteResposta = (id: string) => {
    deleteResposta({ id });
  };

  const handleEnviarResposta = ({
    fkId_pergunta,
    fkId_usuario,
    resposta,
  }: CreateRespostaData) => {
    createResposta.mutate(
      { fkId_pergunta, fkId_usuario, resposta },
      {
        onSuccess: () => {
          setResponderId(null);
          setResposta("");
        },
      }
    );
  };

  return (
    <div className="w-full lg:p-4 flex flex-col gap-10">
      {/* PERGUNTAS */}
      {perguntas.length > 0 ? (
        perguntas.map((pergunta) => {
          const respostasPergunta = respostas.filter(
            (r) => r.fkId_pergunta === pergunta.id_pergunta
          );
          const temResposta = respostasPergunta.length > 0;

          return (
            <div
              key={pergunta.id_pergunta}
              className={`p-2 w-full shadow-md rounded-lg flex flex-col gap-2 text-black hover:-translate-y-1 transition-all duration-300
              ${
                temResposta
                  ? "bg-green-100 border-green-400"
                  : "bg-zinc-200 border-transparent"
              } border-2`}
            >
              <div className="w-full flex justify-between items-center">
                <h2 className="font-bold">
                  Aluno: {pergunta.usuario.nome_usuario} (
                  {pergunta.usuario.apelido_usuario})
                </h2>
                <div className="flex flex-col items-end gap-2">
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
              <p className="bg-white p-2 rounded-md shadow-lg text-sm lg:text-base">
                {pergunta.pergunta}
              </p>

              <div className="flex items-center gap-2">
                {userId === pergunta.usuario.id_usuario && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(pergunta.id_pergunta)}
                      className="p-2 rounded-lg bg-red-500 text-white text-xs lg:text-base cursor-pointer"
                    >
                      Excluir pergunta
                    </button>

                    {/* Modal de edição individual */}
                    <ModalUpdateQuestion
                      componentes={componentes}
                      pergunta={pergunta}
                    />
                  </div>
                )}

                {userId !== pergunta.usuario.id_usuario ? (
                  <button
                    className="p-2 rounded-lg bg-purple-600 text-white text-xs lg:text-base hover:bg-purple-900 transition-colors duration-300"
                    onClick={() => handleResponder(pergunta.id_pergunta)}
                  >
                    Responder
                  </button>
                ) : (
                  <span className="text-purple-600 text-sm">
                    Não é possível responder sua própria pergunta
                  </span>
                )}

                <button className="p-2 rounded-lg bg-white text-black text-xs lg:text-base">
                  Notificar respostas
                </button>
              </div>

              {temResposta && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Respostas:</h3>
                  {respostasPergunta.map((r) => (
                    <div
                      key={r.id_resposta}
                      className="border p-2 rounded-md mb-2 flex justify-between items-center"
                    >
                      <span>{r.resposta}</span>

                      {(userId === r.userId ||
                        userId === pergunta.usuario.id_usuario) && (
                        <button
                          className="p-2 bg-white text-black rounded-md hover:bg-red-400 transition-colors duration-300 hover:text-black cursor-pointer"
                          onClick={() => handleDeleteResposta(r.id_resposta)}
                        >
                          Deletar resposta
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

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
                          fkId_usuario: userId!,
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
