"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  FileWarning,
  BookOpen,
  Puzzle,
  Layers,
  History,
  Plus,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

const navItems: NavItem[] = [
  { href: "#dashboard-root", label: "Dashboard", icon: LayoutDashboard },
  { href: "#manage-usuarios", label: "Usuários", icon: Users2 },
  { href: "#manage-denuncias", label: "Denúncias", icon: FileWarning },
  { href: "#manage-cursos", label: "Cursos", icon: BookOpen },
  { href: "#manage-componentes", label: "Componentes", icon: Puzzle },
  { href: "#manage-grupos", label: "Grupos", icon: Layers },
  { href: "#audit", label: "Auditoria", icon: History },
];

interface CreateAction {
  key: string;
  label: string;
  onClick: () => void;
}

// Vamos expor callbacks de criação via props para reusar a lógica existente do client.tsx
export function SidebarDashboard({
  onCreateCurso,
  onCreateComponente,
  onCreateUsuario,
  onOpenAudit,
  activeHash,
}: {
  onCreateCurso?: () => void;
  onCreateComponente?: () => void;
  onCreateUsuario?: () => void;
  onOpenAudit?: () => void;
  activeHash?: string;
}) {
  const pathname = usePathname();
  const [hover, setHover] = useState(false);

  // detectar hash ativa para highlight suave
  const hash =
    activeHash || (typeof window !== "undefined" ? window.location.hash : "");

  const createActions: CreateAction[] = useMemo(
    () => [
      { key: "curso", label: "Novo Curso", onClick: () => onCreateCurso?.() },
      {
        key: "componente",
        label: "Novo Componente",
        onClick: () => onCreateComponente?.(),
      },
      {
        key: "usuario",
        label: "Novo Usuário",
        onClick: () => onCreateUsuario?.(),
      },
    ],
    [onCreateCurso, onCreateComponente, onCreateUsuario]
  );

  // animação de width
  const widthExpanded = 250;
  const widthCollapsed = 68;

  // Colapsada por padrão; expande somente quando hover=true
  const effectiveCollapsed = !hover;

  return (
    <motion.aside
      className="group/sidebar hidden md:flex flex-col h-screen sticky top-0 border-r bg-white/80 backdrop-blur z-30"
      initial={{ width: widthCollapsed }}
      animate={{ width: effectiveCollapsed ? widthCollapsed : widthExpanded }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b">
        <span
          className="text-sm font-semibold text-zinc-700 tracking-wide overflow-hidden whitespace-nowrap transition-opacity"
          style={{ opacity: effectiveCollapsed ? 0 : 1 }}
        >
          Admin Panel
        </span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300/50 scrollbar-track-transparent px-2 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = hash === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`relative group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
               ${
                 active
                   ? "bg-purple-100 text-purple-700"
                   : "text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100"
               }`}
              onClick={(e) => {
                // Auditoria abre modal
                if (item.label === "Auditoria") {
                  e.preventDefault();
                  onOpenAudit?.();
                  return;
                }
                // Smooth scroll para âncoras internas
                if (item.href.startsWith("#")) {
                  e.preventDefault();
                  const el = document.querySelector(item.href);
                  if (el) {
                    (el as HTMLElement).scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  } else {
                    // fallback: altera hash para permitir padrão do navegador
                    window.location.hash = item.href;
                  }
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <Icon size={18} className="shrink-0" />
              <span
                className="overflow-hidden whitespace-nowrap"
                style={{ opacity: effectiveCollapsed ? 0 : 1 }}
              >
                {item.label}
              </span>
              {/* Indicator animado */}
              <AnimatePresence>
                {active && !effectiveCollapsed && (
                  <motion.span
                    layoutId="sidebar-active-dot"
                    className="absolute right-2 h-2 w-2 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 shadow"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </AnimatePresence>
            </a>
          );
        })}
      </nav>

      {/* Ações de criação */}
      <div className="border-t px-3 py-3 space-y-2">
        <AnimatePresence initial={false}>
          {!effectiveCollapsed && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="space-y-2"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Criar
              </p>
              {createActions.map((act) => (
                <button
                  key={act.key}
                  onClick={act.onClick}
                  className="group/action w-full flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 text-white px-3 py-2 text-xs font-medium shadow-sm hover:shadow transition relative overflow-hidden cursor-pointer"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/20">
                    <Plus size={14} />
                  </span>
                  <span className="whitespace-nowrap">{act.label}</span>
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 bg-white/10 opacity-0 group-hover/action:opacity-100 transition"
                  />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estado colapsado: botão único de criar (abre menu radial no futuro) */}
        <AnimatePresence initial={false}>
          {effectiveCollapsed && (
            <motion.button
              key="fab"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onCreateCurso?.()}
              className="w-10 h-10 rounded-full mx-auto flex items-center justify-center bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow hover:shadow-md transition cursor-pointer"
              aria-label="Novo"
            >
              <Plus size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
