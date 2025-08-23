"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { ChevronsUpDown, Check } from "lucide-react";
import { CreateRespostaData } from "@/types/resposta";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { useCreateResposta } from "@/hooks/resposta/useCreate";
import { useUser } from "@/context/userContext";

function getTypeFromData(items: any[]): "componente" | "curso" {
  if (!items || items.length === 0) return "componente"; // padrão
  if ("nomeComponente" in items[0]) return "componente";
  if ("nomeCurso" in items[0]) return "curso";
  return "componente"; // fallback
}

function normalizeItems(data: any[], type: "componente" | "curso") {
  if (type === "componente") {
    return data.map((item) => ({
      id: String(item.id),
      label: item.nomeComponente,
    }));
  }
  if (type === "curso") {
    return data.map((item) => ({
      id: String(item.id),
      label: item.nomeCurso,
    }));
  }
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
          className="w-[200px] bg-zinc-100 rounded-md p-2 flex justify-between border-transparent border-1 items-center
        hover:border-purple-600 hover:bg-zinc-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
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
  perguntas,
  componentes,
  cursos,
  respostas,
}: {
  perguntas: any[];
  componentes: any[];
  cursos: any[];
  respostas: any[];
}) {
  const { userId } = useUser();

  const [search, setSearch] = useState("");
  const [componente, setComponente] = useState("");
  const [curso, setCurso] = useState("");
  const [grupo, setGrupo] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todas");
  const [responderId, setResponderId] = useState<string | null>(null);
  const [resposta, setResposta] = useState("");
  const respostaInputRef = useRef<HTMLInputElement>(null);

  const createResposta = useCreateResposta();

  const handleResponder = (perguntaId: string) => {
    setResponderId(perguntaId);
    setResposta("");
    setTimeout(() => {
      respostaInputRef.current?.focus();
    }, 100);
  };

  const handleEnviarResposta = ({
    fkIdPergunta,
    fkIdUsuario,
    resposta,
  }: CreateRespostaData) => {
    createResposta.mutate(
      {
        fkIdPergunta,
        fkIdUsuario,
        resposta,
      },
      {
        onSuccess: () => {
          setResponderId(null);
          setResposta("");
        },
      }
    );
  };

  const filtros: string[] = ["Todas", "Respondidas", "Não Respondidas"];

  const perguntasFiltradas = perguntas.filter((pergunta) => {
    const respostasFiltradas = respostas.filter(
      (r) => r.fkIdPergunta === pergunta.id
    );
    const temResposta = respostasFiltradas.length > 0;

    // Filtro por status
    if (filtroStatus === "Respondidas" && !temResposta) return false;
    if (filtroStatus === "Não Respondidas" && temResposta) return false;

    // Filtro por componente
    if (componente && pergunta.idComponente !== Number(componente))
      return false;

    // Filtro por curso
    if (curso && pergunta.idCurso !== Number(curso)) return false;

    // Filtro por data (grupo)
    if (grupo) {
      const dataPergunta = new Date(pergunta.criadaEm)
        .toISOString()
        .split("T")[0];
      if (dataPergunta !== grupo) return false;
    }

    // Filtro por busca
    if (search) {
      const termo = search.toLowerCase();
      if (
        !pergunta.pergunta.toLowerCase().includes(termo) &&
        !pergunta.materia.toLowerCase().includes(termo)
      ) {
        return false;
      }
    }

    return true;
  });

  return (
    <div
      id="respondaPerguntasPage"
      className="w-full lg:p-4 flex flex-col gap-10"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
          <ComboboxFilter
            items={normalizeItems(componentes, getTypeFromData(componentes))}
            value={componente}
            setValue={setComponente}
            placeholder="Componente"
          />
          <ComboboxFilter
            items={normalizeItems(cursos, getTypeFromData(cursos))}
            value={curso}
            setValue={setCurso}
            placeholder="Curso"
          />
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
        </div>
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 p-2 rounded-lg border-1 border-transparent bg-zinc-100 text-black hover:border-purple-600 hover:bg-zinc-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
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

      {perguntasFiltradas.length > 0 ? (
        perguntasFiltradas.map((pergunta, index) => {
          const respostasFiltradas = respostas.filter(
            (r) => r.fkIdPergunta === pergunta.id
          );
          const temResposta = respostasFiltradas.length > 0;

          return (
            <div
              key={index}
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
                <button
                  className="p-2 rounded-lg bg-purple-600 text-white text-xs lg:text-base hover:bg-purple-900 transition-colors duration-300 cursor-pointer"
                  onClick={() => handleResponder(pergunta.id)}
                >
                  Responder
                </button>
                <button className="p-2 rounded-lg bg-white text-black text-xs lg:text-base">
                  Notificar respostas
                </button>
              </div>

              {temResposta && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Respostas:</h3>
                  {respostasFiltradas.map((resposta, idx) => (
                    <div key={idx}>{resposta.resposta}</div>
                  ))}
                </div>
              )}

              {responderId === pergunta.id && (
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
                      className="p-2 rounded-lg bg-purple-600 text-white text-xs lg:text-base hover:bg-purple-900 transition-colors duration-300 cursor-pointer"
                      onClick={() =>
                        handleEnviarResposta({
                          fkIdPergunta: pergunta.id,
                          fkIdUsuario: userId!,
                          resposta: resposta,
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
                      Erro ao enviar resposta. Tente novamente.
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
