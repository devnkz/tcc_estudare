"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCreateGrupo } from "@/hooks/grupo/useCreate";
import { CreateGrupoData, Grupo } from "@/types/grupo";
import { User } from "@/types/user";
import { Input } from "@/components/ui/input";
import { MultiSelectCombobox } from "@/components/ui/comboxFilter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListGruposByUser } from "@/hooks/grupo/useListByUser";
import Footer from "@/components/layout/footer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  PlusCircle,
  UserPlus,
  Loader2,
  Filter,
  Calendar,
  MessageCircleMore,
  ArrowUpAZ,
  ArrowDownAZ,
  Search,
} from "lucide-react";
import badWordsJSON from "@/utils/badWordsPT.json";

interface GroupsPageProps {
  users: User[];
  grupos: Grupo[];
  id_usuario: string;
  nome_usuario: string;
}

const GroupsPage: React.FC<GroupsPageProps> = ({
  users,
  grupos,
  id_usuario,
  nome_usuario,
}) => {
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchNome, setSearchNome] = useState("");
  const [alphaDir, setAlphaDir] = useState<"asc" | "desc">("asc");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [nome_grupo, setNome_Grupo] = useState("");
  const [nomeError, setNomeError] = useState<string | null>(null);
  const [toFocusId, setToFocusId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [nomeDirty, setNomeDirty] = useState(false);

  const { data: gruposData = [] } = useListGruposByUser(grupos);
  const createGrupo = useCreateGrupo();
  const router = useRouter();

  // refs to each group card for scroll-into-view
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // normalization & bad-words set
  function normalize(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[@4]/g, "a")
      .replace(/3/g, "e")
      .replace(/[1!]/g, "i")
      .replace(/0/g, "o")
      .replace(/\$/g, "s")
      .replace(/(\w)\1{2,}/g, "$1");
  }

  const badSet = useMemo(() => {
    const list = (badWordsJSON as any)?.words ?? [];
    return new Set<string>(list.map((w: string) => normalize(String(w))));
  }, []);

  function hasBadWordText(s: string) {
    if (!s) return false;
    const normalized = normalize(s)
      .replace(/[^a-z0-9\s]/g, " ")
      .trim();
    const tokens = normalized.split(/\s+/).filter(Boolean);
    return tokens.some((t) => badSet.has(t));
  }

  const handleCreateGroup = () => {
    setNomeError(null);
    if (!nome_grupo || selectedUserIds.length === 0) return;
    if (hasBadWordText(nome_grupo)) {
      setNomeError(
        "O nome do grupo contém palavras impróprias. Remova-as para continuar."
      );
      return;
    }
    const data: CreateGrupoData = {
      nome_grupo,
      membrosIds: selectedUserIds,
      createdById: id_usuario!,
    };
    createGrupo.mutate(data, {
      onSuccess: (novo) => {
        setSelectedUserIds([]);
        setNome_Grupo("");
        setOpen(false);
        // save id to scroll to after list refresh
        const newId = (novo as any)?.id_grupo || (novo as any)?.id || "";
        if (newId) setToFocusId(String(newId));
      },
    });
  };

  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

  // when list updates and we have an id to focus, scroll and highlight
  useEffect(() => {
    if (!toFocusId) return;
    const el = cardRefs.current[toFocusId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightId(toFocusId);
      const t = setTimeout(() => setHighlightId(null), 2200);
      // clear the focus id once scrolled
      const t2 = setTimeout(() => setToFocusId(null), 500);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
  }, [gruposData, toFocusId]);

  const filtered = useMemo(() => {
    let list = [...gruposData];
    if (searchNome.trim()) {
      const n = searchNome.trim().toLowerCase();
      list = list.filter((g) => g.nome_grupo.toLowerCase().includes(n));
    }
    // ordenação alfabética
    list.sort((a, b) => {
      const r = a.nome_grupo.localeCompare(b.nome_grupo, "pt-BR", {
        sensitivity: "base",
      });
      return alphaDir === "asc" ? r : -r;
    });
    return list;
  }, [gruposData, searchNome, alphaDir]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center text-zinc-900 font-inter "
      style={{
        paddingTop: headerHeight + 10,
      }}
    >
      {/* HEADER */}
      <div className="w-full px-6 md:px-10 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center py-6 md:py-10">
        {/* ILUSTRAÇÃO (ESQUERDA DESKTOP / ACIMA NO MOBILE) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center lg:justify-center mb-6 lg:mb-0"
        >
          <img
            src="/imagens/video_13543815.png"
            alt="Ilustração"
            className="max-w-md drop-shadow-md"
          />
        </motion.div>

        {/* TEXTO (DIREITA DESKTOP / ABAIXO NO MOBILE) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent flex items-center gap-3 mb-4">
            <MessageCircleMore className="w-10 h-10 text-grad text-shadow-purple-600 text-purple-600" />
            Grupos
          </h1>
          <p className="text-zinc-600 leading-relaxed text-lg mb-6">
            Participe de grupos privados com seus colegas e compartilhe
            conhecimento, dúvidas e ideias em um ambiente colaborativo.
          </p>

          {/* AÇÃO: CRIAR (filtro movido para cima da lista em desktop) */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-700  text-white px-5 py-3 rounded-xl cursor-pointer shadow-md hover: transition-all duration-300"
              >
                <PlusCircle className="w-5 h-5" />
                Criar novo grupo
              </motion.button>
            </DialogTrigger>

            <DialogContent className="bg-white rounded-xl shadow-xl p-7 ">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-purple-600 ">
                  Crie um novo grupo
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 py-4">
                <p>Nome do grupo: </p>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    hasBadWordText(nome_grupo) && nomeDirty
                      ? "border-red-500 focus:ring-red-400"
                      : "border-zinc-300 focus:ring-purple-500"
                  }`}
                  placeholder="Ex: Estudo de Matemática"
                  value={nome_grupo}
                  onChange={(e) => {
                    const v = e.target.value;
                    setNome_Grupo(v);
                    if (!nomeDirty) setNomeDirty(true);
                    if (hasBadWordText(v)) {
                      setNomeError(
                        "Este nome possui termos impróprios. Remova-os para prosseguir."
                      );
                    } else {
                      setNomeError(null);
                    }
                  }}
                  onBlur={() => setNomeDirty(true)}
                />
                {hasBadWordText(nome_grupo) && nomeDirty && !nomeError && (
                  <p className="text-red-600 text-sm mt-1">
                    Este nome possui termos impróprios. Remova-os para
                    prosseguir.
                  </p>
                )}
                {nomeError && (
                  <p className="text-red-600 text-sm mt-1">{nomeError}</p>
                )}

                <h1>Criador do grupo: {nome_usuario}</h1>

                <MultiSelectCombobox
                  items={users.map((u) => ({ id: u.id_usuario, ...u }))}
                  selectedIds={selectedUserIds}
                  setSelectedIds={setSelectedUserIds}
                  placeholder="Selecionar membros"
                  getLabel={(u) => u.nome_usuario}
                />
              </div>

              <DialogFooter>
                <button
                  onClick={handleCreateGroup}
                  disabled={createGrupo.isPending || hasBadWordText(nome_grupo)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-700 cursor-pointer hover:bg-fuchsia-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  {createGrupo.isPending ? (
                    <>
                      <Loader2 className="animate-spin cursor-pointer w-5 h-5" />{" "}
                      Criando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 cursor-pointer" /> Criar
                      Grupo
                    </>
                  )}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* (Filtro removido desta posição) */}
        </motion.div>
      </div>

      {/* FILTRO POSICIONADO ACIMA DA LISTA (desktop e mobile) */}
      <div className="w-full max-w-6xl px-6 md:px-10 mt-2 md:mt-4">
        <div className="flex items-center gap-2 w-full rounded-lg border border-zinc-300 bg-white shadow-sm p-1 pl-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Search className="w-4 h-4 text-zinc-500" />
            <input
              value={searchNome}
              onChange={(e) => setSearchNome(e.target.value)}
              placeholder="Buscar por nome"
              className="w-full text-sm bg-transparent focus:outline-none"
            />
          </div>
          <span className="hidden sm:block h-6 w-px bg-zinc-300 mx-1" />
          <div className="inline-flex items-center gap-1 p-1 rounded-md bg-zinc-50">
            <button
              type="button"
              onClick={() => setAlphaDir("asc")}
              className={`relative flex cursor-pointer items-center gap-1 px-3 py-2 rounded-md text-xs font-semibold transition select-none ${
                alphaDir === "asc"
                  ? "text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {alphaDir === "asc" && (
                <motion.span
                  layoutId="sortPill"
                  className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-[0_0_0_1px_rgba(147,51,234,0.45)]"
                  transition={{
                    type: "spring",
                    stiffness: 520,
                    damping: 32,
                    mass: 0.6,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
                <ArrowUpAZ className="w-4 h-4" /> A → Z
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAlphaDir("desc")}
              className={`relative flex items-center cursor-pointer gap-1 px-3 py-2 rounded-md text-xs font-semibold transition select-none ${
                alphaDir === "desc"
                  ? "text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {alphaDir === "desc" && (
                <motion.span
                  layoutId="sortPill"
                  className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-[0_0_0_1px_rgba(147,51,234,0.45)]"
                  transition={{
                    type: "spring",
                    stiffness: 520,
                    damping: 32,
                    mass: 0.6,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
                <ArrowDownAZ className="w-4 h-4" /> Z → A
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* GRUPOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl my-15 md:mt-10 px-4 md:px-0">
        <AnimatePresence>
          {filtered.map((group: Grupo) => (
            <motion.div
              className="gap-3 mb-3"
              key={group.id_grupo}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4 }}
            >
              <div className="snake-border-svg rounded-2xl">
                <svg
                  className="snake-svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {/* Rounded-rect path updated to corner radius 16px */}
                  <path
                    d="
    M 17,1 
    H 83 
    Q 99,1 99,17 
    V 83 
    Q 99,99 83,99 
    H 17 
    Q 1,99 1,83 
    V 17 
    Q 1,1 17,1 
    Z
  "
                    pathLength="100"
                  />
                </svg>
                <Card
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  onClick={() =>
                    router.push(`/groups/groupDetail/${group.id_grupo}`)
                  }
                  ref={(el: HTMLDivElement | null) => {
                    cardRefs.current[group.id_grupo] = el;
                  }}
                >
                  <CardHeader className="flex justify-between items-start gap-2">
                    <CardTitle
                      className={`text-lg font-semibold flex items-center gap-2 text-zinc-800 ${
                        highlightId === group.id_grupo
                          ? "ring-4 ring-purple-300/60 rounded-lg -m-1 p-1"
                          : ""
                      }`}
                    >
                      <Users className="w-5 h-5 text-purple-500" />
                      {group.nome_grupo}
                    </CardTitle>
                    {group.dataCriacao_grupo && (
                      <p className="text-[11px] text-zinc-500 flex-shrink-0">
                        Criado:{" "}
                        {new Date(group.dataCriacao_grupo).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="">
                    <p className="text-sm text-zinc-500 mb-5">
                      Espaço de aprendizado entre membros.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-700">
                        Membros
                      </span>
                      <div className="flex -space-x-2">
                        {group.membros?.slice(0, 5).map((membro) => (
                          <Avatar key={membro.id_membro} className="w-8 h-8">
                            <AvatarImage
                              src={
                                membro.usuario?.foto_perfil ??
                                "/imagens/default-avatar.png"
                              }
                            />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};

export default GroupsPage;
