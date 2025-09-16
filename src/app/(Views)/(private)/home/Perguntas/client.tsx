"use client";

import { useState, useRef, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { ChevronsUpDown, Check } from "lucide-react";
import { CreateRespostaData } from "@/types/resposta";
import { useCreateResposta } from "@/hooks/resposta/useCreate";
import { useUser } from "@/context/userContext";

import { useListPerguntas } from "@/hooks/pergunta/useList";
import { useListComponentes } from "@/hooks/componente/useList";
import { useListCursos } from "@/hooks/curso/useList";
import { useListRespostas } from "@/hooks/resposta/useList";
import { useDeletePergunta } from "@/hooks/pergunta/useDelete";
import { useDeleteResposta } from "@/hooks/resposta/useDelete";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { MultiSelectCombobox } from "@/components/ui/comboxFilter";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function getTypeFromData(items: any[]): "componente" | "curso" {
  if (!items || items.length === 0) return "componente";
  if ("nome" in items[0]) return "componente";
  if ("nome" in items[0]) return "curso";
  return "componente";
}

function normalizeItems(data: any[], type: "componente" | "curso") {
  if (type === "componente")
    return data.map((item) => ({
      id: String(item.id),
      label: item.nome,
    }));
  if (type === "curso")
    return data.map((item) => ({ id: String(item.id), label: item.nome }));
  return [];
}

function ComboboxFilter({
  items,
  value,
  setValue,
  placeholder,
}: {
  items: { id: string; label: string }[];
  value: string;
  setValue: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-[200px] bg-zinc-100 rounded-md p-2 flex justify-between items-center
            hover:border-purple-600 hover:bg-zinc-200 hover:-translate-y-0.5 transition-all duration-300 border border-transparent cursor-pointer"
        >
          {value ? items.find((item) => item.id === value)?.label : placeholder}
          <ChevronsUpDown className="opacity-50 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={`Buscar ${placeholder.toLowerCase()}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>Nenhum encontrado.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function PerguntasClientPage({
  initialPerguntas,
  initialComponentes,
  initialCursos,
  initialRespostas,
}: {
  initialPerguntas: any[];
  initialComponentes: any[];
  initialCursos: any[];
  initialRespostas: any[];
}) {
  const { userId } = useUser();
  const createResposta = useCreateResposta();
  const respostaInputRef = useRef<HTMLInputElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string>("");

  // Queries com React Query
  const perguntasQuery = useListPerguntas(initialPerguntas);
  const componentesQuery = useListComponentes(initialComponentes);
  const cursosQuery = useListCursos(initialCursos);
  const respostasQuery = useListRespostas(initialRespostas);

  const perguntas = perguntasQuery.data || [];
  const componentes = componentesQuery.data || [];
  const cursos = cursosQuery.data || [];
  const respostas = respostasQuery.data || [];

  // Estados de filtros
  const [search, setSearch] = useState("");
  const [componente, setComponente] = useState("");
  const [curso, setCurso] = useState("");
  const [grupo, setGrupo] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todas");
  const [verMinhasPerguntas, setVerMinhasPerguntas] = useState(false);

  // Estados para responder
  const [responderId, setResponderId] = useState<string | null>(null);
  const [conteudo, setConteudo] = useState("");

  const handleResponder = (perguntaId: string) => {
    setResponderId(perguntaId);
    setConteudo("");
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
    perguntaId,
    userId,
    conteudo,
  }: CreateRespostaData) => {
    createResposta.mutate(
      { perguntaId, userId, conteudo },
      {
        onSuccess: () => {
          setResponderId(null);
          setConteudo("");
        },
      }
    );
  };

  const filtros = ["Todas", "Respondidas", "Não Respondidas"];

  const perguntasFiltradas = useMemo(() => {
    return perguntas.filter((pergunta) => {
      if (!verMinhasPerguntas && pergunta.usuario.id === userId) return false;

      const respostasPergunta = respostas.filter(
        (r) => r.perguntaId === pergunta.id
      );
      const temResposta = respostasPergunta.length > 0;

      if (filtroStatus === "Respondidas" && !temResposta) return false;
      if (filtroStatus === "Não Respondidas" && temResposta) return false;

      if (componente && pergunta.idComponente !== Number(componente))
        return false;
      if (curso && pergunta.idCurso !== Number(curso)) return false;

      if (grupo) {
        const dataPergunta = new Date(pergunta.criadaEm)
          .toISOString()
          .split("T")[0];
        if (dataPergunta !== grupo) return false;
      }

      if (search) {
        const termo = search.toLowerCase();
        if (
          !pergunta.pergunta.toLowerCase().includes(termo) &&
          !pergunta.materia.toLowerCase().includes(termo)
        )
          return false;
      }

      return true;
    });
  }, [
    perguntas,
    respostas,
    search,
    componente,
    curso,
    grupo,
    filtroStatus,
    verMinhasPerguntas,
    userId,
  ]);

  return (
    <div className="w-full lg:p-4 flex flex-col gap-10">
      {/* FILTROS */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
          <ComboboxFilter
            items={filtros.map((f) => ({ id: f, label: f }))}
            value={filtroStatus}
            setValue={setFiltroStatus}
            placeholder="Status"
          />
          <div className="w-[200px]">
            <input
              type="date"
              className="w-full p-2 rounded-md bg-zinc-100 border border-transparent hover:border-purple-600 hover:bg-zinc-200 transition-all duration-300"
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
            />
          </div>
          <label className="flex items-center bg-purple-600 text-white p-2 rounded-sm gap-2 cursor-pointer select-none hover:bg-purple-900 transition-colors duration-300">
            <input
              type="checkbox"
              className="w-4 h-4 accent-purple-600"
              checked={verMinhasPerguntas}
              onChange={(e) => setVerMinhasPerguntas(e.target.checked)}
            />
            Ver minhas perguntas
          </label>
        </div>

        {/* BUSCA */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 p-2 rounded-lg border border-transparent bg-zinc-100 text-black hover:border-purple-600 hover:bg-zinc-200 hover:-translate-y-0.5 transition-all duration-300">
            <MagnifyingGlassIcon className="h-5 w-5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Procure por perguntas, matérias, componentes..."
              className="outline-none w-full bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* PERGUNTAS */}
      {perguntasFiltradas.length > 0 ? (
        perguntasFiltradas.map((pergunta) => {
          const respostasPergunta = respostas.filter(
            (r) => r.perguntaId === pergunta.id
          );
          const temResposta = respostasPergunta.length > 0;

          return (
            <div
              key={pergunta.id}
              className={`p-2 w-full shadow-md rounded-lg flex flex-col gap-2 text-black hover:-translate-y-1 transition-all duration-300
              ${
                temResposta
                  ? "bg-green-100 border-green-400"
                  : "bg-zinc-200 border-transparent"
              } border-2`}
            >
              <div className="w-full flex justify-between items-center">
                <h2 className="font-bold">
                  Aluno: {pergunta.usuario.name} ({pergunta.usuario.apelido})
                </h2>
                <div className="flex flex-col items-end gap-2">
                  <h3 className="text-sm text-zinc-900">
                    Realizada em:{" "}
                    {new Date(pergunta.criadaEm).toLocaleDateString("pt-BR")}
                  </h3>
                  {temResposta && (
                    <span className="text-green-700 text-xs font-semibold">
                      Já respondida
                    </span>
                  )}
                </div>
              </div>

              <p>
                Componente:{" "}
                <span className="text-purple-600 font-bold">
                  {pergunta.materia}
                </span>
              </p>
              <p className="bg-white p-2 rounded-md shadow-lg text-sm lg:text-base">
                {pergunta.pergunta}
              </p>

              <div className="flex items-center gap-2">
                {userId === pergunta.usuario.id && (
                  <div>
                    <button
                      onClick={() => handleDelete(pergunta.id)}
                      className="p-2 rounded-lg bg-red-500 text-white text-xs lg:text-base cursor-pointer"
                    >
                      Excluir pergunta
                    </button>

                    <Dialog open={openModal} onOpenChange={setOpenModal}>
                      <DialogTrigger asChild>
                        <button className="w-[200px] bg-purple-600 p-3 rounded-lg text-white cursor-pointer hover:-translate-y-1 transition-all duration-300">
                          Editar sua pergunta
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edite sua pergunta</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                          <Input
                            label="Sua pergunta"
                            placeholder={pergunta.pergunta}
                            value={conteudo}
                            onChange={(e) => setConteudo(e.target.value)}
                          />

                          <MultiSelectCombobox
                            items={componentes}
                            selectedIds={
                              selectedComponentId ? [selectedComponentId] : []
                            }
                            setSelectedIds={(ids) =>
                              setSelectedComponentId(ids[0] || "")
                            }
                            placeholder="Altere o componente caso queira"
                            getLabel={(c) => c.nome}
                          />
                        </div>

                        <DialogFooter></DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {userId !== pergunta.usuario.id ? (
                  <button
                    className="p-2 rounded-lg bg-purple-600 text-white text-xs lg:text-base hover:bg-purple-900 transition-colors duration-300"
                    onClick={() => handleResponder(pergunta.id)}
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
                      key={r.id}
                      className="border p-2 rounded-md mb-2 flex justify-between items-center"
                    >
                      <span>{r.conteudo}</span>

                      {(userId === r.userId ||
                        userId === pergunta.usuario.id) && (
                        <button
                          className="p-2 bg-white text-black rounded-md hover:bg-red-400 transition-colors duration-300 hover:text-black cursor-pointer"
                          onClick={() => handleDeleteResposta(r.id)}
                        >
                          Deletar resposta
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {responderId === pergunta.id && (
                <div className="mt-2 flex flex-col gap-2">
                  <input
                    ref={respostaInputRef}
                    type="text"
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                    placeholder="Digite sua resposta..."
                    className="p-2 rounded-md border border-zinc-300"
                    disabled={createResposta.isPending}
                  />
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-lg bg-purple-600 text-white text-xs lg:text-base hover:bg-purple-900 transition-colors duration-300"
                      onClick={() =>
                        handleEnviarResposta({
                          perguntaId: pergunta.id,
                          userId: userId!,
                          conteudo,
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
