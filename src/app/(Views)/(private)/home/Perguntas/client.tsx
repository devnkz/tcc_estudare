"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { CreateRespostaData, Resposta } from "@/types/resposta";
import { Pergunta } from "@/types/pergunta";
import { Componente } from "@/types/componente";
import { Curso } from "@/types/curso";
import { useCreateResposta } from "@/hooks/resposta/useCreate";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useListPerguntas } from "@/hooks/pergunta/useList";
import { useListComponentes } from "@/hooks/componente/useList";
import { useListCursos } from "@/hooks/curso/useList";
import { useListRespostas } from "@/hooks/resposta/useList";
import { useDeletePergunta } from "@/hooks/pergunta/useDelete";
import { useDeleteResposta } from "@/hooks/resposta/useDelete";
import Portal from "@/components/shared/Portal";
import ModalUpdateQuestion from "./modalUpdateQuestion";
import ModalUpdateResponse from "./modalUpdateResponse";
import ModalCreateDenuncia from "./modalCreateReport";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
// use `User` from lucide-react to keep icon set consistent

import { Inter } from "next/font/google";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Search, BookOpen, Puzzle, X, ChevronDown, User } from "lucide-react";
import { Info } from "lucide-react";
import { ActionButton } from "@/components/ui/actionButton";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { BsThreeDotsVertical, BsReply, BsClock } from "react-icons/bs";
import { ocultarPergunta } from "@/services/ocultarPerguntaService";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { validarTextoOuErro } from "@/utils/filterText";

const inter = Inter({ subsets: ["latin"] });

interface PerguntasClientPageProps {
  initialPerguntas: Pergunta[];
  initialComponentes: Componente[];
  initialCursos: Curso[];
  initialRespostas: Resposta[];
  id_usuario: string;
  tipousuario: string;
  token: string;
}

export function PerguntasClientPage({
  initialPerguntas,
  initialComponentes,
  initialCursos,
  initialRespostas,
  tipousuario,
  id_usuario,
  token,
}: PerguntasClientPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
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

  // filtros (curso, componente)
  const [filterCursoId, setFilterCursoId] = useState<string>("");
  const [filterComponenteId, setFilterComponenteId] = useState<string>("");
  // filtro para exibir/ocultar perguntas do usuário atual
  const [filterMode, setFilterMode] = useState<"all" | "onlyMine" | "hideMine">(
    "all"
  );

  // texto de busca: `inputText` é o valor imediato do input; `textQuery` é o valor debounced usado para filtrar
  const [inputText, setInputText] = useState<string>("");
  const [textQuery, setTextQuery] = useState<string>("");

  const selectedCursoName = useMemo(() => {
    return (
      cursosQuery.data?.find((c: Curso) => c.id_curso === filterCursoId)
        ?.nome_curso || ""
    );
  }, [cursosQuery.data, filterCursoId]);

  const selectedComponenteName = useMemo(() => {
    return (
      componentesQuery.data?.find(
        (c: Componente) => c.id_componente === filterComponenteId
      )?.nome_componente || ""
    );
  }, [componentesQuery.data, filterComponenteId]);

  // componentes filtrados pelo curso selecionado (se houver)
  const componentesFiltrados = useMemo(() => {
    const all = componentesQuery.data || [];
    if (!filterCursoId) return all;
    return all.filter((c: Componente) => c.curso?.id_curso === filterCursoId);
  }, [componentesQuery.data, filterCursoId]);

  const filteredPerguntas = useMemo(() => {
    const base = (perguntas || []).filter((p) => {
      const byCurso =
        !selectedCursoName || p.curso?.nome_curso === selectedCursoName;
      const byComp =
        !selectedComponenteName ||
        p.componente?.nome_componente === selectedComponenteName;
      return byCurso && byComp;
    });

    // First apply text filtering (if any)
    const q = textQuery?.trim().toLowerCase();
    let textFiltered = base;
    if (q) {
      textFiltered = base.filter((p) => p.pergunta.toLowerCase().includes(q));
    }

    // Then apply ownership filter regardless of text
    if (filterMode === "onlyMine") {
      return textFiltered.filter((p) => {
        const ownerId = p.fkId_usuario || p.usuario?.id_usuario;
        return String(ownerId) === String(id_usuario);
      });
    }
    if (filterMode === "hideMine") {
      return textFiltered.filter((p) => {
        const ownerId = p.fkId_usuario || p.usuario?.id_usuario;
        return String(ownerId) !== String(id_usuario);
      });
    }

    return textFiltered;
  }, [
    perguntas,
    selectedCursoName,
    selectedComponenteName,
    textQuery,
    filterMode,
    id_usuario,
  ]);

  const [responderId, setResponderId] = useState<string | null>(null);
  const [resposta, setResposta] = useState("");
  const [respostaError, setRespostaError] = useState<string>("");

  // Modal de pergunta aberta (overlay) para não esticar a coluna ao lado
  const [openPergunta, setOpenPergunta] = useState<Pergunta | null>(null);

  const [modalDenunciaOpen, setModalDenunciaOpen] = useState<{
    [key: string]: boolean;
  }>({});

  // Estado para controlar modal de editar pergunta
  const [editPerguntaId, setEditPerguntaId] = useState<string | null>(null);

  // Estado para controlar modal de editar resposta
  const [editRespostaId, setEditRespostaId] = useState<string | null>(null);

  // controla expandir/ocultar respostas por pergunta
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});

  const handleResponder = (fkId_pergunta: string) => {
    setResponderId(fkId_pergunta);
    setResposta("");
    setTimeout(() => respostaInputRef.current?.focus(), 100);
  };

  // retorna true somente se houve atualização posterior à criação
  const wasEdited = (created?: Date | string, updated?: Date | string) => {
    if (!updated) return false;
    const c = created ? new Date(created).getTime() : 0;
    const u =
      typeof updated === "string"
        ? new Date(updated).getTime()
        : (updated as Date).getTime();
    // considera editado apenas se o timestamp de atualização for mais de 1s maior
    return u - c > 1000;
  };

  const deletePerguntaHook = useDeletePergunta();
  const deleteRespostaHook = useDeleteResposta();

  // Inline alert (substitui toast)
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setShowAlert(true);
    window.setTimeout(() => setShowAlert(false), 4500);
  };

  const handleDelete = (id: string) =>
    deletePerguntaHook.mutate(
      { id },
      {
        onSuccess: () => triggerAlert("Pergunta excluída com sucesso"),
      }
    );

  // Confirmation modal state for deleting a pergunta (keeps same style as short-question modal)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteConfirmError, setDeleteConfirmError] = useState<string | null>(
    null
  );

  const proceedWithDelete = () => {
    if (!deleteTargetId) return;
    setDeleteConfirmError(null);
    deletePerguntaHook.mutate(
      { id: deleteTargetId },
      {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setDeleteTargetId(null);
          triggerAlert("Pergunta excluída com sucesso");
        },
        onError: (err: any) => {
          const serverMessage =
            err?.response?.data?.error || err?.message || "Falha ao excluir.";
          setDeleteConfirmError(serverMessage);
        },
      }
    );
  };

  const handleDeleteResposta = (id: string) =>
    deleteRespostaHook.mutate(
      { id },
      { onSuccess: () => triggerAlert("Resposta excluída") }
    );

  const handleEnviarResposta = (data: CreateRespostaData) => {
    try {
      // Valida badwords antes de enviar
      validarTextoOuErro(data.resposta);
      setRespostaError(""); // Limpa erro se passar

      createResposta.mutate(data, {
        onSuccess: () => {
          setResponderId(null);
          setResposta("");
          setRespostaError("");
          triggerAlert("Resposta enviada");
        },
        onError: (err: any) => {
          setRespostaError(
            err?.response?.data?.message ||
              err?.message ||
              "Erro ao enviar resposta"
          );
        },
      });
    } catch (err: any) {
      setRespostaError(err.message || "Conteúdo impróprio detectado");
    }
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
        // garante que respostas estejam visíveis ao focar uma resposta
        setOpenAnswers((prev) => ({ ...prev, __openAll: true }));
        respostasRefs.current[highlightId]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [highlightId, highlightType, perguntas, respostas]);

  // util: tempo relativo básico
  const timeAgo = (date?: Date | string) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    const diff = Date.now() - d.getTime();
    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    if (sec < 60) return `há ${sec}s`;
    if (min < 60) return `há ${min}min`;
    if (hr < 24) return `há ${hr}h`;
    return `há ${day}d`;
  };

  const isLoadingList =
    (perguntasQuery as any)?.isLoading || (perguntasQuery as any)?.isFetching;

  // Init from query string (run once)
  const didInitFromQuery = useRef(false);
  useEffect(() => {
    if (didInitFromQuery.current) return;
    didInitFromQuery.current = true;
    const q = searchParams.get("q") || "";
    const curso = searchParams.get("curso") || "";
    const componente = searchParams.get("componente") || "";
    if (q) {
      setInputText(q);
      setTextQuery(q);
    }
    if (curso) setFilterCursoId(curso);
    if (componente) setFilterComponenteId(componente);
  }, []);

  // Debounce text input -> textQuery
  useEffect(() => {
    const t = setTimeout(() => {
      setTextQuery(inputText);
    }, 450);
    return () => clearTimeout(t);
  }, [inputText]);

  // Persist filters in query string (avoid loops by comparing)
  useEffect(() => {
    const current = searchParams.toString();
    const params = new URLSearchParams(current);
    const setOrDelete = (k: string, v: string) => {
      const val = v?.trim();
      if (val) params.set(k, val);
      else params.delete(k);
    };
    setOrDelete("q", textQuery);
    setOrDelete("curso", filterCursoId);
    setOrDelete("componente", filterComponenteId);
    const next = params.toString();
    if (next !== current) {
      // use scroll: false to avoid jumping to top when updating query params
      router.replace(`${pathname}${next ? `?${next}` : ""}`, { scroll: false });
    }
  }, [
    textQuery,
    filterCursoId,
    filterComponenteId,
    pathname,
    router,
    searchParams,
  ]);

  return (
    <div
      className={`${inter.className} w-full px-[6px] md:px-[6px] py-3 md:py-4 flex flex-col gap-5`}
    >
      {/* Busca e filtros (estilo similar ao dashboard) */}
      <div className="w-full rounded-2xl border border-zinc-200 bg-white p-4 pl-5 shadow-sm space-y-3">
        {/* Layout ajustado: alinha busca e selects em linha no desktop, evita quebra de label */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] lg:grid-cols-[1fr_1fr_1fr_auto] gap-3 md:items-center">
          {/* Busca por texto */}
          <div className="relative md:w-[240px] lg:w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Buscar texto da pergunta..."
              className="w-full h-11 pl-10 pr-10 rounded-full border border-zinc-200 bg-white text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition"
            />
          </div>

          {/* Select Curso */}
          <div className="relative w-full min-w-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  className="w-full h-11 flex items-center justify-between gap-2 text-sm rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-sm hover:shadow-md px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                    <span className="truncate min-w-0">
                      {filterCursoId ? selectedCursoName : "Cursos"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Cursos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setFilterCursoId("");
                    setFilterComponenteId("");
                  }}
                >
                  Todos os Cursos
                </DropdownMenuItem>
                {cursosQuery.data?.map((c: Curso) => (
                  <DropdownMenuItem
                    key={c.id_curso}
                    onClick={() => {
                      setFilterCursoId(c.id_curso);
                      // clear componente if it doesn't belong to the selected course
                      if (filterComponenteId) {
                        const comp = componentesQuery.data?.find(
                          (cmp: Componente) =>
                            cmp.id_componente === filterComponenteId
                        );
                        if (comp && comp.curso?.id_curso !== c.id_curso)
                          setFilterComponenteId("");
                      }
                    }}
                  >
                    {c.nome_curso}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Select Componente */}
          <div className="relative w-full min-w-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  className="w-full h-11 flex items-center justify-between gap-2 text-sm rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-sm hover:shadow-md px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Puzzle className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                    <span className="truncate min-w-0">
                      {filterComponenteId
                        ? selectedComponenteName
                        : "Componentes"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Componentes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setFilterComponenteId("");
                  }}
                >
                  Todos os Componentes
                </DropdownMenuItem>
                {componentesFiltrados.map((c: Componente) => (
                  <DropdownMenuItem
                    key={c.id_componente}
                    onClick={() => {
                      setFilterComponenteId(c.id_componente);
                      // ensure curso is set to the componente's course
                      const cursoId = c.curso?.id_curso;
                      if (cursoId && cursoId !== filterCursoId)
                        setFilterCursoId(cursoId);
                    }}
                  >
                    {c.nome_componente}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Filtro (moved to end for layout symmetry) */}
          <div className="relative w-full md:w-[150px] lg:w-[180px]">
            <label className="sr-only">Filtro de perguntas</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full h-11 flex items-center justify-between gap-2 text-sm rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-sm hover:shadow-md px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition cursor-pointer overflow-hidden"
                  aria-haspopup="menu"
                  aria-expanded="false"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                    <span className="truncate min-w-0">
                      {filterMode === "all" && "Filtrar: Todas"}
                      {filterMode === "onlyMine" && "Filtrar: Apenas minhas"}
                      {filterMode === "hideMine" && "Filtrar: Sem minhas"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Filtrar perguntas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterMode("all")}>
                  Todas as perguntas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterMode("onlyMine")}>
                  Apenas minhas perguntas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterMode("hideMine")}>
                  Ocultar minhas perguntas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Linha de status + chips de filtros */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
          <div className="flex items-center gap-3">
            <span className="whitespace-nowrap">
              {filteredPerguntas.length} pergunta(s) encontradas
              {textQuery && ` para "${textQuery}"`}
            </span>
            {/* Botão limpar */}
            {(filterCursoId || filterComponenteId || textQuery) && (
              <button
                onClick={() => {
                  setFilterCursoId("");
                  setFilterComponenteId("");
                  setTextQuery("");
                }}
                className="px-3 py-1.5 rounded-full border border-zinc-200 bg-white text-zinc-700 text-xs cursor-pointer hover:shadow-md transition-shadow"
              >
                Limpar
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {textQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 border border-zinc-200">
                Texto: “{textQuery}”
                <button
                  onClick={() => setTextQuery("")}
                  className="ml-1 hover:text-zinc-800 cursor-pointer"
                  aria-label="Remover filtro de texto"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {filterMode !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 border border-zinc-200">
                {filterMode === "onlyMine" ? "Apenas minhas" : "Sem minhas"}
                <button
                  onClick={() => setFilterMode("all")}
                  className="ml-1 hover:text-zinc-800 cursor-pointer"
                  aria-label="Remover filtro de usuário"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {filterCursoId && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 border border-zinc-200">
                Curso: {selectedCursoName}
                <button
                  onClick={() => setFilterCursoId("")}
                  className="ml-1 hover:text-zinc-800 cursor-pointer"
                  aria-label="Remover filtro de curso"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {filterComponenteId && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 border border-zinc-200">
                Componente: {selectedComponenteName}
                <button
                  onClick={() => setFilterComponenteId("")}
                  className="ml-1 hover:text-zinc-800 cursor-pointer"
                  aria-label="Remover filtro de componente"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Alert banner substitui toast */}
      <AnimatePresence>
        {showAlert && alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 right-6 z-50 max-w-sm w-full"
          >
            <div className="relative rounded-2xl border border-purple-200 bg-white shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
              <div className="relative flex items-center gap-3 p-4">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-xs">
                  !
                </div>
                <div className="flex-1 text-sm text-zinc-700 leading-snug">
                  {alertMessage}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(139,92,246,0.5)",
                      "0 0 0 8px rgba(139,92,246,0)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  onClick={() => setShowAlert(false)}
                  className="px-3 py-1.5 rounded-full bg-purple-600 text-white text-xs cursor-pointer hover:bg-purple-700"
                >
                  Entendi
                </motion.button>
              </div>
              <motion.div
                className="h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"
                initial={{ width: "100%" }}
                animate={{ width: 0 }}
                transition={{ duration: 4.5, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isLoadingList && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="w-full p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm animate-pulse"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-200" />
                  <div>
                    <div className="h-3 w-40 bg-zinc-200 rounded" />
                    <div className="mt-1 h-3 w-24 bg-zinc-100 rounded" />
                  </div>
                </div>
                <div className="h-6 w-24 bg-zinc-100 rounded-full" />
              </div>
              <div className="mt-4 h-4 w-3/4 bg-zinc-200 rounded" />
              <div className="mt-3 h-4 w-1/2 bg-zinc-100 rounded" />
              <div className="mt-4 flex gap-2">
                <div className="h-7 w-28 bg-zinc-100 rounded-md" />
                <div className="h-7 w-32 bg-zinc-200 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoadingList &&
      filteredPerguntas.filter((p) => p.visibilidade_pergunta === true).length >
        0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPerguntas
            .filter((p) => p.visibilidade_pergunta === true)
            .map((pergunta) => {
              const respostasPergunta = respostas.filter(
                (r) => r.fkId_pergunta === pergunta.id_pergunta
              );
              // normalize author shape: backend sometimes returns `usuario` or `usuarios`
              const author = (pergunta as any).usuario ??
                (pergunta as any).usuarios ?? {
                  id_usuario: "",
                  nome_usuario: "Usuário removido",
                  apelido_usuario: "",
                  foto_perfil: null,
                };
              const minhaResposta = respostasPergunta.find(
                (r) =>
                  ((r as any).usuario ?? (r as any).usuarios)?.id_usuario ===
                  id_usuario
              );
              const jaRespondida = !!minhaResposta;
              const temResposta = respostasPergunta.length > 0;
              const isPerguntaHighlighted =
                highlightType === "Pergunta" &&
                highlightId === pergunta.id_pergunta;
              const showAnswers =
                openAnswers[pergunta.id_pergunta] ||
                (openAnswers.__openAll as unknown as boolean);

              return (
                <div key={pergunta.id_pergunta} className="relative">
                  <GlowingEffect
                    spread={70}
                    glow={true}
                    disabled={false}
                    proximity={150}
                    inactiveZone={0.2}
                    borderWidth={3}
                    movementDuration={1}
                    blur={6}
                  />
                  <motion.div
                    ref={(el) =>
                      void (perguntasRefs.current[pergunta.id_pergunta] = el)
                    }
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                    className={`group relative w-full h-full overflow-hidden rounded-3xl border bg-white/70 backdrop-blur-sm shadow-[0_2px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_14px_-2px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all px-6 py-6 flex flex-col
                  ${
                    isPerguntaHighlighted
                      ? "ring-2 ring-purple-300/60"
                      : "border-zinc-200"
                  }`}
                  >
                    {/* subtle gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
                    </div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {author.foto_perfil ? (
                          <img
                            src={author.foto_perfil}
                            alt={author.nome_usuario || "avatar"}
                            className="w-10 h-10 rounded-full object-cover shadow-sm flex-shrink-0"
                          />
                        ) : (
                          <UserCircleIcon className="w-10 h-10 text-purple-400 flex-shrink-0" />
                        )}
                        <div className="flex flex-col min-w-0 flex-1 items-start">
                          <span className="text-sm font-semibold text-zinc-800 break-words text-left w-full">
                            {author.nome_usuario} ({author.apelido_usuario})
                          </span>
                          <span className="text-[11px] text-zinc-500 flex items-center gap-1 text-left">
                            <BsClock className="w-3.5 h-3.5" />{" "}
                            {timeAgo(pergunta.dataCriacao_pergunta)}
                            {wasEdited(
                              pergunta.dataCriacao_pergunta,
                              pergunta.dataAtualizacao_pergunta
                            ) && (
                              <span className="ml-1 text-zinc-400">
                                • editado
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 rounded-xl bg-white/50 hover:bg-white text-zinc-600 shadow-sm border border-zinc-200 cursor-pointer transition">
                          <BsThreeDotsVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="z-[120]">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {id_usuario === author.id_usuario && (
                            <DropdownMenuItem
                              onClick={() => {
                                setOpenPergunta(null); // Fecha modal de ver respostas
                                setEditPerguntaId(pergunta.id_pergunta);
                              }}
                              className="cursor-pointer"
                            >
                              Editar
                            </DropdownMenuItem>
                          )}
                          {id_usuario === author.id_usuario && (
                            <DropdownMenuItem
                              onClick={() => {
                                // open confirm dialog instead of deleting immediately
                                setDeleteTargetId(pergunta.id_pergunta);
                                setDeleteConfirmOpen(true);
                              }}
                              className="cursor-pointer text-red-600"
                            >
                              Excluir
                            </DropdownMenuItem>
                          )}
                          {id_usuario !== author.id_usuario &&
                            tipousuario !== "Professor" && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setOpenPergunta(pergunta);
                                  handleResponder(pergunta.id_pergunta);
                                }}
                                className="cursor-pointer"
                              >
                                Responder
                              </DropdownMenuItem>
                            )}

                          {tipousuario === "Professor" && (
                            <DropdownMenuItem
                              onClick={async () => {
                                const ok = await ocultarPergunta(
                                  pergunta.id_pergunta,
                                  token
                                );
                                if (ok) {
                                  triggerAlert("Pergunta ocultada");
                                  // Fecha modal/dropdown
                                  setOpenPergunta(null);
                                }
                              }}
                              className="cursor-pointer text-red-500"
                            >
                              Ocultar pergunta
                            </DropdownMenuItem>
                          )}

                          {id_usuario !== author.id_usuario && (
                            <DropdownMenuItem
                              onClick={() =>
                                toggleModalDenuncia(pergunta.id_pergunta)
                              }
                              className="cursor-pointer text-red-500"
                            >
                              Denunciar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Pergunta */}
                    <div className="relative mb-4">
                      <h3 className="text-left text-[18px] md:text-[20px] font-bold leading-snug tracking-tight text-zinc-900">
                        {pergunta.pergunta}
                      </h3>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[12px] font-semibold text-blue-700 border border-blue-200">
                        <BookOpen className="w-3.5 h-3.5" />
                        {pergunta.curso.nome_curso}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-[12px] font-semibold text-purple-700 border border-purple-200">
                        <Puzzle className="w-3.5 h-3.5" />
                        {pergunta.componente.nome_componente}
                      </span>
                      {temResposta && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-[11px] font-medium text-purple-600">
                          {respostasPergunta.length} resposta(s)
                        </span>
                      )}
                    </div>

                    {/* Spacer para empurrar botões para o final */}
                    <div className="flex-1"></div>

                    {/* Actions - botões sempre no final do card */}
                    <div className="flex flex-col gap-2 items-center w-full">
                      {id_usuario !== author.id_usuario &&
                      tipousuario !== "Professor" &&
                      !jaRespondida ? (
                        <LiquidButton
                          size="default"
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-lg rounded-2xl"
                          onClick={() => {
                            setOpenPergunta(pergunta);
                            handleResponder(pergunta.id_pergunta);
                          }}
                        >
                          Responder
                        </LiquidButton>
                      ) : (
                        <div className="h-10" />
                      )}
                      <LiquidButton
                        size="default"
                        className="w-full px-3 py-2.5 text-sm font-medium text-zinc-700 rounded-2xl"
                        onClick={() => setOpenPergunta(pergunta)}
                      >
                        Ver respostas
                      </LiquidButton>
                    </div>

                    {/* Modal de editar pergunta - controlado por estado */}
                    <ModalUpdateQuestion
                      pergunta={pergunta}
                      isOpen={editPerguntaId === pergunta.id_pergunta}
                      onOpenChange={(open) => {
                        if (!open) setEditPerguntaId(null);
                      }}
                      onSuccess={() => {
                        setEditPerguntaId(null);
                        triggerAlert("Pergunta atualizada");
                      }}
                    />

                    {/* Modal de denunciar pergunta */}
                    <ModalCreateDenuncia
                      id_conteudo={pergunta.id_pergunta}
                      id_usuario={id_usuario}
                      fkId_usuario_conteudo={author.id_usuario}
                      tipo_conteudo="Pergunta"
                      isOpen={!!modalDenunciaOpen[pergunta.id_pergunta]}
                      onOpenChange={(open) =>
                        setModalDenunciaOpen((prev) => ({
                          ...prev,
                          [pergunta.id_pergunta]: open,
                        }))
                      }
                    />
                    {/* Confirm delete modal (same visual style as short-question modal) */}
                    <Dialog
                      open={deleteConfirmOpen}
                      onOpenChange={(v) => {
                        if (!v) {
                          setDeleteConfirmOpen(false);
                          setDeleteTargetId(null);
                          setDeleteConfirmError(null);
                        } else {
                          setDeleteConfirmOpen(true);
                        }
                      }}
                    >
                      <DialogContent
                        overlayClassName="bg-black/20 backdrop-blur-sm"
                        className="w-[calc(100vw-2rem)] sm:w-auto max-w-sm rounded-2xl p-6 bg-white dark:bg-slate-900 border border-red-200 shadow-xl"
                      >
                        <DialogHeader>
                          <DialogTitle className="text-xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                            Tem certeza que deseja excluir <br /> esta pergunta?
                          </DialogTitle>
                        </DialogHeader>

                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-4 rounded-lg border border-red-100 bg-red-50/70 px-3 py-2 text-[var(--foreground)] flex gap-2 items-start"
                        >
                          <Info className="w-4 h-4 mt-0.5 text-red-600" />
                          <p className="text-xs sm:text-sm">
                            Ao excluir, esta pergunta será removida
                            permanentemente. Esta ação não pode ser desfeita.
                            Deseja continuar?
                          </p>
                        </motion.div>

                        {deleteConfirmError && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-red-600 mb-3"
                          >
                            {deleteConfirmError}
                          </motion.p>
                        )}

                        <DialogFooter className="pt-2">
                          <div className="flex items-center justify-between w-full gap-3">
                            <ActionButton
                              type="button"
                              onClick={() => proceedWithDelete()}
                              textIdle={
                                deletePerguntaHook.isPending
                                  ? "Excluindo..."
                                  : "Excluir pergunta"
                              }
                              isLoading={deletePerguntaHook.isPending}
                              enableRipplePulse
                              className="min-w-[160px] cursor-pointer bg-gradient-to-r from-red-600 to-rose-600"
                            />

                            <ActionButton
                              type="button"
                              onClick={() => {
                                setDeleteConfirmOpen(false);
                                setDeleteTargetId(null);
                              }}
                              textIdle="Cancelar"
                              isLoading={false}
                              isSuccess={false}
                              enableRipplePulse
                              className="min-w-[160px] cursor-pointer bg-gradient-to-r from-purple-600 to-fuchsia-600"
                            />
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                </div>
              );
            })}
        </div>
      ) : (
        <div>Sem perguntas até o momento</div>
      )}

      {/* Modal de pergunta aberta: não empurra o grid e anima suavemente */}
      <AnimatePresence>
        {openPergunta && (
          <Portal>
            {/* Backdrop & modal in portal to cover header (which has z-50) */}
            <motion.div
              className="fixed inset-0 z-[90] bg-white/60 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setOpenPergunta(null);
                setResponderId(null);
              }}
            />
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="relative w-full max-w-2xl rounded-[28px] border border-zinc-200 bg-white/80 backdrop-blur-xl shadow-2xl">
                <div className="absolute inset-0 rounded-[28px] pointer-events-none bg-gradient-to-br from-purple-500/8 via-transparent to-pink-500/10" />
                <div className="relative p-6 sm:p-7 space-y-4">
                  {/** openAuthor available for downstream checks **/}
                  {(() => {
                    const maybe = (openPergunta as any) ?? {};
                    (maybe as any).openAuthor = maybe.usuario ??
                      maybe.usuarios ?? {
                        id_usuario: "",
                        nome_usuario: "Usuário removido",
                        apelido_usuario: "",
                        foto_perfil: null,
                      };
                    return null;
                  })()}
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/** normalize openPergunta author shape **/}
                      {(() => {
                        const openAuthor = (openPergunta as any)?.usuario ??
                          (openPergunta as any)?.usuarios ?? {
                            id_usuario: "",
                            nome_usuario: "Usuário removido",
                            apelido_usuario: "",
                            foto_perfil: null,
                          };
                        return (
                          <>
                            {openAuthor.foto_perfil ? (
                              <img
                                src={openAuthor.foto_perfil}
                                alt={openAuthor.nome_usuario || "avatar"}
                                className="w-9 h-9 rounded-full object-cover shadow-sm"
                              />
                            ) : (
                              <UserCircleIcon className="w-9 h-9 text-purple-400" />
                            )}
                            <div className="leading-tight">
                              <div className="font-semibold text-sm text-gray-900">
                                {openAuthor.nome_usuario}{" "}
                                <span className="text-zinc-500">
                                  ({openAuthor.apelido_usuario})
                                </span>
                              </div>
                              <div className="text-[11px] uppercase tracking-wide text-zinc-500">
                                {openPergunta.curso?.nome_curso} •{" "}
                                {openPergunta.componente?.nome_componente}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    <button
                      className="text-sm text-zinc-500 hover:text-zinc-800 cursor-pointer"
                      onClick={() => {
                        setOpenPergunta(null);
                        setResponderId(null);
                      }}
                    >
                      Fechar
                    </button>
                  </div>
                  {/* Question */}
                  <h3 className="text-left text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900">
                    {openPergunta.pergunta}
                  </h3>
                  {/* Respostas list */}
                  <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-2">
                    {respostas
                      .filter(
                        (r) => r.fkId_pergunta === openPergunta.id_pergunta
                      )
                      .map((r) => {
                        const rAuthor = (r as any).usuario ??
                          (r as any).usuarios ?? {
                            id_usuario: "",
                            nome_usuario: "Usuário removido",
                            apelido_usuario: "",
                            foto_perfil: null,
                          };
                        return (
                          <div
                            key={r.id_resposta}
                            ref={(el) =>
                              void (respostasRefs.current[r.id_resposta] = el)
                            }
                            className="group/resposta border border-zinc-200 bg-white/80 backdrop-blur rounded-2xl p-3 flex items-start gap-3 hover:shadow-sm transition"
                          >
                            {rAuthor.foto_perfil ? (
                              <img
                                src={rAuthor.foto_perfil}
                                alt={rAuthor.nome_usuario || "avatar"}
                                className="w-9 h-9 rounded-full object-cover"
                              />
                            ) : (
                              <UserCircleIcon className="w-9 h-9 text-purple-400" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex flex-col">
                                  <p className="font-semibold text-sm text-zinc-800 truncate">
                                    {rAuthor.nome_usuario} (
                                    {rAuthor.apelido_usuario})
                                  </p>
                                  <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                                    <BsClock className="w-3 h-3" />
                                    {r.dataCriacao_resposta
                                      ? timeAgo(r.dataCriacao_resposta)
                                      : "agora"}
                                    {wasEdited(
                                      r.dataCriacao_resposta,
                                      r.dataAtualizacao_resposta
                                    ) && (
                                      <span className="ml-1 text-zinc-400">
                                        • editado
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger className="opacity-80 hover:opacity-100 p-2 rounded-md hover:bg-zinc-100 transition cursor-pointer">
                                    <BsThreeDotsVertical className="w-4 h-4 text-zinc-600" />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="z-[120]">
                                    {id_usuario === rAuthor.id_usuario && (
                                      <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => {
                                          setEditRespostaId(r.id_resposta);
                                        }}
                                      >
                                        Editar
                                      </DropdownMenuItem>
                                    )}
                                    {(id_usuario === rAuthor.id_usuario ||
                                      id_usuario ===
                                        (openPergunta as any).openAuthor
                                          ?.id_usuario) && (
                                      <DropdownMenuItem
                                        className="cursor-pointer text-red-600"
                                        onClick={() =>
                                          handleDeleteResposta(r.id_resposta)
                                        }
                                      >
                                        Excluir
                                      </DropdownMenuItem>
                                    )}
                                    {id_usuario !== rAuthor.id_usuario && (
                                      <DropdownMenuItem
                                        className="cursor-pointer text-red-500"
                                        onClick={() =>
                                          toggleModalDenuncia(r.id_resposta)
                                        }
                                      >
                                        Denunciar
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <p className="mt-1 text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap break-words">
                                {r.resposta}
                              </p>

                              {/* Modal de editar resposta - controlado por estado */}
                              <ModalUpdateResponse
                                resposta={r}
                                isOpen={editRespostaId === r.id_resposta}
                                onOpenChange={(open) => {
                                  if (!open) setEditRespostaId(null);
                                }}
                                onSuccess={() => {
                                  setEditRespostaId(null);
                                  triggerAlert("Resposta atualizada");
                                }}
                              />

                              <ModalCreateDenuncia
                                id_conteudo={r.id_resposta}
                                id_usuario={id_usuario}
                                fkId_usuario_conteudo={rAuthor.id_usuario}
                                tipo_conteudo="Resposta"
                                isOpen={!!modalDenunciaOpen[r.id_resposta]}
                                onOpenChange={(open) =>
                                  setModalDenunciaOpen((prev) => ({
                                    ...prev,
                                    [r.id_resposta]: open,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                    {respostas.filter(
                      (r) => r.fkId_pergunta === openPergunta.id_pergunta
                    ).length === 0 && (
                      <div className="text-sm text-zinc-500">
                        Sem respostas ainda.
                      </div>
                    )}
                  </div>
                  {/* Composer (desativado se usuário já respondeu ou é dono) */}
                  {(() => {
                    const jaRespondi = respostas.some(
                      (r) =>
                        r.fkId_pergunta === openPergunta.id_pergunta &&
                        ((r as any).usuario ?? (r as any).usuarios)
                          ?.id_usuario === id_usuario
                    );
                    const isProfessor = tipousuario === "Professor";
                    const souDono =
                      (openPergunta as any).openAuthor?.id_usuario ===
                      id_usuario;
                    if (jaRespondi || souDono || isProfessor) {
                      return (
                        <div className="rounded-2xl border border-zinc-200 bg-white/70 backdrop-blur p-4 text-sm text-zinc-600 flex items-center justify-between">
                          <span>
                            {souDono
                              ? "Você é o autor desta pergunta."
                              : jaRespondi
                              ? "Você já respondeu esta pergunta."
                              : "Professores não podem responder perguntas."}
                          </span>
                          {jaRespondi && (
                            <button
                              onClick={() => {
                                setOpenPergunta(null);
                                setResponderId(null);
                              }}
                              className="px-3 py-1.5 rounded-full bg-purple-600 text-white text-xs cursor-pointer hover:bg-purple-700"
                            >
                              OK
                            </button>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div className="flex flex-col gap-2">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <textarea
                              rows={1}
                              ref={respostaInputRef as any}
                              value={
                                responderId === openPergunta.id_pergunta
                                  ? resposta
                                  : ""
                              }
                              onChange={(e) => {
                                const v = e.target.value;
                                if (v.length <= 191) {
                                  setResposta(v);
                                  setRespostaError(""); // Limpa erro ao digitar
                                }
                                // auto-resize
                                const el = e.target as HTMLTextAreaElement;
                                el.style.height = "auto";
                                el.style.height = `${el.scrollHeight}px`;
                              }}
                              maxLength={191}
                              placeholder="Escreva sua resposta..."
                              className="flex-1 bg-transparent outline-none placeholder:text-zinc-400 text-sm sm:text-base text-zinc-900 min-h-[32px] max-h-28 overflow-y-auto resize-none leading-relaxed whitespace-pre-wrap break-words"
                              disabled={createResposta.isPending}
                              onFocus={() =>
                                setResponderId(openPergunta.id_pergunta)
                              }
                            />
                            <button
                              className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base shadow-sm hover:shadow-md transition disabled:opacity-50 cursor-pointer"
                              onClick={() =>
                                handleEnviarResposta({
                                  fkId_pergunta: openPergunta.id_pergunta,
                                  fkId_usuario: id_usuario!,
                                  resposta,
                                })
                              }
                              disabled={
                                createResposta.isPending || !resposta.trim()
                              }
                            >
                              {createResposta.isPending
                                ? "Enviando..."
                                : "Enviar"}
                            </button>
                          </div>
                          {/* Error message stays inside the rounded box */}
                          <div className="mt-2">
                            {respostaError && (
                              <p className="text-red-600 text-sm font-medium">
                                {respostaError}
                              </p>
                            )}
                          </div>
                        </div>
                        {/* Counter moved outside the rounded box, aligned to the right at modal end */}
                        <div className="mt-2 flex justify-end">
                          <p
                            className={`text-xs ${
                              resposta.length >= 191
                                ? "text-red-600 font-semibold"
                                : "text-zinc-500"
                            }`}
                          >
                            {resposta.length}/191
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                  {createResposta.isError && (
                    <span className="text-red-600 text-xs">
                      Erro ao enviar resposta.{" "}
                      {createResposta.error?.message || ""}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
}
