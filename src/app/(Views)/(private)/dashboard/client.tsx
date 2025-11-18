"use client";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRespostas } from "@/services/respostaService";
import {
  Plus,
  FileWarning,
  LayoutDashboard,
  Users2,
  BookOpen,
  Puzzle,
  Layers,
  History,
  Search,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  Archive,
  Gavel,
  Filter as FilterIcon,
} from "lucide-react";
import { Info } from "lucide-react";
import { motion } from "framer-motion";

// Implementação local simples de debounce para remover dependência externa
function debounce<F extends (...args: any[]) => void>(fn: F, wait = 450) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<F>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
import { SignUpCursoModal } from "./Create-modals/curso";
import { SignUpComponenteModal } from "./Create-modals/componente";
import { SignUpUserModal } from "./Create-modals/usuario";
import { Denuncia } from "@/types/denuncia";
import { Curso } from "@/types/curso";
import { Componente } from "@/types/componente";
import { User } from "@/types/user";
import { Pergunta } from "@/types/pergunta";
import { Resposta } from "@/types/resposta";
import { Grupo } from "@/types/grupo";
import { PenalidadeModal } from "./Create-modals/penalidade";
import { useToast } from "@/components/ui/animatedToast";
import { jwtDecode } from "jwt-decode";
interface DecodedToken {
  id_usuario?: string;
  tipo_usuario?: string;
}
import { isAdmin, isAdminEmail } from "@/lib/roles";
import { ActionButton } from "@/components/ui/actionButton";
import { filtrarTexto } from "@/utils/filterText";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export default function DashboardPage({
  cursos = [],
  componentes = [],
  users = [],
  perguntas = [],
  respostas = [],
  grupos = [],
  denuncias = [],
  tipousuario = [],
}: any) {
  const [openDialog, setOpenDialog] = useState<
    null | "curso" | "componente" | "usuario"
  >(null);
  const [openPenalidade, setOpenPenalidade] = useState(false);
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(
    null
  );
  const { push } = useToast();

  const [cursosState, setCursosState] = useState<Curso[]>(cursos || []);
  const [componentesState, setComponentesState] = useState<Componente[]>(
    componentes || []
  );
  const [usersState, setUsersState] = useState<User[]>(users || []);
  const [perguntasState, setPerguntasState] = useState<Pergunta[]>(
    perguntas || []
  );
  const [respostasState, setRespostasState] = useState<Resposta[]>(
    respostas || []
  );
  const [gruposState, setGruposState] = useState<Grupo[]>(grupos || []);
  const [denunciasState, setDenunciasState] = useState<Denuncia[]>(
    denuncias || []
  );
  // keep respostas in sync with other parts of the app using react-query
  const respostasQuery = useQuery<Resposta[]>({
    queryKey: ["respostas"],
    queryFn: fetchRespostas,
    initialData: respostas || [],
  });

  useEffect(() => {
    if (respostasQuery.data) setRespostasState(respostasQuery.data);
  }, [respostasQuery.data]);

  // filtros para seção de denúncias (declarados próximo ao estado de denuncias)
  const [filtroStatus, setFiltroStatus] = useState<string>("");

  const reporterName = useMemo(() => {
    if (!selectedDenuncia) return "Você";
    const denUser = (selectedDenuncia as any).usuario;
    let reporter: any = denUser;
    if (!reporter || !reporter.nome_usuario) {
      const possibleIds = [
        (selectedDenuncia as any).fkId_usuario,
        (selectedDenuncia as any).fkId_usuario_denunciante,
        (selectedDenuncia as any).fkId_usuario_criador,
        (selectedDenuncia as any).fkId_usuario_conteudo,
        (selectedDenuncia as any).fkId_usuarioCriador,
      ];
      const id = possibleIds.find(Boolean);
      if (id) {
        reporter = usersState.find((u) => String(u.id_usuario) === String(id));
      }
    }
    return reporter
      ? `${reporter.nome_usuario ?? reporter.apelido_usuario}${
          reporter.apelido_usuario && reporter.nome_usuario
            ? ` (${reporter.apelido_usuario})`
            : ""
        }`
      : "Você";
  }, [selectedDenuncia, usersState]);

  const victimName = useMemo(() => {
    if (!selectedDenuncia) return "—";
    const possibleVictimIds = [
      (selectedDenuncia as any).fkId_usuario_conteudo,
      (selectedDenuncia as any).fkId_usuario_conteudo_usuario,
      (selectedDenuncia as any).fkId_usuarioCriador,
      (selectedDenuncia as any).fkId_usuario_conteudo_criador,
      (selectedDenuncia as any).fkId_usuario,
    ];
    const victimId = possibleVictimIds.find(Boolean);
    let victim: any = null;
    if (victimId)
      victim = usersState.find(
        (u) => String(u.id_usuario) === String(victimId)
      );
    return victim
      ? `${victim.nome_usuario ?? victim.apelido_usuario}${
          victim.apelido_usuario && victim.nome_usuario
            ? ` (${victim.apelido_usuario})`
            : ""
        }`
      : (selectedDenuncia as any).tipo_conteudo ?? "—";
  }, [selectedDenuncia, usersState]);

  // local audit log for simple session auditing
  const [auditLog, setAuditLog] = useState<any[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("auditLog");
      if (raw) setAuditLog(JSON.parse(raw));
    } catch (e) {}
  }, []);
  const pushAudit = (entry: any) => {
    setAuditLog((prev) => {
      const next = [entry, ...prev].slice(0, 500);
      try {
        localStorage.setItem("auditLog", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const [conteudoRevisado, setConteudoRevisado] = useState<null | {
    tipo?: string;
    texto?: string;
  }>(null);
  const perguntasSorted = useMemo(
    () =>
      [...perguntasState].sort((a, b) =>
        a.pergunta.localeCompare(b.pergunta, "pt-BR")
      ),
    [perguntasState]
  );
  const respostasSorted = useMemo(
    () =>
      [...respostasState].sort((a, b) => {
        const da = a.dataCriacao_resposta
          ? new Date(a.dataCriacao_resposta).getTime()
          : 0;
        const db = b.dataCriacao_resposta
          ? new Date(b.dataCriacao_resposta).getTime()
          : 0;
        return db - da;
      }),
    [respostasState]
  );
  const gruposSorted = useMemo(
    () =>
      [...gruposState].sort((a, b) =>
        a.nome_grupo.localeCompare(b.nome_grupo, "pt-BR")
      ),
    [gruposState]
  );

  // Derived sorted lists used in multiple places
  const cursosSorted = useMemo(
    () =>
      [...cursosState].sort((a, b) =>
        a.nome_curso.localeCompare(b.nome_curso, "pt-BR")
      ),
    [cursosState]
  );
  const componentesSorted = useMemo(
    () =>
      [...componentesState].sort((a, b) =>
        a.nome_componente.localeCompare(b.nome_componente, "pt-BR")
      ),
    [componentesState]
  );
  const usuariosSorted = useMemo(
    () =>
      [...usersState].sort((a, b) =>
        a.nome_usuario.localeCompare(b.nome_usuario, "pt-BR")
      ),
    [usersState]
  );

  // modal/drawer flags
  const [openAnalise, setOpenAnalise] = useState(false);
  const [openAudit, setOpenAudit] = useState(false);
  // action states for analysis modal buttons
  const [arquivarLoading, setArquivarLoading] = useState(false);
  const [arquivarSuccess, setArquivarSuccess] = useState(false);
  const [penalidadeLoading, setPenalidadeLoading] = useState(false);
  const [penalidadeSuccess, setPenalidadeSuccess] = useState(false);
  const [penalidadeUsuarioNome, setPenalidadeUsuarioNome] = useState<
    string | undefined
  >(undefined);

  // Filtragem simples de denúncias (placeholder — preserva comportamento while we keep filters minimal)
  const [filtroTipoDenuncia, setFiltroTipoDenuncia] = useState<string>("");
  const [filtroDenunciaQuery, setFiltroDenunciaQuery] = useState<string>("");
  const tipoDenunciaExistentes = useMemo(
    () =>
      Array.from(
        new Set(
          denunciasState
            .map((d: any) => (d.tipo_denuncia || "").toString())
            .filter(Boolean)
        )
      ),
    [denunciasState]
  );

  const denunciasFiltradas = useMemo(() => {
    const q = (filtroDenunciaQuery || "").toString().trim().toLowerCase();
    let list = [...denunciasState];

    // apply basic filters from section controls
    if (filtroStatus) {
      list = list.filter((d: any) => String(d.status) === String(filtroStatus));
    }
    // filtroNivel and filtroUsuario removed per UX request
    if (filtroTipoDenuncia) {
      list = list.filter((d: any) => {
        const tipo = (
          d.tipo_denuncia ||
          d.tipo_conteudo ||
          d.tipo ||
          ""
        ).toString();
        return String(tipo) === String(filtroTipoDenuncia);
      });
    }

    if (q) {
      list = list.filter((d: any) => {
        // Build the same title text used in the card: "Nova denúncia de ${nome} ${apelido}"
        // Prefer nested `usuario` object, otherwise try common fk id fields to lookup in usersState
        const denUser = d.usuario;
        let reporter: any = denUser;
        if (!reporter || !reporter.nome_usuario) {
          const possibleIds = [
            d.fkId_usuario,
            d.fkId_usuario_denunciante,
            d.fkId_usuario_criador,
            d.fkId_usuario_conteudo,
            d.fkId_usuarioCriador,
          ];
          const id = possibleIds.find(Boolean);
          if (id) {
            reporter = usersState.find(
              (u: any) => String(u.id_usuario) === String(id)
            );
          }
        }

        const nome = (
          reporter?.nome_usuario ??
          reporter?.apelido_usuario ??
          "—"
        ).toString();
        const apelido = reporter?.apelido_usuario
          ? `(${reporter.apelido_usuario})`
          : "";
        const title = `Nova denúncia de ${nome} ${apelido}`.toLowerCase();
        return title.includes(q);
      });
    }

    // Sort: pendentes first, then by dataCriacao_denuncia (order of arrival: oldest first)
    list.sort((a: any, b: any) => {
      const priority = (s: string) => (s === "pendente" ? 0 : 1);
      const pa = priority(a.status || "");
      const pb = priority(b.status || "");
      if (pa !== pb) return pa - pb;
      const da = a.dataCriacao_denuncia
        ? new Date(a.dataCriacao_denuncia).getTime()
        : 0;
      const db = b.dataCriacao_denuncia
        ? new Date(b.dataCriacao_denuncia).getTime()
        : 0;
      return da - db;
    });

    return list;
  }, [
    denunciasState,
    filtroStatus,
    filtroTipoDenuncia,
    filtroDenunciaQuery,
    perguntasState,
    respostasState,
    usersState,
  ]);

  // ---------------- GLOBAL SEARCH BAR -----------------
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDomain, setSearchDomain] = useState<
    "usuarios" | "grupos" | "cursos" | "componentes" | "perguntas" | "respostas"
  >("usuarios");
  const [onlyMyPerguntas, setOnlyMyPerguntas] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchTipoUsuario, setSearchTipoUsuario] = useState<string>("");
  const [searchCursoFiltro, setSearchCursoFiltro] = useState<string>("");
  const [searchPage, setSearchPage] = useState(1);
  const pageSize = 20;

  const getTipoNome = (fkId: string | undefined) => {
    if (!fkId) return "";
    const item: any = tipousuario.find((t: any) => {
      const rawId =
        t.id_tipousuario ??
        t.id_tipoUsuario ??
        t.id_tipo_usuario ??
        t.id ??
        t.pkId_tipoUsuario;
      return String(rawId) === String(fkId);
    });
    const nome =
      item?.nome_tipousuario ??
      item?.nomeTipoUsuario ??
      item?.nome ??
      item?.descricao;
    return (nome || "").toString();
  };

  // read current user id from token cookie (client-side)
  useEffect(() => {
    try {
      const token = document.cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];
      if (token) {
        try {
          const decoded: any = jwtDecode(token as string) as DecodedToken;
          setCurrentUserId(decoded?.id_usuario || null);
        } catch (e) {
          setCurrentUserId(null);
        }
      } else {
        setCurrentUserId(null);
      }
    } catch (e) {
      setCurrentUserId(null);
    }
  }, []);

  const filteredSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [] as any[];
    switch (searchDomain) {
      case "usuarios": {
        return usuariosSorted.filter((u) => {
          if (searchTipoUsuario) {
            const tipoNome = getTipoNome(u.fkIdTipoUsuario).toLowerCase();
            if (!tipoNome.includes(searchTipoUsuario.toLowerCase()))
              return false;
          }
          return (
            u.nome_usuario.toLowerCase().includes(q) ||
            u.email_usuario.toLowerCase().includes(q) ||
            u.apelido_usuario.toLowerCase().includes(q)
          );
        });
      }
      case "grupos":
        return gruposSorted.filter((g) =>
          g.nome_grupo.toLowerCase().includes(q)
        );
      case "componentes":
        return componentesSorted.filter((c) => {
          const nomeMatch = c.nome_componente.toLowerCase().includes(q);
          const cursoMatch =
            !searchCursoFiltro || c.curso?.id_curso === searchCursoFiltro;
          return nomeMatch && cursoMatch;
        });
      case "perguntas":
        return perguntasSorted.filter((p) => {
          const matchesQuery = p.pergunta.toLowerCase().includes(q);
          if (!matchesQuery) return false;
          if (onlyMyPerguntas) {
            const ownerId = p.fkId_usuario || p.usuario?.id_usuario;
            return String(ownerId) === String(currentUserId);
          }
          return true;
        });
      case "respostas":
        return respostasSorted.filter((r) => {
          const text = (r.resposta || "").toString().toLowerCase();
          const author = (
            r.usuario?.nome_usuario ||
            r.usuario?.apelido_usuario ||
            ""
          )
            .toString()
            .toLowerCase();
          const pergunta = perguntasState.find(
            (p) => String(p.id_pergunta) === String(r.fkId_pergunta)
          );
          const perguntaText = pergunta ? pergunta.pergunta.toLowerCase() : "";
          return (
            text.includes(q) || author.includes(q) || perguntaText.includes(q)
          );
        });

      default:
        return [];
    }
  }, [
    searchQuery,
    searchDomain,
    searchTipoUsuario,
    usuariosSorted,
    gruposSorted,
    cursosSorted,
    componentesSorted,
    perguntasSorted,
    onlyMyPerguntas,
    currentUserId,
  ]);

  useEffect(() => {
    setSearchPage(1);
  }, [searchQuery, searchDomain, searchTipoUsuario]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSearchResults.length / pageSize)
  );
  const pagedResults = filteredSearchResults.slice(
    (searchPage - 1) * pageSize,
    searchPage * pageSize
  );

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el)
      (el as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const highlight = (text: string, q: string) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + q.length);
    const after = text.slice(idx + q.length);
    return (
      <>
        {before}
        <mark className="bg-yellow-200 text-zinc-900 rounded px-0.5">
          {match}
        </mark>
        {after}
      </>
    );
  };

  const tipoUsuariosDisponiveis = useMemo(() => {
    const nomes = tipousuario.map((t: any) =>
      (t.nome_tipousuario ?? t.nomeTipoUsuario ?? t.nome ?? t.descricao ?? "")
        .toString()
        .toLowerCase()
    );
    return Array.from(new Set(nomes.filter(Boolean)));
  }, [tipousuario]);

  const PlusButtons = [
    {
      name: "Novo curso",
      icon: Plus,
      onClick: () => setOpenDialog("curso"),
    },
    {
      name: "Novo Componente",
      icon: Plus,
      onClick: () => setOpenDialog("componente"),
    },
    {
      name: "Novo Usuário",
      icon: Plus,
      onClick: () => setOpenDialog("usuario"),
    },
  ];

  // Global refresh state
  const [refreshingAll, setRefreshingAll] = useState(false);
  // Smooth navigation + active highlight
  const sectionIds = [
    "dashboard-root",
    "manage-denuncias",
    "manage-cursos",
    "manage-componentes",
    "manage-grupos",
    "manage-usuarios",
  ];

  const [activeSection, setActiveSection] = useState<string>("dashboard-root");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Support opening certain UI from anchor links in the side menu (e.g. #audit, #novo-curso)
  useEffect(() => {
    const handleHash = () => {
      try {
        const h = (window.location.hash || "").replace("#", "");
        if (!h) return;
        if (h === "audit") setOpenAudit(true);
        if (h === "novo-curso") setOpenDialog("curso");
        if (h === "novo-componente") setOpenDialog("componente");
        if (h === "novo-usuario") setOpenDialog("usuario");
      } catch (e) {}
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Observe layout signals (`data-open-audit` and `data-create-key`) to support sidebar callbacks
  useEffect(() => {
    try {
      const wrapper = document.getElementById("dashboard-root-wrapper");
      if (!wrapper) return;
      const mo = new MutationObserver((records) => {
        for (const r of records) {
          if (r.type === "attributes") {
            const attr = r.attributeName;
            if (attr === "data-open-audit") {
              setOpenAudit(true);
              break;
            }
            if (attr === "data-create-key") {
              try {
                const val = wrapper.getAttribute("data-create-key") || "";
                if (val) {
                  const key = String(val).split(":")[0];
                  if (
                    key === "curso" ||
                    key === "componente" ||
                    key === "usuario"
                  ) {
                    setOpenDialog(key as any);
                    // clear the attribute so subsequent changes are detected
                    wrapper.setAttribute("data-create-key", "");
                  }
                }
              } catch (e) {
                // ignore
              }
              break;
            }
          }
        }
      });
      mo.observe(wrapper, {
        attributes: true,
        attributeFilter: ["data-open-audit", "data-create-key"],
      });
      return () => mo.disconnect();
    } catch (e) {
      // ignore
    }
  }, []);
  const handleGlobalRefresh = async () => {
    try {
      setRefreshingAll(true);
      const [
        cursosNew,
        denunciasNew,
        componentesNew,
        usersNew,
        perguntasNew,
        gruposNew,
      ] = await Promise.all([
        import("@/services/cursoService").then((m) => m.fetchCursos()),
        import("@/services/denuncia").then((m) => m.fetchDenuncias()),
        import("@/services/componenteService").then((m) =>
          m.fetchComponentes()
        ),
        import("@/services/userService").then((m) => m.fetchUsers()),
        import("@/services/perguntaService").then((m) => m.fetchPerguntas()),
        import("@/services/grupos/grupoService").then((m) => m.fetchGrupos()),
      ]);
      setCursosState(cursosNew);
      setComponentesState(componentesNew);
      setUsersState(usersNew);
      setPerguntasState(perguntasNew);
      setGruposState(gruposNew);
      setDenunciasState(denunciasNew);
      push({ kind: "success", message: "Dados atualizados." });
    } catch (e: any) {
      push({
        kind: "error",
        message: e?.response?.data?.message || "Falha ao atualizar dados.",
      });
    } finally {
      setRefreshingAll(false);
    }
  };

  const linksNavigation = [
    { name: "Dashboard", icon: LayoutDashboard, href: "#dashboard-root" },
    { name: "Usuários", icon: Users2, href: "#manage-usuarios" },
    { name: "Denúncias", icon: FileWarning, href: "#manage-denuncias" },
    { name: "Cursos", icon: BookOpen, href: "#manage-cursos" },
    { name: "Componentes", icon: Puzzle, href: "#manage-componentes" },
    { name: "Grupos", icon: Layers, href: "#manage-grupos" },
    { name: "Auditoria", icon: History, href: "#audit" },
  ];

  // função de submissão da penalidade (stub)
  const handleSubmitPenalidade = (data: any) => {
    // lógica de envio se necessário
  };

  // Edit states for entities (cursos, componentes, grupos, users)
  const [editCurso, setEditCurso] = useState<Curso | null>(null);
  const [editComponente, setEditComponente] = useState<Componente | null>(null);
  const [editGrupo, setEditGrupo] = useState<Grupo | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingSuccess, setSavingSuccess] = useState(false);

  // Edit user helpers
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserSuccess, setEditUserSuccess] = useState(false);
  const [badNomeUser, setBadNomeUser] = useState(false);
  const [badApelidoUser, setBadApelidoUser] = useState(false);
  const [emailStateEdit, setEmailStateEdit] = useState<{
    checking: boolean;
    exists: boolean;
    touched: boolean;
    error?: string;
    initial?: string;
  }>({ checking: false, exists: false, touched: false, initial: "" });

  const debouncedCheckEmailEdit = useMemo(
    () =>
      debounce(async (value: string) => {
        if (!value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
          setEmailStateEdit((prev) => ({
            ...prev,
            checking: false,
            exists: false,
            error: value ? "Formato de email inválido" : "",
          }));
          return;
        }
        try {
          setEmailStateEdit((prev) => ({
            ...prev,
            checking: true,
            error: undefined,
          }));
          const m = await import("@/services/userService");
          const res = await m.checkEmail(value);
          setEmailStateEdit((prev) => ({
            ...prev,
            checking: false,
            exists: res.exists,
          }));
        } catch (e: any) {
          setEmailStateEdit((prev) => ({
            ...prev,
            checking: false,
            error: "Falha ao validar email",
          }));
        }
      }, 450),
    []
  );

  useEffect(() => {
    if (editUser)
      setEmailStateEdit((prev) => ({
        ...prev,
        initial: editUser.email_usuario,
      }));
    else setEmailStateEdit((prev) => ({ ...prev, initial: "" }));
  }, [editUser]);

  type ConfirmData = {
    open: boolean;
    action: string;
    id: string | number;
    nome?: string;
    message?: string;
    force?: boolean;
  } | null;
  const [confirmData, setConfirmData] = useState<ConfirmData>(null);
  // group expand state
  const [openGroupIds, setOpenGroupIds] = useState<Set<string | number>>(
    new Set()
  );
  const toggleGroupOpen = (id: string | number) => {
    setOpenGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // RETORNO PRINCIPAL
  return (
    <div className="space-y-10 overflow-x-hidden" id="dashboard-root">
      {/* Barra superior de ações rápidas */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-800 via-purple-600 to-purple-400 bg-clip-text text-transparent tracking-tight">
          Dashboard
        </h1>
        <ActionButton
          textIdle="Atualizar dados"
          isLoading={refreshingAll}
          onClick={handleGlobalRefresh}
          enableRipplePulse
          className={`bg-gradient-to-r from-purple-700 via-purple-600 to-violet-600 min-w-[170px] cursor-pointer ${
            refreshingAll ? "animate-pulse ring-2 ring-purple-400/40" : ""
          }`}
        />
      </div>
      {/* Barra de busca global + resultados imediatamente abaixo */}
      <section id="global-search" className="space-y-4 scroll-mt-24">
        <div className="rounded-2xl border border-purple-200/60 bg-white/80 backdrop-blur p-5 shadow-sm space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Campo de busca */}
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                Busca
              </label>
              <div className="relative group rounded-xl border border-zinc-200 bg-zinc-50 focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-200 transition">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  className="w-full rounded-xl bg-transparent pl-9 pr-4 py-2.5 text-sm outline-none placeholder:text-zinc-400"
                  placeholder="Digite para buscar…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {/* Divider vertical */}
            <div className="hidden lg:flex items-stretch" aria-hidden="true">
              <div className="w-px bg-gradient-to-b from-transparent via-zinc-200 to-transparent" />
            </div>
            {/* Domínio */}
            <div className="w-full sm:w-60 flex flex-col gap-1">
              <label className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                Onde
              </label>
              <div className="relative">
                <select
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300 pr-8 appearance-none"
                  value={searchDomain}
                  onChange={(e) => setSearchDomain(e.target.value as any)}
                >
                  <option value="usuarios">Usuários</option>
                  <option value="grupos">Grupos</option>
                  <option value="cursos">Cursos</option>
                  <option value="componentes">Componentes</option>
                  <option value="perguntas">Perguntas</option>
                  <option value="respostas">Respostas</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                  ▼
                </span>
              </div>
            </div>
            {/* Tipo de usuário */}
            {searchDomain === "usuarios" && (
              <div className="w-full sm:w-60 flex flex-col gap-1">
                <label className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                  Tipo de usuário
                </label>
                <div className="relative">
                  <select
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300 pr-8 appearance-none"
                    value={searchTipoUsuario}
                    onChange={(e) => setSearchTipoUsuario(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {tipoUsuariosDisponiveis.map((t) => (
                      <option key={String(t)} value={String(t)}>
                        {String(t)}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>
            )}
            {searchDomain === "componentes" && (
              <div className="w-full sm:w-60 flex flex-col gap-1">
                <label className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                  Curso
                </label>
                <div className="relative">
                  <select
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300 pr-8 appearance-none"
                    value={searchCursoFiltro || ""}
                    onChange={(e) => setSearchCursoFiltro(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {cursos.map((curso: any) => (
                      <option key={curso.id_curso} value={curso.id_curso}>
                        {curso.nome_curso}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>
            )}
            {searchDomain === "perguntas"}
            {searchDomain === "respostas" && (
              <div className="w-full sm:w-60 flex items-center gap-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <span className="text-[12px] text-zinc-700">
                    Buscar em respostas
                  </span>
                </label>
              </div>
            )}
          </div>
          {/* Linha meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-zinc-600">
              <span className="uppercase tracking-wide text-[10px] font-medium">
                Resultados
              </span>
              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-semibold">
                {filteredSearchResults.length}
              </span>
            </div>
            {searchQuery && (
              <div className="flex items-center gap-1 text-zinc-600">
                <span className="uppercase tracking-wide text-[10px] font-medium">
                  Consulta
                </span>
                <code className="px-1 py-0.5 rounded bg-zinc-100 text-[10px] text-zinc-700">
                  {searchQuery}
                </code>
              </div>
            )}
            <div className="flex items-center gap-1 text-zinc-600">
              <span className="uppercase tracking-wide text-[10px] font-medium">
                Página
              </span>
              <span className="text-[10px] font-semibold text-zinc-800">
                {searchPage}/{totalPages}
              </span>
            </div>
          </div>
          {/* Resultados diretamente abaixo */}
          {searchQuery && (
            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
              {filteredSearchResults.length === 0 && (
                <div className="p-6 text-sm text-zinc-500">
                  Nenhum resultado encontrado.
                </div>
              )}
              {filteredSearchResults.length > 0 && (
                <ul className="divide-y">
                  {pagedResults.map((item: any) => (
                    <li
                      key={
                        item.id_usuario ||
                        item.id_grupo ||
                        item.id_curso ||
                        item.id_componente ||
                        item.id_pergunta
                      }
                      className="px-4 py-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-zinc-50"
                    >
                      <div className="flex flex-col">
                        {searchDomain === "usuarios" && (
                          <>
                            <span className="font-medium text-zinc-800">
                              {highlight(item.nome_usuario, searchQuery)}
                            </span>
                            <span className="text-zinc-600">
                              {highlight(item.email_usuario, searchQuery)}
                            </span>
                            <span className="text-purple-600 text-xs">
                              {highlight(
                                getTipoNome(item.fkIdTipoUsuario),
                                searchQuery
                              )}
                            </span>
                          </>
                        )}
                        {searchDomain === "grupos" && (
                          <span className="font-medium text-zinc-800">
                            {highlight(item.nome_grupo, searchQuery)}
                          </span>
                        )}
                        {searchDomain === "cursos" && (
                          <span className="font-medium text-zinc-800">
                            {highlight(item.nome_curso, searchQuery)}
                          </span>
                        )}
                        {searchDomain === "componentes" && (
                          <>
                            <span className="font-medium text-zinc-800">
                              {highlight(item.nome_componente, searchQuery)}
                            </span>
                            <span className="text-xs text-zinc-600">
                              Curso:{" "}
                              {item.fkId_curso?.slice(0, 8) ||
                                item.curso?.nome_curso ||
                                "—"}
                            </span>
                          </>
                        )}
                        {searchDomain === "perguntas" && (
                          <span className="font-medium text-zinc-800">
                            {highlight(item.pergunta, searchQuery)}
                          </span>
                        )}
                        {searchDomain === "respostas" && (
                          <>
                            <span className="font-medium text-zinc-800">
                              {highlight(item.resposta, searchQuery)}
                            </span>
                            <span className="text-xs text-zinc-600">
                              {item.usuario?.nome_usuario ||
                                item.usuario?.apelido_usuario}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {searchDomain === "usuarios" && (
                          <button
                            className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300"
                            onClick={() => setEditUser(item)}
                          >
                            Editar
                          </button>
                        )}
                        {searchDomain === "grupos" && (
                          <button
                            className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300"
                            onClick={() => setEditGrupo(item)}
                          >
                            Editar
                          </button>
                        )}
                        {searchDomain === "cursos" && (
                          <button
                            className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300"
                            onClick={() => setEditCurso(item)}
                          >
                            Editar
                          </button>
                        )}
                        {searchDomain === "componentes" && (
                          <button
                            className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300"
                            onClick={() => setEditComponente(item)}
                          >
                            Editar
                          </button>
                        )}
                        <button
                          className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
                          onClick={() => {
                            if (searchDomain === "usuarios")
                              scrollToSection("#manage-usuarios");
                            if (searchDomain === "grupos")
                              scrollToSection("#manage-grupos");
                            if (searchDomain === "cursos")
                              scrollToSection("#manage-cursos");
                            if (searchDomain === "componentes")
                              scrollToSection("#manage-componentes");
                            if (searchDomain === "perguntas")
                              scrollToSection("#manage-perguntas");
                          }}
                        >
                          Ir para seção
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {filteredSearchResults.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
                  <span className="text-xs text-zinc-600">
                    Página {searchPage} de {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-zinc-200 text-zinc-800 hover:bg-zinc-300 disabled:opacity-50"
                      disabled={searchPage <= 1}
                      onClick={() => setSearchPage((p) => Math.max(1, p - 1))}
                    >
                      Anterior
                    </button>
                    <button
                      className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-zinc-200 text-zinc-800 hover:bg-zinc-300 disabled:opacity-50"
                      disabled={searchPage >= totalPages}
                      onClick={() =>
                        setSearchPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-600">Total de Usuários</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {usersState.length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-600">Total de Cursos</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {cursosState.length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-600">Total de Componentes</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {componentesState.length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-600">Total de Grupos</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {gruposState.length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-600">Total de Perguntas</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {perguntasState.length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-zinc-600">Denúncias Pendentes</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {denunciasState.filter((d) => d.status === "pendente").length}
          </p>
        </div>
      </section>

      <section id="manage-denuncias" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-bold">Denúncias</h2>
        {/* Filtros de denúncias - padronizado com a search bar */}
        <div className="rounded-2xl border border-purple-200/60 bg-white/80 backdrop-blur p-5 shadow-sm overflow-hidden">
          <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
            {/* Barra de busca/filtragem local para Denúncias (mais próxima da seção) */}
            <div className="w-full flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
              <div className="flex-1 min-w-0">
                <label className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                  Buscar denúncias
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Pesquisar por usuário que denunciou..."
                    value={filtroDenunciaQuery}
                    onChange={(e) => setFiltroDenunciaQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="hidden lg:flex items-stretch" aria-hidden="true">
                <div className="w-px bg-gradient-to-b from-transparent via-zinc-200 to-transparent" />
              </div>

              <div className="flex gap-4 items-center mt-2 lg:mt-0">
                <div className="w-48 flex flex-col gap-1">
                  <label className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300 pr-8 appearance-none"
                      value={filtroStatus}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="pendente">Pendente</option>
                      <option value="resolvida">Resolvida</option>
                      <option value="arquivada">Arquivada</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                <div className="w-60 flex flex-col gap-1">
                  <label className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                    Motivo
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300 pr-8 appearance-none"
                      value={filtroTipoDenuncia}
                      onChange={(e) => setFiltroTipoDenuncia(e.target.value)}
                    >
                      <option value="">Todos</option>
                      {tipoDenunciaExistentes.map((t: any) => (
                        <option key={String(t)} value={String(t)}>
                          {String(t)}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                      ▼
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nível mínimo and Usuário removed per request */}
          </div>
        </div>

        {denunciasFiltradas.length === 0 && (
          <div className="p-8 border border-dashed rounded-2xl text-center text-sm text-zinc-500 bg-white/70">
            Nenhuma denúncia pendente encontrada.
          </div>
        )}
        {denunciasFiltradas.map((denuncia) => {
          const nivel = denuncia.nivel_denuncia;
          const rawStatus = (denuncia as any).status || "pendente";
          const keyStatus = rawStatus === "em_analise" ? "pendente" : rawStatus;

          let nivelLabel = "";
          let nivelColor = "";

          if (nivel <= 3) {
            nivelLabel = "Leve";
            nivelColor = "bg-blue-100 text-blue-700";
          } else if (nivel > 3 && nivel < 7) {
            nivelLabel = "Médio";
            nivelColor = "bg-orange-100 text-orange-700";
          } else {
            nivelLabel = "Grave";
            nivelColor = "bg-red-100 text-red-700";
          }

          return (
            <div
              key={denuncia.id_denuncia}
              className="group relative flex flex-col gap-4 p-5 bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md hover:border-purple-200 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition">
                <div className="h-full w-full rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/10" />
              </div>
              <div className="flex items-center justify-between w-full">
                {(() => {
                  // Resolve reporter: prefer nested `usuario`, else try to find in usersState
                  const denUser = (denuncia as any).usuario;
                  let reporter = denUser;
                  if (!reporter || !reporter.nome_usuario) {
                    // try common fk fields which may contain reporter id
                    const possibleIds = [
                      (denuncia as any).fkId_usuario,
                      (denuncia as any).fkId_usuario_denunciante,
                      (denuncia as any).fkId_usuario_criador,
                      (denuncia as any).fkId_usuario_conteudo,
                      (denuncia as any).fkId_usuarioCriador,
                    ];
                    const id = possibleIds.find(Boolean);
                    if (id) {
                      reporter = usersState.find(
                        (u) => String(u.id_usuario) === String(id)
                      );
                    }
                  }

                  const nome =
                    reporter?.nome_usuario ?? reporter?.apelido_usuario ?? "—";
                  const apelido = reporter?.apelido_usuario
                    ? `(${reporter.apelido_usuario})`
                    : "";
                  return (
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-zinc-800 truncate">
                          {`Nova denúncia de ${nome} ${apelido}`}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-4">
                  {/* Status badge */}
                  {(() => {
                    const key = keyStatus;
                    let cls = "bg-yellow-100 text-yellow-800";
                    if (key === "pendente")
                      cls = "bg-yellow-100 text-yellow-800";
                    else if (key === "resolvida")
                      cls = "bg-green-100 text-green-800";
                    else if (key === "arquivada")
                      cls = "bg-zinc-100 text-zinc-700";
                    const label =
                      key === "pendente"
                        ? "Pendente"
                        : key === "resolvida"
                        ? "Resolvida"
                        : key === "arquivada"
                        ? "Arquivada"
                        : String(key).replace(/_/g, " ");
                    return (
                      <span
                        className={`text-sm px-3 py-1 rounded-full font-medium ${cls}`}
                      >
                        {label}
                      </span>
                    );
                  })()}

                  <span className="text-sm px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-medium">
                    {String(
                      (denuncia as any).tipo_denuncia ??
                        denuncia.tipo_conteudo ??
                        "—"
                    ).toUpperCase()}
                  </span>
                  <button
                    className="px-3 py-1 rounded-lg cursor-pointer bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm"
                    onClick={() => {
                      setSelectedDenuncia(denuncia);
                      setOpenAnalise(true);

                      const p = perguntasState.find(
                        (pq) =>
                          String(pq.id_pergunta) ===
                          String(denuncia.fkId_conteudo_denunciado)
                      );
                      const r = respostasState.find(
                        (rs) =>
                          String(rs.id_resposta) ===
                          String(denuncia.fkId_conteudo_denunciado)
                      );

                      if (p) {
                        setConteudoRevisado({
                          tipo: "Pergunta",
                          texto: p.pergunta,
                        });
                      } else if (r) {
                        setConteudoRevisado({
                          tipo: "Resposta",
                          texto: r.resposta,
                        });
                      } else {
                        setConteudoRevisado(null);
                      }
                    }}
                  >
                    {keyStatus === "arquivada"
                      ? "Ver Denúnica"
                      : "Analisar Denúncia"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Gerenciar cursos */}
      <section id="manage-cursos" className="space-y-2 scroll-mt-24">
        <h2 className="text-2xl font-bold">Cursos</h2>
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="divide-y">
            {refreshingAll && (
              <div className="px-4 py-3 flex justify-between items-center">
                <div className="h-4 w-40 rounded bg-zinc-200 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-14 rounded bg-zinc-200 animate-pulse" />
                  <div className="h-6 w-14 rounded bg-zinc-200 animate-pulse" />
                </div>
              </div>
            )}
            {!refreshingAll &&
              cursosSorted.map((curso) => (
                <div
                  key={curso.id_curso}
                  className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50"
                >
                  <div className="text-sm font-medium text-zinc-800">
                    {curso.nome_curso}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300"
                      onClick={() => setEditCurso(curso)}
                    >
                      Editar
                    </button>
                    <button
                      className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-red-200 text-red-800 hover:bg-red-300"
                      onClick={() =>
                        setConfirmData({
                          open: true,
                          action: "deleteCurso",
                          id: curso.id_curso,
                          nome: curso.nome_curso,
                        })
                      }
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Gerenciar componentes / matérias */}
      <section id="manage-componentes" className="space-y-2 scroll-mt-24">
        <h2 className="text-2xl font-bold">Componentes</h2>
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="divide-y">
            {refreshingAll && (
              <div className="px-4 py-3 flex justify-between items-center">
                <div className="h-4 w-48 rounded bg-zinc-200 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-14 rounded bg-zinc-200 animate-pulse" />
                  <div className="h-6 w-14 rounded bg-zinc-200 animate-pulse" />
                </div>
              </div>
            )}
            {!refreshingAll &&
              componentesSorted.map((comp) => (
                <div
                  key={comp.id_componente}
                  className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50"
                >
                  <div className="text-sm font-medium text-zinc-800 flex items-center gap-2">
                    {comp.nome_componente}
                    {comp.curso?.nome_curso && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-normal">
                        {comp.curso.nome_curso}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300"
                      onClick={() => setEditComponente(comp)}
                    >
                      Editar
                    </button>
                    <button
                      className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-red-200 text-red-800 hover:bg-red-300"
                      onClick={() =>
                        setConfirmData({
                          open: true,
                          action: "deleteComponente",
                          id: comp.id_componente,
                          nome: comp.nome_componente,
                        })
                      }
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Gerenciar grupos */}
      <section id="manage-grupos" className="space-y-2 scroll-mt-24">
        <h2 className="text-2xl font-bold">Grupos</h2>
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="divide-y">
            {refreshingAll && (
              <div className="px-4 py-3 flex justify-between items-center">
                <div className="h-4 w-52 rounded bg-zinc-200 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-14 rounded bg-zinc-200 animate-pulse" />
                  <div className="h-6 w-14 rounded bg-zinc-200 animate-pulse" />
                </div>
              </div>
            )}
            {!refreshingAll &&
              gruposSorted.map((g) => (
                <div key={g.id_grupo} className="px-4 py-3 hover:bg-zinc-50">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleGroupOpen(g.id_grupo)}
                      className="text-sm font-medium text-zinc-800 flex items-center gap-2 cursor-pointer"
                    >
                      <span
                        className={`transition-transform ${
                          openGroupIds.has(g.id_grupo) ? "rotate-90" : ""
                        }`}
                      >
                        ▶
                      </span>
                      {g.nome_grupo}
                      {g.membro && (
                        <span className="text-xs text-purple-600">
                          ({g.membro.length} membros)
                        </span>
                      )}
                    </button>
                    <div className="flex gap-2">
                      <button
                        className="cursor-pointer px-3 py-1 text-sm rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300 transform-gpu hover:-translate-y-0.5"
                        onClick={() => setEditGrupo(g)}
                      >
                        Editar
                      </button>
                      <button
                        className="cursor-pointer px-3 py-1 text-sm rounded-lg bg-red-200 text-red-800 hover:bg-red-300 transform-gpu hover:-translate-y-0.5"
                        onClick={() =>
                          setConfirmData({
                            open: true,
                            action: "deleteGrupo",
                            id: g.id_grupo,
                            nome: g.nome_grupo,
                          })
                        }
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                  {openGroupIds.has(g.id_grupo) && g.membro && (
                    <div className="mt-3 ml-5 space-y-1">
                      {g.membro.length === 0 && (
                        <div className="text-sm text-zinc-600">
                          Sem membros.
                        </div>
                      )}
                      {g.membro.map((m) => (
                        <div
                          key={m.id_membro}
                          className="flex items-center justify-between pr-4"
                        >
                          <span className="text-sm text-zinc-700">
                            {m.usuarios?.nome_usuario || m.userId}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {m.id_membro.slice(0, 8)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Últimas perguntas */}
      <section id="manage-perguntas" className="space-y-2 scroll-mt-24">
        <h2 className="text-2xl font-bold">Últimas perguntas</h2>
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="divide-y">
            {refreshingAll && (
              <div className="px-4 py-3">
                <div className="h-4 w-64 rounded bg-zinc-200 animate-pulse mb-2" />
                <div className="h-3 w-40 rounded bg-zinc-100 animate-pulse" />
              </div>
            )}

            {!refreshingAll &&
              perguntasSorted.slice(0, 8).map((p) => {
                const author = (p as any).usuario;
                let resolvedAuthor: any = author;
                if (
                  !resolvedAuthor ||
                  (!resolvedAuthor.nome_usuario &&
                    !resolvedAuthor.apelido_usuario)
                ) {
                  const possibleIds = [
                    (p as any).fkId_usuario,
                    (p as any).fkId_usuario_criador,
                    (p as any).fkId_usuario_conteudo_usuario,
                    (p as any).usuario?.id_usuario,
                  ];
                  const aid = possibleIds.find(Boolean);
                  if (aid) {
                    resolvedAuthor = usersState.find(
                      (u) => String(u.id_usuario) === String(aid)
                    );
                  }
                }

                const displayAuthorName = resolvedAuthor
                  ? (resolvedAuthor.nome_usuario ||
                      resolvedAuthor.apelido_usuario ||
                      "—") +
                    (resolvedAuthor.nome_usuario &&
                    resolvedAuthor.apelido_usuario
                      ? ` (${resolvedAuthor.apelido_usuario})`
                      : "")
                  : "—";

                return (
                  <div
                    key={p.id_pergunta}
                    className="rounded-lg border border-zinc-100 bg-white p-4 flex items-start justify-between text-sm shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-zinc-800">
                          {displayAuthorName}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold ml-2">
                            Autor da pergunta
                          </span>
                        </span>
                        <span className="ml-2 text-xs text-zinc-400">
                          {p.dataCriacao_pergunta
                            ? new Date(p.dataCriacao_pergunta).toLocaleString(
                                "pt-BR"
                              )
                            : ""}
                        </span>
                      </div>

                      <p className="font-medium text-zinc-800">{p.pergunta}</p>

                      <div className="text-sm text-zinc-600 mt-1">
                        {p.componente?.nome_componente} • {p.curso?.nome_curso}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <a
                        className="cursor-pointer px-3 py-1 text-sm rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300 transform-gpu hover:-translate-y-0.5"
                        href={`/home?tipo_conteudo=Pergunta&id_conteudo=${p.id_pergunta}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visualizar
                      </a>
                      <button
                        className="cursor-pointer px-3 py-1 text-sm rounded-lg bg-red-200 text-red-800 hover:bg-red-300 transform-gpu hover:-translate-y-0.5"
                        onClick={async () => {
                          setConfirmData({
                            open: true,
                            action: "deletePergunta",
                            id: p.id_pergunta,
                            nome: p.pergunta,
                          });
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Últimas respostas */}
      <section id="manage-respostas" className="space-y-2 scroll-mt-24">
        <h2 className="text-2xl font-bold">Últimas respostas</h2>
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="divide-y">
            {refreshingAll && (
              <div className="px-4 py-3">
                <div className="h-4 w-64 rounded bg-zinc-200 animate-pulse mb-2" />
                <div className="h-3 w-40 rounded bg-zinc-100 animate-pulse" />
              </div>
            )}
            {!refreshingAll &&
              respostasSorted.slice(0, 8).map((r) => {
                const pergunta = perguntasState.find(
                  (pq) => pq.id_pergunta === r.fkId_pergunta
                );
                const perguntaAuthor =
                  (pergunta as any)?.usuario || (pergunta as any)?.usuarios;
                const respostaAuthor =
                  (r as any).usuario || (r as any).usuarios;
                return (
                  <div
                    key={r.id_resposta}
                    className="rounded-lg border border-zinc-100 bg-white p-4 flex items-start justify-between text-sm shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-zinc-700 font-medium">
                          {(() => {
                            const name =
                              perguntaAuthor?.nome_usuario ||
                              perguntaAuthor?.apelido_usuario ||
                              "—";
                            const tipo =
                              (perguntaAuthor as any)?.tipoUsuario
                                ?.nome_tipousuario ||
                              getTipoNome(
                                (perguntaAuthor as any)?.fkIdTipoUsuario ||
                                  (perguntaAuthor as any)?.fkId_tipoUsuario ||
                                  (perguntaAuthor as any)?.fkId_tipo_usuario
                              );
                            return (
                              <>
                                {name}
                                {perguntaAuthor?.apelido_usuario &&
                                  perguntaAuthor?.nome_usuario && (
                                    <span className="text-sm text-zinc-600 ml-1">
                                      ({perguntaAuthor.apelido_usuario})
                                    </span>
                                  )}
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold ml-2">
                                  Autor da pergunta
                                </span>
                              </>
                            );
                          })()}
                        </span>
                        <span className="ml-2 text-xs text-zinc-400">
                          {pergunta?.dataCriacao_pergunta
                            ? new Date(
                                pergunta.dataCriacao_pergunta
                              ).toLocaleString("pt-BR")
                            : ""}
                        </span>
                      </div>

                      <p className="font-medium text-zinc-800 truncate">
                        {pergunta?.pergunta || "(pergunta não encontrada)"}
                      </p>

                      <div className="text-sm text-zinc-600 mt-1">
                        {pergunta?.componente?.nome_componente} •{" "}
                        {pergunta?.curso?.nome_curso}
                      </div>

                      <div className="flex items-center gap-2 mt-3 mb-1">
                        <span className="text-sm text-zinc-700 font-medium">
                          {(() => {
                            const name =
                              respostaAuthor?.nome_usuario ||
                              respostaAuthor?.apelido_usuario ||
                              "(Autor da resposta não disponível)";
                            const tipo =
                              (respostaAuthor as any)?.tipoUsuario
                                ?.nome_tipousuario ||
                              getTipoNome(
                                (respostaAuthor as any)?.fkIdTipoUsuario ||
                                  (respostaAuthor as any)?.fkId_tipoUsuario ||
                                  (respostaAuthor as any)?.fkId_tipo_usuario
                              );
                            return (
                              <>
                                {name}
                                {respostaAuthor?.apelido_usuario &&
                                  respostaAuthor?.nome_usuario && (
                                    <span className="text-sm text-zinc-600 ml-1">
                                      ({respostaAuthor.apelido_usuario})
                                    </span>
                                  )}
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold ml-2">
                                  Autor da resposta
                                </span>
                              </>
                            );
                          })()}
                        </span>

                        <span className="ml-2 text-xs text-zinc-400">
                          {r.dataCriacao_resposta
                            ? new Date(r.dataCriacao_resposta).toLocaleString(
                                "pt-BR"
                              )
                            : ""}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-600 mt-2">{r.resposta}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-4">
                      <a
                        className="cursor-pointer px-3 py-1 text-sm rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300 transform-gpu hover:-translate-y-0.5"
                        href={`/home?tipo_conteudo=Pergunta&id_conteudo=${r.fkId_pergunta}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visualizar
                      </a>
                      <button
                        className="cursor-pointer px-3 py-1 text-sm rounded-lg bg-red-200 text-red-800 hover:bg-red-300 transform-gpu hover:-translate-y-0.5"
                        onClick={() => {
                          setConfirmData({
                            open: true,
                            action: "deleteResposta",
                            id: r.id_resposta,
                            nome: r.resposta,
                          });
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Resultados da busca global (apenas listagem simplificada) */}
      {searchQuery && (
        <section className="space-y-2 scroll-mt-24" id="search-results">
          <h2 className="text-xl font-semibold">
            Resultados ({filteredSearchResults.length})
          </h2>
          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
            {filteredSearchResults.length === 0 && (
              <div className="p-6 text-sm text-zinc-500">
                Nenhum resultado encontrado.
              </div>
            )}
            {filteredSearchResults.length > 0 && (
              <ul className="divide-y">
                {pagedResults.map((item: any) => (
                  <li
                    key={
                      item.id_usuario ||
                      item.id_grupo ||
                      item.id_curso ||
                      item.id_componente ||
                      item.id_pergunta
                    }
                    className="px-4 py-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-zinc-50"
                  >
                    <div className="flex flex-col">
                      {searchDomain === "usuarios" && (
                        <>
                          <span className="font-medium text-zinc-800">
                            {highlight(item.nome_usuario, searchQuery)}
                          </span>
                          <span className="text-zinc-600">
                            {highlight(item.email_usuario, searchQuery)}
                          </span>
                          <span className="text-purple-600 text-xs">
                            {highlight(
                              getTipoNome(item.fkIdTipoUsuario),
                              searchQuery
                            )}
                          </span>
                        </>
                      )}
                      {searchDomain === "grupos" && (
                        <span className="font-medium text-zinc-800">
                          {highlight(item.nome_grupo, searchQuery)}
                        </span>
                      )}
                      {searchDomain === "cursos" && (
                        <span className="font-medium text-zinc-800">
                          {highlight(item.nome_curso, searchQuery)}
                        </span>
                      )}
                      {searchDomain === "componentes" && (
                        <>
                          <span className="font-medium text-zinc-800">
                            {highlight(item.nome_componente, searchQuery)}
                          </span>
                          <span className="text-xs text-zinc-600">
                            Curso:{" "}
                            {item.fkId_curso?.slice(0, 8) ||
                              item.curso?.nome_curso ||
                              "—"}
                          </span>
                        </>
                      )}
                      {searchDomain === "perguntas" && (
                        <span className="font-medium text-zinc-800">
                          {highlight(item.pergunta, searchQuery)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {searchDomain === "usuarios" && (
                        <button
                          className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300"
                          onClick={() => setEditUser(item)}
                        >
                          Editar
                        </button>
                      )}
                      {searchDomain === "grupos" && (
                        <button
                          className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300"
                          onClick={() => setEditGrupo(item)}
                        >
                          Editar
                        </button>
                      )}
                      {searchDomain === "cursos" && (
                        <button
                          className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300"
                          onClick={() => setEditCurso(item)}
                        >
                          Editar
                        </button>
                      )}
                      {searchDomain === "componentes" && (
                        <button
                          className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300"
                          onClick={() => setEditComponente(item)}
                        >
                          Editar
                        </button>
                      )}
                      <button
                        className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
                        onClick={() => {
                          if (searchDomain === "usuarios")
                            scrollToSection("#manage-usuarios");
                          if (searchDomain === "grupos")
                            scrollToSection("#manage-grupos");
                          if (searchDomain === "cursos")
                            scrollToSection("#manage-cursos");
                          if (searchDomain === "componentes")
                            scrollToSection("#manage-componentes");
                          if (searchDomain === "perguntas")
                            scrollToSection("#manage-perguntas");
                        }}
                      >
                        Ir para seção
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {filteredSearchResults.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
                <span className="text-xs text-zinc-600">
                  Página {searchPage} de {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-zinc-200 text-zinc-800 hover:bg-zinc-300 disabled:opacity-50"
                    disabled={searchPage <= 1}
                    onClick={() => setSearchPage((p) => Math.max(1, p - 1))}
                  >
                    Anterior
                  </button>
                  <button
                    className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-zinc-200 text-zinc-800 hover:bg-zinc-300 disabled:opacity-50"
                    disabled={searchPage >= totalPages}
                    onClick={() =>
                      setSearchPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modal de análise da denúncia (substitui Drawer) */}
      {selectedDenuncia && (
        <Dialog
          open={openAnalise}
          onOpenChange={(v) => {
            if (!v) {
              setOpenAnalise(false);
              setSelectedDenuncia(null);
            } else setOpenAnalise(true);
          }}
        >
          <DialogContent className="max-w-lg rounded-2xl border border-zinc-100 bg-white shadow-xl">
            <DialogHeader className="items-start">
              <DialogTitle className="text-2xl font-extrabold text-rose-600">
                Analisar Denúncia
              </DialogTitle>
              <div className="text-sm text-zinc-500 mt-1">
                Data da denúncia:{" "}
                {new Date(
                  selectedDenuncia.dataCriacao_denuncia
                ).toLocaleString()}
              </div>
            </DialogHeader>

            {/* Top cards: Quem denunciou (blue) + Denunciado (red) */}
            {/* compute normalized status for modal (used to hide action buttons for archived reports) */}
            {(() => {
              const modalRawStatus =
                (selectedDenuncia as any).status || "pendente";
              // normalize 'em_analise' -> 'pendente'
              (selectedDenuncia as any).__modalKeyStatus =
                modalRawStatus === "em_analise" ? "pendente" : modalRawStatus;
              return null;
            })()}
            {(() => {
              const denUser = (selectedDenuncia as any).usuario;
              let reporter: any = denUser;
              if (!reporter || !reporter.nome_usuario) {
                const possibleIds = [
                  (selectedDenuncia as any).fkId_usuario,
                  (selectedDenuncia as any).fkId_usuario_denunciante,
                  (selectedDenuncia as any).fkId_usuario_criador,
                  (selectedDenuncia as any).fkId_usuario_conteudo,
                  (selectedDenuncia as any).fkId_usuarioCriador,
                ];
                const id = possibleIds.find(Boolean);
                if (id) {
                  reporter = usersState.find(
                    (u) => String(u.id_usuario) === String(id)
                  );
                }
              }
              const reporterName = reporter
                ? `${reporter.nome_usuario ?? reporter.apelido_usuario}${
                    reporter.apelido_usuario && reporter.nome_usuario
                      ? ` (${reporter.apelido_usuario})`
                      : ""
                  }`
                : "—";

              const possibleVictimIds = [
                (selectedDenuncia as any).fkId_usuario_conteudo,
                (selectedDenuncia as any).fkId_usuario_conteudo_usuario,
                (selectedDenuncia as any).fkId_usuarioCriador,
                (selectedDenuncia as any).fkId_usuario_conteudo_criador,
                (selectedDenuncia as any).fkId_usuario,
              ];
              const victimId = possibleVictimIds.find(Boolean);
              let victim: any = null;
              if (victimId)
                victim = usersState.find(
                  (u) => String(u.id_usuario) === String(victimId)
                );
              const victimName = victim
                ? `${victim.nome_usuario ?? victim.apelido_usuario}${
                    victim.apelido_usuario && victim.nome_usuario
                      ? ` (${victim.apelido_usuario})`
                      : ""
                  }`
                : selectedDenuncia.tipo_conteudo ?? "—";

              return (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3 flex flex-col gap-1">
                      <div className="text-xs text-blue-700 font-semibold">
                        Quem denunciou
                      </div>
                      <div className="text-sm text-blue-800 mt-1">
                        {reporterName}
                      </div>
                    </div>

                    <div className="rounded-lg border border-red-100 bg-red-50/60 p-3 flex flex-col gap-1">
                      <div className="text-xs text-rose-700 font-semibold">
                        Denunciado
                      </div>
                      <div className="text-sm text-rose-700 mt-1">
                        {victimName}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-zinc-600">
                    Denúncia realizada por{" "}
                    <span className="text-blue-600 font-semibold">
                      {reporterName}
                    </span>{" "}
                    contra{" "}
                    <span className="text-rose-600 font-semibold">
                      {victimName}
                    </span>
                    .
                  </div>
                </>
              );
            })()}

            {/* Details form-like area */}
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-zinc-100 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-zinc-500 uppercase tracking-wide">
                    Motivo
                  </div>
                  {(() => {
                    const nivel = Number(selectedDenuncia.nivel_denuncia ?? 0);
                    const badgeClass =
                      nivel <= 1
                        ? "bg-blue-100 text-blue-700"
                        : nivel <= 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700";
                    return (
                      <div
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeClass}`}
                      >
                        Nível {nivel || "—"}
                      </div>
                    );
                  })()}
                </div>
                <div className="text-sm font-semibold mt-2">
                  {String(
                    (selectedDenuncia as any).tipo_denuncia ??
                      selectedDenuncia.tipo_conteudo ??
                      "—"
                  ).toUpperCase()}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-gray-50 p-3">
                <div className="text-xs text-zinc-500 uppercase tracking-wide">
                  Nota de quem denunciou
                </div>
                <div className="text-sm mt-1 break-words">
                  {selectedDenuncia.descricao || "(sem nota)"}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-gray-50 p-3">
                <div className="text-xs text-zinc-500 uppercase tracking-wide">
                  O que foi revisado
                </div>
                <div className="text-sm font-semibold mt-1">
                  {(selectedDenuncia as any)?.revisadoTipo ||
                    conteudoRevisado?.tipo ||
                    (selectedDenuncia as any).tipo_conteudo}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-white p-3">
                <div className="text-xs text-zinc-500 uppercase tracking-wide">
                  Item denunciado
                </div>
                <div className="mt-2 p-3 bg-white rounded border text-sm max-w-prose mx-auto">
                  {(selectedDenuncia as any)?.item_denunciado ||
                    conteudoRevisado?.texto ||
                    "(conteúdo não disponível)"}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-4">
              {/* hide action buttons for already-archived denúncias */}
              {((selectedDenuncia as any).__modalKeyStatus ||
                (selectedDenuncia as any).status ||
                "pendente") !== "arquivada" && (
                <div className="flex items-center gap-3">
                  <button
                    className={`relative inline-flex items-center justify-center rounded-lg bg-zinc-200 text-zinc-800 hover:bg-zinc-300 text-sm px-4 py-2 transition ${
                      arquivarLoading || arquivarSuccess
                        ? "opacity-70 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    disabled={arquivarLoading || arquivarSuccess}
                    onClick={async () => {
                      if (arquivarLoading || arquivarSuccess) return;
                      setArquivarLoading(true);
                      try {
                        const [{ updateDenuncia }, { createNotificacao }] =
                          await Promise.all([
                            import("@/services/denuncia"),
                            import("@/services/notificacao"),
                          ]);
                        const updated = await updateDenuncia(
                          selectedDenuncia.id_denuncia,
                          {
                            fkId_usuario: selectedDenuncia.usuario?.id_usuario,
                            fkId_conteudo_denunciado:
                              selectedDenuncia.fkId_conteudo_denunciado,
                            nivel_denuncia: selectedDenuncia.nivel_denuncia,
                            status: "arquivada",
                            resultado:
                              "Por falta de provas concretas, não aplicamos nenhuma ação contra o usuário - converse com o suporte caso tenhamos feito algum erro.",
                          }
                        );
                        setDenunciasState((prev) =>
                          prev.map((d) =>
                            d.id_denuncia === updated.id_denuncia ? updated : d
                          )
                        );
                        const targetUserId =
                          selectedDenuncia?.usuario?.id_usuario ??
                          (selectedDenuncia as any)?.usuarios?.id_usuario ??
                          (selectedDenuncia as any)?.fkId_usuario ??
                          (selectedDenuncia as any)?.fkId_usuario_conteudo ??
                          (selectedDenuncia as any)
                            ?.fkId_usuario_conteudo_usuario ??
                          (selectedDenuncia as any)?.fkId_usuarioCriador ??
                          (selectedDenuncia as any)
                            ?.fkId_usuario_conteudo_criador;

                        if (targetUserId) {
                          await createNotificacao({
                            fkId_usuario: targetUserId,
                            titulo: "Denúncia arquivada",
                            mensagem:
                              "Por falta de provas concretas, não aplicamos nenhuma ação contra o usuário - converse com o suporte caso tenhamos feito algum erro.",
                            tipo: "denuncia",
                            fkId_denuncia: selectedDenuncia.id_denuncia,
                            fkId_conteudo_denunciado:
                              selectedDenuncia.fkId_conteudo_denunciado,
                            tipo_denuncia:
                              (selectedDenuncia as any).tipo_denuncia ??
                              selectedDenuncia.tipo_conteudo,
                            nivel_denuncia: selectedDenuncia.nivel_denuncia,
                            revisao:
                              "Por falta de provas concretas, não aplicamos nenhuma ação contra o usuário - converse com o suporte caso tenhamos feito algum erro.",
                            dataRevisao: new Date().toISOString(),
                            item_denunciado:
                              conteudoRevisado?.texto ?? undefined,
                            denunciadoNome: victimName,
                            fkId_usuario_conteudo:
                              selectedDenuncia.fkId_usuario_conteudo,
                          });
                        }
                        push({
                          kind: "success",
                          message: "Denúncia arquivada.",
                        });
                        pushAudit({
                          action: "update",
                          entity: "denuncia",
                          entityId: selectedDenuncia.id_denuncia,
                          details: "status=arquivada (via modal)",
                        });
                        setArquivarSuccess(true);
                        setTimeout(() => {
                          setArquivarLoading(false);
                          setOpenAnalise(false);
                          setSelectedDenuncia(null);
                          setArquivarSuccess(false);
                        }, 900);
                      } catch (e: any) {
                        console.error("Erro ao arquivar denúncia:", e);
                        // attempt to surface backend message if present
                        const serverMessage =
                          e?.response?.data?.message || e?.message;
                        push({
                          kind: "error",
                          message:
                            serverMessage || "Falha ao arquivar denúncia.",
                        });
                        setArquivarLoading(false);
                      }
                    }}
                  >
                    {arquivarLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
                        Arquivando...
                      </span>
                    ) : arquivarSuccess ? (
                      <span className="flex items-center gap-2 text-emerald-700">
                        <Check className="h-4 w-4" /> Arquivado
                      </span>
                    ) : (
                      "Arquivar Denúncia"
                    )}
                  </button>

                  <button
                    className={`relative inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-white text-sm hover:from-red-500 hover:to-rose-500 transition ${
                      penalidadeLoading
                        ? "opacity-70 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    disabled={penalidadeLoading}
                    onClick={() => {
                      if (penalidadeLoading) return;
                      setPenalidadeLoading(true);
                      // resolve victim name to pass to PenalidadeModal
                      const possible = [
                        (selectedDenuncia as any).fkId_usuario_conteudo,
                        (selectedDenuncia as any).fkId_usuario_conteudo_usuario,
                        (selectedDenuncia as any).fkId_usuarioCriador,
                        (selectedDenuncia as any).fkId_usuario_conteudo_criador,
                        (selectedDenuncia as any).fkId_usuario,
                      ];
                      const id = possible.find(Boolean);
                      let victim: any = null;
                      if (id)
                        victim = usersState.find(
                          (u) => String(u.id_usuario) === String(id)
                        );
                      const name = victim
                        ? victim.nome_usuario ?? victim.apelido_usuario
                        : undefined;
                      setPenalidadeUsuarioNome(name);
                      setTimeout(() => {
                        setPenalidadeLoading(false);
                        setOpenAnalise(false);
                        setOpenPenalidade(true);
                        setPenalidadeSuccess(true);
                        setTimeout(() => setPenalidadeSuccess(false), 800);
                      }, 450);
                    }}
                  >
                    {penalidadeLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />{" "}
                        Aplicando...
                      </span>
                    ) : (
                      "Aplicar Penalidade"
                    )}
                  </button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Gerenciar usuários */}
      <section id="manage-usuarios" className="space-y-2 scroll-mt-24">
        <h2 className="text-2xl font-bold">Usuários</h2>
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="divide-y">
            {refreshingAll && (
              <div className="px-4 py-3 flex justify-between items-center">
                <div className="h-4 w-40 rounded bg-zinc-200 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-14 rounded bg-zinc-200 animate-pulse" />
                  <div className="h-6 w-14 rounded bg-zinc-200 animate-pulse" />
                </div>
              </div>
            )}
            {!refreshingAll &&
              usuariosSorted.map((u) => (
                <div
                  key={u.id_usuario}
                  className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-800">
                      {u.nome_usuario}
                      {u.apelido_usuario && u.nome_usuario && (
                        <span className="text-sm text-zinc-600 ml-1">
                          ({u.apelido_usuario})
                        </span>
                      )}
                      {u.tipoUsuario && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-normal ml-2">
                          {u.tipoUsuario.nome_tipousuario}
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-zinc-600">
                      {u.email_usuario}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300"
                      onClick={() => {
                        setEditUserSuccess(false);
                        setEditUser(u);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="cursor-pointer px-3 py-1 text-xs rounded-lg bg-red-200 text-red-800 hover:bg-red-300"
                      onClick={() =>
                        setConfirmData({
                          open: true,
                          action: "deleteUser",
                          id: u.id_usuario,
                          nome: u.nome_usuario,
                        })
                      }
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      {/* Footer removido para a página de dashboard */}

      <SignUpCursoModal setOpenDialog={setOpenDialog} openDialog={openDialog} />
      <SignUpComponenteModal
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
        cursos={cursos}
      />
      <SignUpUserModal
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
        tipousuarios={tipousuario}
      />

      {/* Modal de penalidade */}
      {selectedDenuncia && (
        <PenalidadeModal
          openDialog={openPenalidade}
          setOpenDialog={setOpenPenalidade}
          fkId_usuario={selectedDenuncia.fkId_usuario_conteudo}
          fkId_denuncia={selectedDenuncia.id_denuncia}
          usuarioNome={penalidadeUsuarioNome}
          denunciaNivel={selectedDenuncia.nivel_denuncia}
          onFeedback={(type, msg) => {
            if (type === "success") {
              // Ao aplicar penalidade, concluir a denúncia automaticamente
              (async () => {
                try {
                  const [{ updateDenuncia }, { createNotificacao }] =
                    await Promise.all([
                      import("@/services/denuncia"),
                      import("@/services/notificacao"),
                    ]);
                  const updated = await updateDenuncia(
                    selectedDenuncia.id_denuncia,
                    {
                      fkId_usuario: selectedDenuncia.usuario?.id_usuario,
                      fkId_conteudo_denunciado:
                        selectedDenuncia.fkId_conteudo_denunciado,
                      nivel_denuncia: selectedDenuncia.nivel_denuncia,
                      status: "resolvida",
                      resultado:
                        "Sua denúncia foi analisada e o usuário sofreu penalidade. Obrigado por cooperar com o Estudare.",
                    }
                  );
                  setDenunciasState((prev) =>
                    prev.map((d) =>
                      d.id_denuncia === updated.id_denuncia ? updated : d
                    )
                  );
                  const targetUserId =
                    selectedDenuncia?.usuario?.id_usuario ??
                    (selectedDenuncia as any)?.usuarios?.id_usuario ??
                    (selectedDenuncia as any)?.fkId_usuario ??
                    (selectedDenuncia as any)?.fkId_usuario_conteudo ??
                    (selectedDenuncia as any)?.fkId_usuario_conteudo_usuario ??
                    (selectedDenuncia as any)?.fkId_usuarioCriador ??
                    (selectedDenuncia as any)?.fkId_usuario_conteudo_criador;

                  if (targetUserId) {
                    await createNotificacao({
                      fkId_usuario: targetUserId,
                      titulo: "Denúncia resolvida",
                      mensagem:
                        "Sua denúncia foi analisada e o usuário sofreu penalidade. Obrigado por cooperar com o Estudare.",
                      tipo: "denuncia",
                      fkId_denuncia: selectedDenuncia.id_denuncia,
                      fkId_conteudo_denunciado:
                        selectedDenuncia.fkId_conteudo_denunciado,
                      tipo_denuncia:
                        (selectedDenuncia as any).tipo_denuncia ??
                        selectedDenuncia.tipo_conteudo,
                      nivel_denuncia: selectedDenuncia.nivel_denuncia,
                      revisao:
                        "Sua denúncia foi analisada e o usuário sofreu penalidade. Obrigado por cooperar com o Estudare.",
                      dataRevisao: new Date().toISOString(),
                      item_denunciado: conteudoRevisado?.texto ?? undefined,
                      denunciadoNome: victimName,
                      fkId_usuario_conteudo:
                        selectedDenuncia.fkId_usuario_conteudo,
                    });
                  }
                  push({
                    kind: "success",
                    message: msg || "Penalidade aplicada e denúncia concluída.",
                  });
                  pushAudit({
                    action: "update",
                    entity: "denuncia",
                    entityId: selectedDenuncia.id_denuncia,
                    details: "status=resolvida (penalidade)",
                  });
                } catch (e: any) {
                  push({
                    kind: "error",
                    message:
                      e?.response?.data?.message ||
                      "Penalidade aplicada, mas falhou ao concluir denúncia.",
                  });
                } finally {
                  setOpenPenalidade(false);
                }
              })();
            }
          }}
        />
      )}

      {/* Confirm Dialog */}
      <Dialog
        open={!!confirmData?.open}
        onOpenChange={(v) => {
          if (!v) setConfirmData(null);
        }}
      >
        {confirmData?.open && (
          <DialogContent className="w-[calc(100vw-2rem)] sm:w-auto max-w-sm rounded-2xl p-6 bg-white border border-red-200 shadow-xl z-[9999]">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                Confirmar ação
              </DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg border border-red-100 bg-red-50/70 px-3 py-2 text-[var(--foreground)] flex gap-2 items-start"
            >
              <Info className="w-4 h-4 mt-0.5 text-red-600" />
              <p className="text-xs sm:text-sm">
                {confirmData.message || (
                  <>
                    Tem certeza que deseja excluir{" "}
                    <span className="font-semibold">{confirmData.nome}</span>?
                    Esta ação não poderá ser desfeita.
                  </>
                )}
              </p>
            </motion.div>
            <DialogFooter>
              <div className="flex items-center justify-between w-full gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmData(null)}
                  className="text-sm cursor-pointer text-zinc-600 hover:text-zinc-800 transition"
                >
                  Cancelar
                </button>
                <ActionButton
                  type="button"
                  textIdle="Confirmar exclusão"
                  enableRipplePulse
                  className="min-w-[180px] cursor-pointer bg-gradient-to-r from-red-600 to-rose-600"
                  onClick={async () => {
                    let shouldCloseModal = true;

                    try {
                      if (confirmData.action === "deleteCurso") {
                        const { deleteCurso } = await import(
                          "@/services/cursoService"
                        );

                        try {
                          const result = await deleteCurso(
                            String(confirmData.id),
                            confirmData.force || false
                          );

                          setCursosState((prev) =>
                            prev.filter((c) => c.id_curso !== confirmData.id)
                          );

                          const message =
                            result.deletedComponents || result.deletedQuestions
                              ? `Curso excluído junto com ${
                                  result.deletedComponents || 0
                                } componente(s) e ${
                                  result.deletedQuestions || 0
                                } pergunta(s) vinculada(s).`
                              : "Curso excluído.";

                          push({ kind: "success", message });

                          pushAudit({
                            action: "delete",
                            entity: "curso",
                            entityId: String(confirmData.id),
                            details: confirmData.nome,
                          });
                        } catch (err: any) {
                          console.log("Erro ao deletar curso:", err);

                          if (
                            err.response?.status === 409 &&
                            err.response?.data?.code === "HAS_LINKED_DATA"
                          ) {
                            const componentesCount =
                              err.response.data.componentesCount;
                            const perguntasCount =
                              err.response.data.perguntasCount;

                            setConfirmData({
                              open: true,
                              id: confirmData.id,
                              nome: confirmData.nome,
                              action: "deleteCurso",
                              force: true,
                              message: `Este curso possui ${componentesCount} componente(s) e ${perguntasCount} pergunta(s) vinculada(s). Ao excluir o curso, todos os dados vinculados também serão excluídos permanentemente. Deseja continuar?`,
                            });
                            shouldCloseModal = false;
                            return;
                          }

                          throw err;
                        }
                      } else if (confirmData.action === "deleteComponente") {
                        const { deleteComponente } = await import(
                          "@/services/componenteService"
                        );

                        try {
                          const result = await deleteComponente(
                            String(confirmData.id),
                            confirmData.force || false
                          );

                          setComponentesState((prev) =>
                            prev.filter(
                              (c) => c.id_componente !== confirmData.id
                            )
                          );

                          const message = result.deletedQuestions
                            ? `Componente excluído junto com ${result.deletedQuestions} pergunta(s) vinculada(s).`
                            : "Componente excluído.";

                          push({
                            kind: "success",
                            message,
                          });

                          pushAudit({
                            action: "delete",
                            entity: "componente",
                            entityId: String(confirmData.id),
                            details: confirmData.nome,
                          });
                        } catch (err: any) {
                          console.log("Erro ao deletar componente:", err);
                          console.log("Status:", err.response?.status);
                          console.log("Data:", err.response?.data);

                          if (
                            err.response?.status === 409 &&
                            err.response?.data?.code === "HAS_LINKED_QUESTIONS"
                          ) {
                            // Mostrar segundo popup de confirmação
                            const linkedCount =
                              err.response.data.linkedQuestionsCount;

                            console.log(
                              "Abrindo popup de confirmação com linkedCount:",
                              linkedCount
                            );

                            setConfirmData({
                              open: true,
                              id: confirmData.id,
                              nome: confirmData.nome,
                              action: "deleteComponente",
                              force: true,
                              message: `Este componente possui ${linkedCount} pergunta(s) vinculada(s). Ao excluir o componente, todas as perguntas vinculadas também serão excluídas permanentemente. Deseja continuar?`,
                            });
                            shouldCloseModal = false;
                            return; // Não fecha o modal e não re-lança erro
                          }

                          // Apenas re-throw outros erros (não relacionados a perguntas vinculadas)
                          throw err;
                        }
                      } else if (confirmData.action === "deletePergunta") {
                        const token = document.cookie
                          .split(";")
                          .map((c) => c.trim())
                          .find((c) => c.startsWith("token="))
                          ?.split("=")[1];
                        const { deletePergunta } = await import(
                          "@/services/perguntaService"
                        );
                        await deletePergunta(
                          String(confirmData.id),
                          token || ""
                        );
                        setPerguntasState((prev) =>
                          prev.filter((p) => p.id_pergunta !== confirmData.id)
                        );
                        push({
                          kind: "success",
                          message: "Pergunta excluída.",
                        });
                        pushAudit({
                          action: "delete",
                          entity: "pergunta",
                          entityId: String(confirmData.id),
                          details: confirmData.nome,
                        });
                      } else if (confirmData.action === "deleteResposta") {
                        const token = document.cookie
                          .split(";")
                          .map((c) => c.trim())
                          .find((c) => c.startsWith("token="))
                          ?.split("=")[1];
                        const { deleteResposta } = await import(
                          "@/services/respostaService"
                        );
                        await deleteResposta(
                          String(confirmData.id),
                          token || ""
                        );
                        setRespostasState((prev) =>
                          prev.filter((r) => r.id_resposta !== confirmData.id)
                        );
                        push({
                          kind: "success",
                          message: "Resposta excluída.",
                        });
                        pushAudit({
                          action: "delete",
                          entity: "resposta",
                          entityId: String(confirmData.id),
                          details: confirmData.nome,
                        });
                      } else if (confirmData.action === "deleteUser") {
                        const { deleteUser } = await import(
                          "@/services/userService"
                        );
                        await deleteUser(String(confirmData.id));
                        setUsersState((prev) =>
                          prev.filter((u) => u.id_usuario !== confirmData.id)
                        );
                        push({ kind: "success", message: "Usuário excluído." });
                        pushAudit({
                          action: "delete",
                          entity: "usuario",
                          entityId: String(confirmData.id),
                          details: confirmData.nome,
                        });
                      } else if (confirmData.action === "deleteGrupo") {
                        const { deleteGrupo } = await import(
                          "@/services/grupos/grupoService"
                        );
                        await deleteGrupo(String(confirmData.id));
                        setGruposState((prev) =>
                          prev.filter((g) => g.id_grupo !== confirmData.id)
                        );
                        push({ kind: "success", message: "Grupo excluído." });
                        pushAudit({
                          action: "delete",
                          entity: "grupo",
                          entityId: String(confirmData.id),
                          details: confirmData.nome,
                        });
                      }
                    } catch (e: any) {
                      push({
                        kind: "error",
                        message:
                          e?.response?.data?.message ||
                          e?.response?.data?.error ||
                          "Falha ao excluir.",
                      });
                    } finally {
                      if (shouldCloseModal) {
                        setConfirmData(null);
                      }
                    }
                  }}
                />
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Edit Curso Dialog */}
      <Dialog
        open={!!editCurso}
        onOpenChange={(v) => {
          if (!v && !savingEdit) setEditCurso(null);
        }}
      >
        {editCurso && (
          <DialogContent className="max-w-sm rounded-2xl bg-white border border-purple-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Editar Curso
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="rounded-lg border border-purple-100 bg-purple-50/60 px-3 py-2 flex gap-2 items-start">
                <Info className="w-4 h-4 mt-0.5 text-purple-600" />
                <p className="text-xs">
                  O nome passará pelo filtro de conteúdo.
                </p>
              </div>
              <input
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={editCurso.nome_curso}
                onChange={(e) =>
                  setEditCurso({ ...editCurso, nome_curso: e.target.value })
                }
              />
              {filtrarTexto(editCurso.nome_curso).contemPalavraOfensiva && (
                <p className="text-sm text-red-600 mt-1">
                  Remova palavras impróprias.
                </p>
              )}
            </div>
            <DialogFooter className="mt-4 flex justify-end">
              <ActionButton
                textIdle={
                  savingEdit
                    ? "Salvando..."
                    : savingSuccess
                    ? "Salvo"
                    : "Salvar alterações"
                }
                isLoading={savingEdit}
                isSuccess={savingSuccess}
                enableRipplePulse
                onClick={async () => {
                  if (!editCurso) return;
                  const check = filtrarTexto(editCurso.nome_curso);
                  if (check.contemPalavraOfensiva) {
                    push({
                      kind: "error",
                      message: "Nome contém palavras impróprias.",
                    });
                    return;
                  }
                  setSavingEdit(true);
                  setSavingSuccess(false);
                  try {
                    const { updateCurso } = await import(
                      "@/services/cursoService"
                    );
                    await updateCurso({
                      id: editCurso.id_curso,
                      nome: editCurso.nome_curso,
                    });
                    setCursosState((prev) =>
                      prev.map((c) =>
                        c.id_curso === editCurso.id_curso
                          ? { ...c, nome_curso: editCurso.nome_curso }
                          : c
                      )
                    );
                    push({ kind: "success", message: "Curso atualizado." });
                    pushAudit({
                      action: "update",
                      entity: "curso",
                      entityId: editCurso.id_curso,
                      details: editCurso.nome_curso,
                    });
                    setSavingSuccess(true);
                    setTimeout(() => setEditCurso(null), 900);
                  } catch (e: any) {
                    push({
                      kind: "error",
                      message:
                        e?.response?.data?.message ||
                        e?.response?.data?.error ||
                        "Falha ao atualizar curso.",
                    });
                  } finally {
                    setSavingEdit(false);
                  }
                }}
              />
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Edit Componente Dialog */}
      <Dialog
        open={!!editComponente}
        onOpenChange={(v) => {
          if (!v && !savingEdit) setEditComponente(null);
        }}
      >
        {editComponente && (
          <DialogContent className="max-w-sm rounded-2xl bg-white border border-purple-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Editar Componente
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="rounded-lg border border-purple-100 bg-purple-50/60 px-3 py-2 flex gap-2 items-start">
                <Info className="w-4 h-4 mt-0.5 text-purple-600" />
                <p className="text-xs">
                  Nome também validado contra palavras impróprias.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Nome do Componente
                </label>
                <input
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={editComponente.nome_componente}
                  onChange={(e) =>
                    setEditComponente({
                      ...editComponente,
                      nome_componente: e.target.value,
                    })
                  }
                />
                {filtrarTexto(editComponente.nome_componente)
                  .contemPalavraOfensiva && (
                  <p className="text-sm text-red-600 mt-1">
                    Remova palavras impróprias.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Curso
                </label>
                <select
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={editComponente.curso?.id_curso || ""}
                  onChange={(e) => {
                    const cursoSelecionado = cursosState.find(
                      (c) => c.id_curso === e.target.value
                    );
                    setEditComponente({
                      ...editComponente,
                      curso: cursoSelecionado
                        ? {
                            id_curso: cursoSelecionado.id_curso,
                            nome_curso: cursoSelecionado.nome_curso,
                          }
                        : undefined,
                    });
                  }}
                >
                  <option value="">Selecione um curso</option>
                  {cursosState.map((curso) => (
                    <option key={curso.id_curso} value={curso.id_curso}>
                      {curso.nome_curso}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter className="mt-4 flex justify-end">
              <ActionButton
                textIdle={
                  savingEdit
                    ? "Salvando..."
                    : savingSuccess
                    ? "Salvo"
                    : "Salvar alterações"
                }
                isLoading={savingEdit}
                isSuccess={savingSuccess}
                enableRipplePulse
                onClick={async () => {
                  if (!editComponente) return;
                  const check = filtrarTexto(editComponente.nome_componente);
                  if (check.contemPalavraOfensiva) {
                    push({
                      kind: "error",
                      message: "Nome contém palavras impróprias.",
                    });
                    return;
                  }
                  if (!editComponente.curso?.id_curso) {
                    push({
                      kind: "error",
                      message: "Selecione um curso.",
                    });
                    return;
                  }
                  setSavingEdit(true);
                  setSavingSuccess(false);
                  try {
                    const { updateComponente } = await import(
                      "@/services/componenteService"
                    );
                    await updateComponente({
                      id: editComponente.id_componente,
                      nome: editComponente.nome_componente,
                      fkIdCurso: editComponente.curso.id_curso,
                    });
                    setComponentesState((prev) =>
                      prev.map((c) =>
                        c.id_componente === editComponente.id_componente
                          ? {
                              ...c,
                              nome_componente: editComponente.nome_componente,
                              curso: editComponente.curso,
                            }
                          : c
                      )
                    );
                    push({
                      kind: "success",
                      message: "Componente atualizado.",
                    });
                    pushAudit({
                      action: "update",
                      entity: "componente",
                      entityId: editComponente.id_componente,
                      details: editComponente.nome_componente,
                    });
                    setSavingSuccess(true);
                    setTimeout(() => setEditComponente(null), 900);
                  } catch (e: any) {
                    push({
                      kind: "error",
                      message:
                        e?.response?.data?.message ||
                        e?.response?.data?.error ||
                        "Falha ao atualizar componente.",
                    });
                  } finally {
                    setSavingEdit(false);
                  }
                }}
              />
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Edit Grupo Dialog */}
      <Dialog
        open={!!editGrupo}
        onOpenChange={(v) => {
          if (!v && !savingEdit) setEditGrupo(null);
        }}
      >
        {editGrupo && (
          <DialogContent className="max-w-sm rounded-2xl bg-white border border-purple-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Editar Grupo
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="rounded-lg border border-purple-100 bg-purple-50/60 px-3 py-2 flex gap-2 items-start">
                <Info className="w-4 h-4 mt-0.5 text-purple-600" />
                <p className="text-xs">
                  Nome validado contra palavras impróprias.
                </p>
              </div>
              <input
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={editGrupo.nome_grupo}
                onChange={(e) =>
                  setEditGrupo({ ...editGrupo, nome_grupo: e.target.value })
                }
              />
              {filtrarTexto(editGrupo.nome_grupo).contemPalavraOfensiva && (
                <p className="text-sm text-red-600 mt-1">
                  Remova palavras impróprias.
                </p>
              )}
            </div>
            <DialogFooter className="mt-4 flex justify-end">
              <ActionButton
                textIdle={
                  savingEdit
                    ? "Salvando..."
                    : savingSuccess
                    ? "Salvo"
                    : "Salvar alterações"
                }
                isLoading={savingEdit}
                isSuccess={savingSuccess}
                enableRipplePulse
                onClick={async () => {
                  if (!editGrupo) return;
                  const check = filtrarTexto(editGrupo.nome_grupo);
                  if (check.contemPalavraOfensiva) {
                    push({
                      kind: "error",
                      message: "Nome contém palavras impróprias.",
                    });
                    return;
                  }
                  setSavingEdit(true);
                  setSavingSuccess(false);
                  try {
                    const token = document.cookie
                      .split(";")
                      .map((c) => c.trim())
                      .find((c) => c.startsWith("token="))
                      ?.split("=")[1];
                    const { updateGrupo } = await import(
                      "@/services/grupos/UpdateGrupo"
                    );
                    await updateGrupo(
                      {
                        id: editGrupo.id_grupo,
                        nome_grupo: editGrupo.nome_grupo,
                      },
                      token || ""
                    );
                    setGruposState((prev) =>
                      prev.map((g) =>
                        g.id_grupo === editGrupo.id_grupo
                          ? { ...g, nome_grupo: editGrupo.nome_grupo }
                          : g
                      )
                    );
                    push({ kind: "success", message: "Grupo atualizado." });
                    pushAudit({
                      action: "update",
                      entity: "grupo",
                      entityId: editGrupo.id_grupo,
                      details: editGrupo.nome_grupo,
                    });
                    setSavingSuccess(true);
                    setTimeout(() => setEditGrupo(null), 900);
                  } catch (e: any) {
                    push({
                      kind: "error",
                      message:
                        e?.response?.data?.message ||
                        e?.response?.data?.error ||
                        "Falha ao atualizar grupo.",
                    });
                  } finally {
                    setSavingEdit(false);
                  }
                }}
              />
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Audit Log Modal */}
      <Dialog open={openAudit} onOpenChange={setOpenAudit}>
        {openAudit && (
          <DialogContent className="max-w-2xl rounded-2xl bg-white/80 backdrop-blur-xl border border-purple-200 shadow-2xl ring-1 ring-purple-300/30">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-md">
                  <History className="w-5 h-5" />
                </span>
                Auditoria da Sessão
              </DialogTitle>
            </DialogHeader>
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
              <span>{auditLog.length} registros</span>
              <button
                type="button"
                onClick={() => {
                  setAuditLog([]);
                  localStorage.removeItem("auditLog");
                }}
                className="inline-flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition text-[11px]"
              >
                Limpar
              </button>
            </div>
            <div className="mt-3 max-h-[60vh] overflow-y-auto space-y-2 pr-1">
              {auditLog.length === 0 && (
                <div className="p-5 text-xs text-zinc-500 text-center border border-dashed rounded-lg">
                  Nenhum registro ainda.
                </div>
              )}
              {auditLog.map((entry, _i) => (
                <div
                  key={entry?.id ?? `audit-${entry?.ts ?? 0}-${_i}`}
                  className="group relative px-4 py-3 rounded-xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-800 tracking-wide">
                      {entry.action.toUpperCase()} {entry.entity}
                    </span>
                    <span className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                      {entry.details || "—"}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 ml-4 whitespace-nowrap">
                    {new Date(entry.ts).toLocaleString()}
                  </span>
                  <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-500/5 to-pink-500/10 transition" />
                </div>
              ))}
            </div>
            <DialogFooter className="mt-6">
              <div className="flex w-full justify-end">
                <ActionButton
                  textIdle="Fechar"
                  onClick={() => setOpenAudit(false)}
                  enableRipplePulse
                  className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600"
                />
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              if (!editUserLoading) {
                setEditUserSuccess(false);
                setEditUser(null);
              }
            }}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-purple-200 shadow-xl p-6">
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-4">
              Editar Usuário
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-500">
                  Nome
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={editUser.nome_usuario}
                  onChange={(e) => {
                    setEditUser({ ...editUser, nome_usuario: e.target.value });
                    const c = filtrarTexto(e.target.value);
                    setBadNomeUser(c.contemPalavraOfensiva);
                  }}
                />
                {badNomeUser && (
                  <p className="mt-1 text-sm text-red-600">
                    Remova palavras impróprias do nome.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500">
                  Apelido
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={editUser.apelido_usuario}
                  onChange={(e) => {
                    setEditUser({
                      ...editUser,
                      apelido_usuario: e.target.value,
                    });
                    const c = filtrarTexto(e.target.value);
                    setBadApelidoUser(c.contemPalavraOfensiva);
                  }}
                />
                {badApelidoUser && (
                  <p className="mt-1 text-sm text-red-600">
                    Remova palavras impróprias do apelido.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500">
                  Email
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={editUser.email_usuario}
                  onChange={(e) => {
                    setEditUser({ ...editUser, email_usuario: e.target.value });
                    const val = e.target.value;
                    setEmailStateEdit((prev) => ({ ...prev, touched: true }));
                    debouncedCheckEmailEdit(val);
                  }}
                />
                {emailStateEdit.touched && emailStateEdit.checking && (
                  <p className="mt-1 text-sm text-zinc-600">
                    Verificando email...
                  </p>
                )}
                {emailStateEdit.touched && emailStateEdit.error && (
                  <p className="mt-1 text-sm text-red-600">
                    {emailStateEdit.error}
                  </p>
                )}
                {emailStateEdit.touched &&
                  emailStateEdit.exists &&
                  editUser.email_usuario !== emailStateEdit.initial && (
                    <p className="mt-1 text-sm text-red-600">
                      Email já está em uso.
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500">
                  Tipo de usuário
                </label>
                <div className="relative mt-1">
                  <select
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-8"
                    value={String(editUser.fkIdTipoUsuario || "")}
                    onChange={(e) => {
                      setEditUser({
                        ...editUser,
                        fkIdTipoUsuario: e.target.value,
                      });
                    }}
                  >
                    {tipousuario.map((t: any) => {
                      const id = String(
                        t.id_tipousuario ??
                          t.id_tipoUsuario ??
                          t.id_tipo_usuario ??
                          t.id ??
                          t.pkId_tipoUsuario
                      );
                      const nome =
                        t.nome_tipousuario ??
                        t.nomeTipoUsuario ??
                        t.nome ??
                        t.descricao ??
                        "";
                      return (
                        <option key={id} value={id}>
                          {String(nome)}
                        </option>
                      );
                    })}
                  </select>
                  <ArrowRight className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 rotate-90" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                disabled={editUserLoading}
                onClick={() => {
                  if (!editUserLoading) {
                    setEditUserSuccess(false);
                    setEditUser(null);
                  }
                }}
                className="text-sm cursor-pointer text-zinc-600 hover:text-zinc-800"
              >
                Cancelar
              </button>
              <ActionButton
                textIdle={
                  editUserLoading
                    ? "Salvando..."
                    : editUserSuccess
                    ? "Salvo"
                    : "Salvar alterações"
                }
                isLoading={editUserLoading}
                isSuccess={editUserSuccess}
                enableRipplePulse
                disabled={
                  badNomeUser ||
                  badApelidoUser ||
                  (emailStateEdit.exists &&
                    editUser.email_usuario !== emailStateEdit.initial)
                }
                onClick={async () => {
                  if (!editUser) return;
                  setEditUserLoading(true);
                  setEditUserSuccess(false);
                  try {
                    // bad words check
                    const n1 = filtrarTexto(editUser.nome_usuario);
                    const n2 = filtrarTexto(editUser.apelido_usuario);
                    if (n1.contemPalavraOfensiva || n2.contemPalavraOfensiva) {
                      push({
                        kind: "error",
                        message: "Nome ou apelido contém palavras impróprias.",
                      });
                      setEditUserLoading(false);
                      return;
                    }
                    if (
                      emailStateEdit.exists &&
                      editUser.email_usuario !== emailStateEdit.initial
                    ) {
                      push({ kind: "error", message: "Email já está em uso." });
                      setEditUserLoading(false);
                      return;
                    }
                    const { updateUser } = await import(
                      "@/services/userService"
                    );
                    await updateUser({
                      id_usuario: editUser.id_usuario,
                      nome_usuario: editUser.nome_usuario,
                      apelido_usuario: editUser.apelido_usuario,
                      email_usuario: editUser.email_usuario,
                      senha_usuario: editUser.senha_usuario,
                      fkIdTipoUsuario: editUser.fkIdTipoUsuario,
                      foto_perfil: editUser.foto_perfil,
                    });
                    setUsersState((prev) =>
                      prev.map((u) =>
                        u.id_usuario === editUser.id_usuario ? editUser : u
                      )
                    );
                    setEditUserSuccess(true);
                    push({ kind: "success", message: "Usuário atualizado." });
                    setTimeout(() => {
                      setEditUser(null);
                    }, 900);
                  } catch (e: any) {
                    push({
                      kind: "error",
                      message:
                        e?.response?.data?.message ||
                        e?.response?.data?.error ||
                        "Falha ao atualizar usuário.",
                    });
                  } finally {
                    setEditUserLoading(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
