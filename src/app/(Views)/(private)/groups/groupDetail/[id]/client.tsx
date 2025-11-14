"use client";

import { Grupo, Membro, UpdateGrupoData } from "@/types/grupo";
import { User } from "@/types/user";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MultiSelectCombobox } from "@/components/ui/comboxFilter";
import { useUpdateGrupo } from "@/hooks/grupo/useUpdate";
import { useRemoveGrupoMember } from "@/hooks/grupo/useRemoveMember";
import { useLeaveGroup } from "@/hooks/grupo/useLeave";
import { useGrupoById } from "@/hooks/grupo/useListById";
import { useDeleteGrupo } from "@/hooks/grupo/useDelete";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  EllipsisVertical,
  Crown,
  Send,
  CornerUpLeft,
  X,
  Info,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ActionButton } from "@/components/ui/actionButton";
import badWordsJSON from "@/utils/badWordsPT.json";

interface ClientGrupoDetailProps {
  grupoAtual: Grupo;
  users: User[];
  id_usuario_logado: string;
}

interface Mensagem {
  id_mensagem: string;
  mensagem: string;
  fkId_usuario: string;
  dataCriacao_Mensagem: string;
  usuario: {
    id_usuario: string;
    nome_usuario: string;
    apelido_usuario: string;
  };
  replyTo?: string | null; // id da mensagem original (opcional)
  replyToId?: string | null; // campo vindo do backend
}

export default function ClientGrupoDetail({
  grupoAtual,
  users,
  id_usuario_logado,
}: ClientGrupoDetailProps) {
  // Padrão sutil de patinhas 🐾 (SVG como data URI)
  const pawTileLight =
    encodeURI("data:image/svg+xml;utf8,") +
    `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <g fill='%23999' fill-opacity='0.08'>
        <circle cx='6' cy='6' r='1.5'/>
        <circle cx='4.5' cy='4' r='1'/>
        <circle cx='7.5' cy='4' r='1'/>
        <circle cx='6' cy='3' r='1'/>
        <ellipse cx='6' cy='7.8' rx='1.6' ry='1.1'/>
        <circle cx='18' cy='18' r='1.5'/>
        <circle cx='16.5' cy='16' r='1'/>
        <circle cx='19.5' cy='16' r='1'/>
        <circle cx='18' cy='15' r='1'/>
        <ellipse cx='18' cy='19.8' rx='1.6' ry='1.1'/>
      </g>
    </svg>`;
  const pawTileDark =
    encodeURI("data:image/svg+xml;utf8,") +
    `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <g fill='%23fff' fill-opacity='0.12'>
        <circle cx='6' cy='6' r='1.5'/>
        <circle cx='4.5' cy='4' r='1'/>
        <circle cx='7.5' cy='4' r='1'/>
        <circle cx='6' cy='3' r='1'/>
        <ellipse cx='6' cy='7.8' rx='1.6' ry='1.1'/>
        <circle cx='18' cy='18' r='1.5'/>
        <circle cx='16.5' cy='16' r='1'/>
        <circle cx='19.5' cy='16' r='1'/>
        <circle cx='18' cy='15' r='1'/>
        <ellipse cx='18' cy='19.8' rx='1.6' ry='1.1'/>
      </g>
    </svg>`;
  const [grupo, setGrupo] = useState(grupoAtual); // <--- estado local
  const [open, setOpen] = useState(false);
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [novoNome, setNovoNome] = useState(grupoAtual.nome_grupo);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const router = useRouter();

  // Estado para confirmação de saída / exclusão
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"delete" | "leave" | null>(
    null
  );
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const { data: grupoData } = useGrupoById(grupo.id_grupo);

  // Refs
  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Estados do chat e UI
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [replyTarget, setReplyTarget] = useState<Mensagem | null>(null);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [nomeError, setNomeError] = useState<string | null>(null);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [usersTyping, setUsersTyping] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isOwner = id_usuario_logado === grupo.fkId_usuario;

  // Animação de verificação do nome
  const [nomeDirty, setNomeDirty] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);

  // Hooks de mutação
  const updateGrupoMutation = useUpdateGrupo();
  const removeMemberMutation = useRemoveGrupoMember();
  const leaveGroupMutation = useLeaveGroup();
  const deleteGrupoMutation = useDeleteGrupo();

  // Utilitário de texto impróprio
  // Espelha a normalização do backend (acentos/leet/repetição) e faz busca por substring
  const badWords: string[] = Array.isArray(badWordsJSON)
    ? (badWordsJSON as unknown as string[])
    : (badWordsJSON as any)?.words ?? [];
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[@4]/g, "a")
      .replace(/3/g, "e")
      .replace(/[1!]/g, "i")
      .replace(/0/g, "o")
      .replace(/\$/g, "s")
      .replace(/(\w)\1{2,}/g, "$1");
  const badRoots = badWords.map((w) => normalize(String(w)));
  const hasBadWordText = (text: string) => {
    const t = normalize(text);
    return badRoots.some((root) => root && t.includes(root));
  };
  // Censura client-side: substitui letras/dígitos de tokens que contenham raiz ofensiva
  // Mantém espaços e pontuação para legibilidade.
  const censorBadWords = (text: string) => {
    if (!text) return text;
    return text
      .split(/(\s+)/) // preserva separadores de espaço
      .map((token) => {
        if (!token.trim()) return token; // whitespace puro
        // Remover pontuação periférica para análise (não altera token original até decidir censurar)
        const core = token.replace(/[.,;:!?"'()\[\]{}<>]/g, "");
        const norm = normalize(core);

        // Verifica se é exatamente uma bad word (palavra completa)
        // ou se começa/termina com bad word seguida de caracteres especiais
        const isBad = badRoots.some((root) => {
          if (!root) return false;

          // Verifica se é a palavra exata
          if (norm === root) return true;

          // Verifica se é palavra completa com limites de palavra
          // Só considera bad word se estiver isolada, não como parte de outra palavra
          const wordBoundaryRegex = new RegExp(`(^|\\W)${root}(\\W|$)`, "i");
          return wordBoundaryRegex.test(norm);
        });

        if (!isBad) return token;
        // Substitui apenas caracteres alfabéticos/dígitos por '*', preservando pontuação interna.
        return token.replace(/[\p{L}\d]/gu, "*");
      })
      .join("");
  };

  // Ações
  const handleEditGroup = () => {
    const payload: UpdateGrupoData = {
      id: grupo.id_grupo,
      nome_grupo: novoNome,
    } as any;
    updateGrupoMutation.mutate(payload as any, {
      onSuccess: () => setGrupo((g) => ({ ...g, nome_grupo: novoNome })),
    });
  };
  const handleAddMembers = () => {
    const existingUserIds = (grupoData?.membros || []).map(
      (m: Membro) => m.usuario.id_usuario
    );
    const toAdd = selectedUserIds.filter((id) => !existingUserIds.includes(id));
    if (toAdd.length === 0) {
      // nada novo para adicionar; apenas fechar e limpar seleção
      setSelectedUserIds([]);
      setOpen(false);
      return;
    }
    const payload: UpdateGrupoData = {
      id: grupo.id_grupo,
      novosMembrosIds: toAdd as any,
    } as any;
    updateGrupoMutation.mutate(payload as any, {
      onSuccess: () => {
        setSelectedUserIds([]);
        setOpen(false);
      },
    });
  };
  const handleRemoveMember = (id_membro: string) => {
    // Envia o formato correto esperado pelo hook: { grupoId, membroId }
    removeMemberMutation.mutate(
      { grupoId: grupo.id_grupo, membroId: id_membro },
      { onSuccess: () => {} }
    );
  };
  const handleLeaveGroup = () => {
    leaveGroupMutation.mutate({ grupoId: grupo.id_grupo } as any, {
      onSuccess: () => router.push("/groupss"),
      onError: (err: any) => {
        console.error("Erro ao sair do grupo", err);
      },
    });
  };

  const handleDeleteOrLeaveGroup = () => {
    setConfirmError(null);
    if (isOwner) {
      deleteGrupoMutation.mutate(grupo.id_grupo as any, {
        onSuccess: () => {
          setConfirmOpen(false);
          router.push("/groups");
        },
        onError: (err: any) => {
          console.error("Erro ao excluir grupo", err);
          setConfirmError("Falha ao excluir. Tente novamente.");
        },
      });
    } else {
      leaveGroupMutation.mutate({ grupoId: grupo.id_grupo } as any, {
        onSuccess: () => {
          setConfirmOpen(false);
          router.push("/groupss");
        },
        onError: (err: any) => {
          console.error("Erro ao sair do grupo", err);
          setConfirmError("Falha ao sair. Tente novamente.");
        },
      });
    }
  };

  // Debounce validação animada do nome do grupo
  useEffect(() => {
    if (!nomeDirty) return;
    setIsCheckingName(true);
    const t = setTimeout(() => {
      if (hasBadWordText(novoNome)) {
        setNomeError(
          "Conteúdo impróprio detectado. Remova palavras ofensivas antes de enviar."
        );
      } else {
        if (nomeError && nomeError.startsWith("Conteúdo impróprio")) {
          setNomeError(null);
        }
      }
      setIsCheckingName(false);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [novoNome, nomeDirty]);

  // Enviar mensagem (mínimo para compilar; integrações em tempo real mantidas via servidor existente)
  const MAX_CHARS = 191;
  const charCount = novaMensagem.length;
  const handleEnviarMensagem = () => {
    const text = novaMensagem.trim();
    if (!text) return;
    if (charCount > MAX_CHARS) return;
    const censored = censorBadWords(text);
    if (sending) return;

    setSending(true);
    setChatError(null);
    const optimisticId = `temp-${Date.now()}`;
    const currentUser = users.find((u) => u.id_usuario === id_usuario_logado);
    const optimisticMensagem: Mensagem = {
      id_mensagem: optimisticId,
      mensagem: censored,
      fkId_usuario: id_usuario_logado,
      dataCriacao_Mensagem: new Date().toISOString(),
      usuario: {
        id_usuario: id_usuario_logado,
        nome_usuario: currentUser?.nome_usuario || "Você",
        apelido_usuario:
          currentUser?.apelido_usuario || currentUser?.nome_usuario || "Você",
      },
      replyTo: replyTarget?.id_mensagem || null,
    };
    // Armazena versão censurada para exibição imediata
    setMensagens((prev) => [
      ...prev,
      { ...optimisticMensagem, mensagem: censored },
    ]);
    // Envia texto original para o servidor (server-side pode moderar/armazenar)
    socketRef.current?.emit("nova_mensagem", {
      text,
      userId: id_usuario_logado,
      grupoId: grupo.id_grupo,
      replyTo: replyTarget?.id_mensagem || null,
    });

    // Parar animação de digitação imediatamente
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    socketRef.current?.emit("stop_typing", {
      userId: id_usuario_logado,
      grupoId: grupo.id_grupo,
    });

    setNovaMensagem("");
    setReplyTarget(null);
    setSending(false);
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 700);
  };

  // Deduplicação e socket (restaurado simplificado)
  const isTempId = (id?: string) => Boolean(id && id.startsWith("temp-"));
  const buildCompositeKey = (m: Mensagem) => {
    const slot = Math.floor(new Date(m.dataCriacao_Mensagem).getTime() / 5000);
    return `${m.fkId_usuario}|${m.mensagem}|${m.replyTo || ""}|${slot}`;
  };
  const buildBaseKey = (m: Mensagem) => {
    const slot = Math.floor(new Date(m.dataCriacao_Mensagem).getTime() / 5000);
    return `${m.fkId_usuario}|${m.mensagem}|${slot}`;
  };
  function mergeMessages(preferNew: Mensagem, other: Mensagem): Mensagem {
    return {
      ...preferNew,
      replyTo: preferNew.replyTo ?? other.replyTo ?? null,
      usuario: preferNew.usuario || other.usuario,
    };
  }
  function dedupeMessages(list: Mensagem[]) {
    const byComposite = new Map<string, Mensagem>();
    const byBase = new Map<string, Mensagem>();
    for (const msg of list) {
      const composite = buildCompositeKey(msg);
      const base = buildBaseKey(msg);
      const prevComposite = byComposite.get(composite);
      if (!prevComposite) {
        byComposite.set(composite, msg);
        const prevBase = byBase.get(base);
        if (
          !prevBase ||
          (isTempId(prevBase.id_mensagem) && !isTempId(msg.id_mensagem))
        ) {
          byBase.set(base, msg);
        }
        continue;
      }
      if (isTempId(prevComposite.id_mensagem) && !isTempId(msg.id_mensagem)) {
        byComposite.set(composite, mergeMessages(msg, prevComposite));
      }
      const prevBase = byBase.get(base);
      if (
        prevBase &&
        isTempId(prevBase.id_mensagem) &&
        !isTempId(msg.id_mensagem)
      ) {
        byBase.set(base, mergeMessages(msg, prevBase));
      }
    }
    const merged = new Map<string, Mensagem>();
    for (const m of byComposite.values())
      merged.set(m.id_mensagem || `${buildCompositeKey(m)}-c`, m);
    for (const m of byBase.values()) {
      const tempMatch = Array.from(merged.values()).find(
        (x) => isTempId(x.id_mensagem) && buildBaseKey(x) === buildBaseKey(m)
      );
      if (tempMatch && !isTempId(m.id_mensagem)) {
        merged.delete(tempMatch.id_mensagem);
        merged.set(m.id_mensagem, mergeMessages(m, tempMatch));
      } else if (!Array.from(merged.values()).some((x) => x === m)) {
        merged.set(m.id_mensagem || `${buildCompositeKey(m)}-b`, m);
      }
    }
    return Array.from(merged.values()).sort(
      (a, b) =>
        new Date(a.dataCriacao_Mensagem).getTime() -
        new Date(b.dataCriacao_Mensagem).getTime()
    );
  }
  // Helper: resolve/ensure usuario field for mensagens that come sem 'usuario'
  const ensureUsuario = (m: Mensagem) => {
    if (m && (m as any).usuario && (m as any).usuario.apelido_usuario) return m;
    const fallbackUser = users.find((u) => u.id_usuario === m.fkId_usuario);
    const usuario = fallbackUser
      ? {
          id_usuario: fallbackUser.id_usuario,
          nome_usuario: fallbackUser.nome_usuario,
          apelido_usuario:
            fallbackUser.apelido_usuario || fallbackUser.nome_usuario,
        }
      : {
          id_usuario: m.fkId_usuario,
          nome_usuario: "Usuário",
          apelido_usuario: "Usuário",
        };
    return { ...m, usuario } as Mensagem;
  };
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
    const socket: Socket = io(apiUrl);
    socketRef.current = socket;
    socket.emit("join", grupo.id_grupo);
    socket.on("historico", (msgs: Mensagem[]) => {
      const enriched = (msgs || []).map((m) => {
        const withUser = ensureUsuario(m);
        // Normalizar replyToId para replyTo
        const normalized = {
          ...withUser,
          replyTo: withUser.replyToId || withUser.replyTo || null,
          mensagem: censorBadWords(withUser.mensagem),
        };
        return normalized;
      });
      setMensagens((prev) => dedupeMessages([...prev, ...enriched]));
    });
    socket.on("mensagem_recebida", (msg: Mensagem) => {
      const withUser = ensureUsuario(msg);
      const censored = {
        ...withUser,
        replyTo: withUser.replyToId || withUser.replyTo || null,
        mensagem: censorBadWords(withUser.mensagem),
      };
      setMensagens((prev) => dedupeMessages([...prev, censored]));
    });

    // Eventos de digitação
    socket.on("user_typing", ({ userId }: { userId: string }) => {
      console.log(
        "🔵 user_typing recebido:",
        userId,
        "meu ID:",
        id_usuario_logado
      );
      if (userId !== id_usuario_logado) {
        setUsersTyping((prev) => new Set(prev).add(userId));
      }
    });

    socket.on("user_stop_typing", ({ userId }: { userId: string }) => {
      console.log("🔴 user_stop_typing recebido:", userId);
      setUsersTyping((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket.disconnect();
    };
  }, [grupo.id_grupo]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [mensagens, usersTyping]);

  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

  return (
    <div
      className="flex justify-center px-4 md:max-w-[980px]"
      style={{ paddingTop: headerHeight + 32 }}
    >
      {/* Container sem max-width após breakpoint (tablet) */}
      <div className="w-full max-w-3xl md:max-w-none md:w-full bg-white rounded-2xl shadow-md border border-zinc-200 px-6 py-6 flex flex-col gap-6 transition-all">
        {/* Header do Grupo - Modernizado */}
        <div className="p-6 sm:p-8 -mx-6 -mt-6 border-b border-purple-100/60 bg-gradient-to-r from-purple-50/30 via-white to-fuchsia-50/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Ícone do grupo */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-md flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>

              {/* Título e info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 truncate flex items-center gap-2">
                  {grupo.nome_grupo}
                  {isOwner && (
                    <span title="Você é o criador">
                      <Crown className="w-5 h-5 text-yellow-500" />
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {(grupoData?.membros || []).length}{" "}
                  {(grupoData?.membros || []).length === 1
                    ? "membro"
                    : "membros"}
                </p>
              </div>
            </div>

            {/* Ações (menu de três pontinhos) */}
            <div className="relative flex-shrink-0" ref={menuRef}>
              <motion.button
                type="button"
                aria-label="Opções do grupo"
                onClick={() => setMenuOpen((v) => !v)}
                className="w-10 h-10 rounded-full bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-purple-700 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <EllipsisVertical className="w-5 h-5" />
              </motion.button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg z-20 overflow-hidden"
                  >
                    <button
                      disabled={!isOwner}
                      title={
                        !isOwner
                          ? "Somente o criador pode editar o nome"
                          : undefined
                      }
                      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                        isOwner
                          ? "hover:bg-zinc-50 cursor-pointer"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (!isOwner) return;
                        setEditNameOpen(true);
                        setMenuOpen(false);
                      }}
                    >
                      <PencilIcon className="h-4 w-4" /> Editar nome
                    </button>
                    <button
                      disabled={id_usuario_logado !== grupo.fkId_usuario}
                      title={
                        id_usuario_logado !== grupo.fkId_usuario
                          ? "Somente o criador do grupo pode adicionar membros"
                          : undefined
                      }
                      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                        id_usuario_logado !== grupo.fkId_usuario
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-zinc-50 cursor-pointer"
                      }`}
                      onClick={() => {
                        if (id_usuario_logado !== grupo.fkId_usuario) return;
                        setOpen(true);
                        setMenuOpen(false);
                      }}
                    >
                      <PlusIcon className="h-4 w-4" /> Adicionar membros
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        setMenuOpen(false);
                        setConfirmAction(isOwner ? "delete" : "leave");
                        setConfirmOpen(true);
                      }}
                    >
                      {isOwner ? (
                        <>
                          <Trash2 className="w-4 h-4" /> Excluir grupo
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4" /> Sair do grupo
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Dialog: Confirmação sair / excluir */}
        <Dialog
          open={confirmOpen}
          onOpenChange={(v) => {
            if (!v) {
              setConfirmOpen(false);
              setConfirmAction(null);
              setConfirmError(null);
            } else {
              setConfirmOpen(true);
            }
          }}
        >
          <DialogContent className="w-[calc(100vw-2rem)] sm:w-auto max-w-sm rounded-2xl p-6 bg-white dark:bg-slate-900 border border-red-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                {confirmAction === "delete" ? "Excluir grupo" : "Sair do grupo"}
              </DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg border border-red-100 bg-red-50/70 px-3 py-2 text-[var(--foreground)] flex gap-2 items-start"
            >
              <Info className="w-4 h-4 mt-0.5 text-red-600" />
              <p className="text-xs sm:text-sm">
                {confirmAction === "delete" ? (
                  <>
                    Esta ação irá remover o grupo e todas as mensagens. Não
                    poderá ser desfeita.
                  </>
                ) : (
                  <>
                    Você sairá do grupo. Para retornar será necessário convite
                    do criador.
                  </>
                )}
              </p>
            </motion.div>
            {confirmError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-600 mb-3"
              >
                {confirmError}
              </motion.p>
            )}
            <DialogFooter className="pt-2">
              <div className="flex items-center justify-between w-full gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmOpen(false);
                    setConfirmAction(null);
                    setConfirmError(null);
                  }}
                  className="text-sm cursor-pointer text-zinc-600 hover:text-zinc-800 transition"
                >
                  Cancelar
                </button>
                <ActionButton
                  type="button"
                  onClick={() => handleDeleteOrLeaveGroup()}
                  textIdle={
                    confirmAction === "delete"
                      ? deleteGrupoMutation.isPending
                        ? "Excluindo..."
                        : "Confirmar exclusão"
                      : leaveGroupMutation.isPending
                      ? "Saindo..."
                      : "Confirmar saída"
                  }
                  isLoading={
                    deleteGrupoMutation.isPending ||
                    leaveGroupMutation.isPending
                  }
                  isSuccess={false}
                  enableRipplePulse
                  disabled={
                    deleteGrupoMutation.isPending ||
                    leaveGroupMutation.isPending ||
                    !confirmAction
                  }
                  className="min-w-[160px] cursor-pointer bg-gradient-to-r from-red-600 to-rose-600"
                />
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Editar nome */}
        <Dialog open={editNameOpen} onOpenChange={setEditNameOpen}>
          <DialogContent className="w-[calc(100vw-2rem)] sm:w-auto max-w-sm sm:max-w-md md:max-w-lg rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-purple-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Editar nome do grupo
              </DialogTitle>
            </DialogHeader>

            {/* Aviso de orientação, padronizado com o modal de usuário */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg border border-purple-100 bg-purple-50/60 px-3 py-2 flex gap-2"
            >
              <Info className="w-4 h-4 mt-0.5 text-purple-600" />
              <p className="text-xs sm:text-sm text-[var(--foreground)]">
                Altere o nome do grupo. Evite palavrões ou conteúdo ofensivo —
                podemos aplicar bloqueios.
              </p>

              <div>
                <p className="text-[10px] sm:text-xs text-zinc-500 mt-1">
                  A alteração pode levar alguns instantes para refletir em todos
                  os lugares.
                </p>
              </div>
            </motion.div>

            {/* Campo de nome com validação animada */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => {
                    const v = e.target.value;
                    setNovoNome(v);
                    if (!nomeDirty) setNomeDirty(true);
                    setIsCheckingName(true);
                    setNomeError(null);
                    if (editSuccess) setEditSuccess(false);
                  }}
                  placeholder="Digitar novo nome do grupo"
                  className={`w-full border rounded-md p-2 pr-10 focus:outline-none focus:ring-2 transition ${
                    nomeError
                      ? "border-red-500 focus:ring-red-400"
                      : "border-zinc-300 focus:ring-purple-500"
                  }`}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <AnimatePresence initial={false} mode="wait">
                    {nomeDirty && isCheckingName && !nomeError && (
                      <motion.div
                        key="checking"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        className="text-purple-600"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </motion.div>
                    )}
                    {nomeDirty &&
                      !isCheckingName &&
                      !nomeError &&
                      novoNome.trim() && (
                        <motion.div
                          key="valid"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          className="text-emerald-600"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </motion.div>
                      )}
                    {nomeDirty && !isCheckingName && nomeError && (
                      <motion.div
                        key="invalid"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        className="text-red-600"
                      >
                        <XCircle className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="min-h-[22px]">
                <AnimatePresence mode="wait" initial={false}>
                  {nomeDirty && isCheckingName && !nomeError && (
                    <motion.p
                      key="checking-text"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-[11px] text-purple-600 flex items-center gap-1"
                    >
                      Verificando...
                    </motion.p>
                  )}
                  {nomeDirty &&
                    !isCheckingName &&
                    !nomeError &&
                    novoNome.trim() && (
                      <motion.p
                        key="valid-text"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-[11px] text-emerald-600 flex items-center gap-1"
                      >
                        Nome válido
                      </motion.p>
                    )}
                  {nomeDirty && !isCheckingName && nomeError && (
                    <motion.p
                      key="invalid-text"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-[11px] text-red-600"
                    >
                      {nomeError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Feedback de sucesso visual */}
            {editSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800 text-sm"
              >
                Nome atualizado!
              </motion.div>
            )}

            <DialogFooter className="pt-4">
              <div className="flex items-center justify-between w-full gap-3">
                <button
                  type="button"
                  onClick={() => setEditNameOpen(false)}
                  className="text-sm cursor-pointer text-zinc-600 hover:text-zinc-800 transition"
                >
                  Cancelar
                </button>
                <ActionButton
                  type="button"
                  onClick={async () => {
                    if (
                      !isOwner ||
                      nomeError ||
                      !novoNome.trim() ||
                      isCheckingName
                    )
                      return;
                    updateGrupoMutation.mutate(
                      { id: grupo.id_grupo, nome_grupo: novoNome } as any,
                      {
                        onSuccess: () => {
                          setGrupo((g) => ({ ...g, nome_grupo: novoNome }));
                          setEditSuccess(true);
                          setTimeout(() => {
                            setEditSuccess(false);
                            setEditNameOpen(false);
                          }, 1200);
                        },
                        onError: (error: any) => {
                          const backendMsg =
                            error?.response?.data?.error ||
                            error?.message ||
                            "Erro ao atualizar nome";
                          setNomeError(backendMsg);
                          setEditSuccess(false);
                        },
                      }
                    );
                  }}
                  textIdle={
                    updateGrupoMutation.isPending
                      ? "Salvando..."
                      : "Salvar alterações"
                  }
                  isLoading={updateGrupoMutation.isPending}
                  isSuccess={editSuccess}
                  disabled={
                    !isOwner ||
                    !!nomeError ||
                    !novoNome.trim() ||
                    isCheckingName
                  }
                  enableRipplePulse
                  className="min-w-[160px]"
                />
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Adicionar membros */}
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (v) setSelectedUserIds([]); // reset seleção ao abrir
          }}
        >
          <DialogContent className="w-[calc(100vw-2rem)] sm:w-auto max-w-sm sm:max-w-md md:max-w-lg rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-purple-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Adicionar membros ao grupo
              </DialogTitle>
            </DialogHeader>

            {/* Aviso informativo, como no modal de perfil */}

            {/* Combobox */}
            <div className="space-y-2">
              <MultiSelectCombobox
                items={users
                  .filter(
                    (u) =>
                      !(grupoData?.membros || []).some(
                        (m: Membro) => m.usuario.id_usuario === u.id_usuario
                      )
                  )
                  .map((u) => ({ id: u.id_usuario, ...u }))}
                selectedIds={selectedUserIds}
                setSelectedIds={setSelectedUserIds}
                placeholder="Selecionar membros"
                getLabel={(u) => u.nome_usuario}
              />
              <div className="flex items-center justify-between">
                <p className="text-[11px] sm:text-xs text-zinc-500">
                  Membros já pertencentes ao grupo foram ocultados desta lista.
                </p>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <div className="flex items-center justify-between w-full gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm cursor-pointer text-zinc-600 hover:text-zinc-800 transition"
                >
                  Cancelar
                </button>
                <ActionButton
                  type="button"
                  onClick={handleAddMembers}
                  textIdle={
                    updateGrupoMutation.isPending
                      ? "Adicionando..."
                      : "Adicionar"
                  }
                  isLoading={updateGrupoMutation.isPending}
                  isSuccess={false}
                  enableRipplePulse
                  disabled={
                    updateGrupoMutation.isPending ||
                    selectedUserIds.length === 0
                  }
                  className="cursor-pointer min-w-[140px]"
                />
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Layout em duas colunas: esquerda (info) + direita (chat) */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
          {/* Coluna esquerda: membros */}
          <div className="space-y-4">
            {/* Card dos Membros (com criador no topo) */}
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3">
                Membros ({(grupoData?.membros || []).length})
              </h2>
              {(() => {
                // Pega todos os membros exceto o criador
                const otherMembers = (grupoData?.membros || []).filter(
                  (m) => m.usuario.id_usuario !== grupo.fkId_usuario
                );

                // Ordena os outros membros
                const sortedOthers = otherMembers.sort((a, b) =>
                  a.usuario.apelido_usuario.localeCompare(
                    b.usuario.apelido_usuario,
                    "pt-BR",
                    { sensitivity: "base" }
                  )
                );

                // Cria array com criador primeiro
                const creatorMember = (grupoData?.membros || []).find(
                  (m) => m.usuario.id_usuario === grupo.fkId_usuario
                );

                const allMembersSorted = creatorMember
                  ? [creatorMember, ...sortedOthers]
                  : sortedOthers;

                const limit = 3;
                const shouldCollapse = allMembersSorted.length > limit;
                const visible = showAllMembers
                  ? allMembersSorted
                  : allMembersSorted.slice(0, limit);

                return (
                  <div className="flex flex-col gap-2">
                    <AnimatePresence initial={false}>
                      {visible.map((membro) => {
                        const isCreator =
                          membro.usuario.id_usuario === grupo.fkId_usuario;
                        return (
                          <motion.div
                            key={membro.id_membro}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group"
                          >
                            {/* Foto com coroa para o criador */}
                            <div className="relative flex-shrink-0">
                              {isCreator && (
                                <div className="absolute -top-1 -right-1 z-10">
                                  <Crown className="w-3 h-3 animate-accordion-down rotate-45 text-yellow-500 drop-shadow-md" />
                                </div>
                              )}
                              {membro.usuario.foto_perfil ? (
                                <img
                                  src={membro.usuario.foto_perfil}
                                  alt={membro.usuario.nome_usuario}
                                  className="w-10 h-10 rounded-full object-cover border border-gray-200 group-hover:border-purple-300 transition-colors"
                                />
                              ) : (
                                <UserCircleIcon className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {membro.usuario.nome_usuario}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                @{membro.usuario.apelido_usuario}
                              </p>
                            </div>

                            {isOwner && !isCreator && (
                              <button
                                className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() =>
                                  handleRemoveMember(membro.id_membro)
                                }
                                disabled={removeMemberMutation.isPending}
                              >
                                {removeMemberMutation.isPending
                                  ? "..."
                                  : "Remover"}
                              </button>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {shouldCollapse && (
                      <motion.button
                        type="button"
                        onClick={() => setShowAllMembers((v) => !v)}
                        className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-800 transition flex items-center gap-1 cursor-pointer"
                        whileHover={{ x: 3 }}
                      >
                        <span>
                          {showAllMembers
                            ? "Mostrar menos"
                            : `Ver todos (${allMembersSorted.length})`}
                        </span>
                        <motion.span
                          animate={{ rotate: showAllMembers ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="inline-block text-xs"
                        >
                          ▾
                        </motion.span>
                      </motion.button>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Coluna direita: Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="font-semibold text-lg text-gray-800 mb-3">
              Chat do grupo
            </h2>
            {/* Área de mensagens com watermark sutil */}
            <div
              className="relative border border-zinc-200 rounded-lg p-4 overflow-y-auto transition-[height] group h-72 md:h-80 xl:h-96"
              style={{
                backgroundImage: `url(${pawTileLight})`,
                backgroundRepeat: "repeat",
                backgroundColor: "#fafafa",
              }}
            >
              <AnimatePresence initial={false}>
                {mensagens.map((m) => {
                  const isMine = m.fkId_usuario === id_usuario_logado;
                  const quoted = m.replyTo
                    ? mensagens.find((orig) => orig.id_mensagem === m.replyTo)
                    : null;
                  const displayUsuario =
                    (m as any).usuario ||
                    (users.find((u) => u.id_usuario === m.fkId_usuario)
                      ? {
                          id_usuario: m.fkId_usuario,
                          nome_usuario: users.find(
                            (u) => u.id_usuario === m.fkId_usuario
                          )!.nome_usuario,
                          apelido_usuario:
                            users.find((u) => u.id_usuario === m.fkId_usuario)!
                              .apelido_usuario ||
                            users.find((u) => u.id_usuario === m.fkId_usuario)!
                              .nome_usuario,
                        }
                      : {
                          id_usuario: m.fkId_usuario,
                          nome_usuario: "Usuário",
                          apelido_usuario: "Usuário",
                        });
                  return (
                    <motion.div
                      key={m.id_mensagem}
                      initial={{
                        opacity: 0,
                        scale: 0.3,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                        transition: { duration: 0.15 },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        mass: 0.8,
                      }}
                      className={`mb-2 flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`relative group/msg ${
                          isMine ? "pl-8" : "pr-8"
                        } max-w-[85%] md:max-w-[75%]`}
                      >
                        <motion.button
                          type="button"
                          aria-label="Responder mensagem"
                          className={`absolute ${
                            isMine ? "left-0" : "right-0"
                          } top-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-purple-200/50 text-purple-600 hover:text-purple-700 hover:bg-purple-50 cursor-pointer transition-all opacity-0 group-hover/msg:opacity-100 shadow-sm hover:shadow-md`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplyTarget(m);
                          }}
                          title="Responder"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <CornerUpLeft className="w-4 h-4" />
                        </motion.button>
                        <motion.div
                          className={`px-4 py-2.5 rounded-2xl break-words overflow-wrap-anywhere ${
                            quoted ? "min-w-[12rem]" : "min-w-[5rem]"
                          } ${
                            isMine
                              ? "bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white rounded-tr-md"
                              : "bg-white text-gray-800 border border-gray-100 rounded-tl-md"
                          }`}
                          style={{
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                          }}
                          initial={{
                            scale: 0.85,
                            boxShadow: "0 0 0 rgba(0,0,0,0)",
                          }}
                          animate={{
                            scale: 1,
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 18,
                            delay: 0.05,
                          }}
                          whileHover={{
                            scale: 1.02,
                            boxShadow:
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            transition: { duration: 0.2 },
                          }}
                        >
                          {quoted && (
                            <div
                              className={`mb-2 px-3 py-2 rounded-xl border-l-[6px] min-h-[3rem] flex flex-col justify-center ${
                                isMine
                                  ? "border-white/80 bg-white/30 backdrop-blur-sm"
                                  : "border-purple-600 bg-purple-200"
                              }`}
                            >
                              <div
                                className={`text-xs font-semibold mb-0.5 ${
                                  isMine ? "text-white" : "text-purple-900"
                                }`}
                              >
                                {(quoted as any).usuario?.apelido_usuario ||
                                  users.find(
                                    (u) => u.id_usuario === quoted.fkId_usuario
                                  )?.apelido_usuario ||
                                  users.find(
                                    (u) => u.id_usuario === quoted.fkId_usuario
                                  )?.nome_usuario ||
                                  "Usuário"}
                              </div>
                              <div
                                className={`text-xs line-clamp-2 ${
                                  isMine ? "text-white/90" : "text-gray-700"
                                }`}
                              >
                                {quoted.mensagem}
                              </div>
                            </div>
                          )}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="flex flex-col gap-1"
                          >
                            <div
                              className="break-words"
                              style={{
                                wordBreak: "break-word",
                                overflowWrap: "anywhere",
                              }}
                            >
                              <span className="font-semibold text-sm mr-1 whitespace-nowrap">
                                {displayUsuario.apelido_usuario}:
                              </span>
                              <span className="text-sm leading-snug">
                                {m.mensagem}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] ${
                                isMine ? "text-white/60" : "text-gray-400"
                              } text-right`}
                            >
                              {new Date(
                                m.dataCriacao_Mensagem
                              ).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Indicador de digitação */}
                {usersTyping.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.3, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="mb-3 flex justify-start"
                  >
                    <motion.div
                      className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-md shadow-sm"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 18,
                        delay: 0.05,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 bg-purple-400 rounded-full"
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-purple-400 rounded-full"
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              ease: [0.4, 0, 0.2, 1],
                              delay: 0.15,
                            }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-purple-400 rounded-full"
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              ease: [0.4, 0, 0.2, 1],
                              delay: 0.3,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Array.from(usersTyping)
                            .map(
                              (uid) =>
                                users.find((u) => u.id_usuario === uid)
                                  ?.apelido_usuario ||
                                users.find((u) => u.id_usuario === uid)
                                  ?.nome_usuario ||
                                "Alguém"
                            )
                            .join(", ")}{" "}
                          {usersTyping.size === 1
                            ? "está digitando..."
                            : "estão digitando..."}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Barra de resposta ao usuário */}
            <AnimatePresence>
              {replyTarget && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  className="mt-2 mb-1 flex items-stretch border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="px-4 py-2.5 flex-1 min-w-0">
                    <div className="text-xs font-bold text-purple-700 mb-0.5">
                      Respondendo a {replyTarget.usuario.apelido_usuario}
                    </div>
                    <div className="text-sm text-gray-700 max-h-10 overflow-hidden line-clamp-2">
                      {replyTarget.mensagem}
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Cancelar resposta"
                    className="px-3 text-purple-600 hover:text-purple-700 hover:bg-purple-100/50 cursor-pointer transition-colors"
                    onClick={() => setReplyTarget(null)}
                    title="Cancelar resposta"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input + Enviar */}
            <div className="flex flex-col gap-2 mt-3">
              <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    maxLength={MAX_CHARS}
                    className={`w-full h-11 px-4 py-2.5 border-2 rounded-xl focus:outline-none transition-all ${
                      charCount > MAX_CHARS
                        ? "border-red-400 focus:border-red-500 bg-red-50/30"
                        : "border-purple-200 focus:border-purple-500 bg-white hover:border-purple-300"
                    } shadow-sm focus:shadow-md`}
                    placeholder="Digite sua mensagem..."
                    value={novaMensagem}
                    onChange={(e) => {
                      setNovaMensagem(e.target.value);
                      if (chatError) setChatError(null);

                      // Emitir evento de digitação
                      console.log(
                        "⌨️ Emitindo typing para grupo:",
                        grupo.id_grupo
                      );
                      socketRef.current?.emit("typing", {
                        userId: id_usuario_logado,
                        grupoId: grupo.id_grupo,
                      });

                      // Resetar timeout de parar de digitar
                      if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                      }

                      typingTimeoutRef.current = setTimeout(() => {
                        console.log("⏹️ Emitindo stop_typing");
                        socketRef.current?.emit("stop_typing", {
                          userId: id_usuario_logado,
                          grupoId: grupo.id_grupo,
                        });
                      }, 10000);
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !sending && handleEnviarMensagem()
                    }
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={() => {
                    const text = novaMensagem.trim();
                    if (!text || sending || charCount > MAX_CHARS) return;
                    handleEnviarMensagem();
                  }}
                  disabled={
                    sending || !novaMensagem.trim() || charCount > MAX_CHARS
                  }
                  className="h-11 flex items-center justify-center bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-5 rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer overflow-hidden group relative min-w-[100px]"
                  whileHover={{ scale: sending ? 1 : 1.02 }}
                  whileTap={{ scale: sending ? 1 : 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={
                        sending ? "sending" : sendSuccess ? "success" : "idle"
                      }
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-sm font-semibold"
                    >
                      {sendSuccess ? (
                        <span className="flex items-center gap-1.5">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Enviado
                        </span>
                      ) : (
                        <>
                          <motion.span
                            animate={
                              sending
                                ? { x: [0, 4, -3, 0], rotate: [0, 10, -8, 0] }
                                : {}
                            }
                            transition={{
                              duration: 0.5,
                              repeat: sending ? Infinity : 0,
                              ease: "easeInOut",
                            }}
                          >
                            <Send className="w-5 h-5" />
                          </motion.span>
                          <span>Enviar</span>
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>

                  {sending && (
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.3, 0.1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              </div>
              <div className="flex items-center justify-between px-1">
                {chatError && (
                  <p className="text-xs text-red-600 font-medium">
                    {chatError}
                  </p>
                )}
                <p
                  className={`text-xs ml-auto ${
                    charCount > MAX_CHARS
                      ? "text-red-600 font-semibold"
                      : charCount > MAX_CHARS * 0.8
                      ? "text-orange-500 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {charCount}/{MAX_CHARS}
                  {charCount > MAX_CHARS && (
                    <span className="ml-1">
                      — remova {charCount - MAX_CHARS}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* fim container */}
    </div>
  );
}
