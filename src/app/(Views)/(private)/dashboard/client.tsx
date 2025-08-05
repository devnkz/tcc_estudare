"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {  FileWarning } from "lucide-react";
import { LayoutDashboard, Users2, Settings } from "lucide-react";
import Footer from "@/components/layout/footer";
import { SignUpCursoModal } from "./Sign-up-modals/curso";
import { SignUpComponenteModal } from "./Sign-up-modals/componente";
import { SignUpUserModal } from "./Sign-up-modals/usuario";


export default function DashboardPage({
  tipousuario,
  cursos,
}: {
  tipousuario: any[];
  cursos: any[];
}) {
  const [openDialog, setOpenDialog] = useState<
    null | "curso" | "componente" | "usuario"
  >(null);

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

  const linksNavigation = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "#",
    },
    {
      name: "Usuários",
      icon: Users2,
      href: "#",
    },
    {
      name: "Denúncias",
      icon: FileWarning,
      href: "#",
    },
    {
      name: "Configurações",
      icon: Settings,
      href: "#",
    },
  ];
  

  return (
    <div className="min-h-screen w-full bg-white text-black flex">
      <aside className="w-64 bg-gray-100 border-r p-4 flex flex-col gap-12">
        <div className="text-2xl font-bold text-purple-600">Admin Panel</div>

        <nav className="space-y-3">
          {linksNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-2 text-zinc-700 hover:text-purple-600"
            >
              <item.icon className="w-5 h-5" /> {item.name}
            </a>
          ))}
        </nav>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-500">Ações Rápidas</h3>
          {PlusButtons.map((item) => (
            <button
              key={item.name}
              onClick={item.onClick}
              className="flex items-center gap-2 text-zinc-700 hover:text-purple-600 transition-colors"
            >
              <item.icon className="w-5 h-5" /> {item.name}
            </button>
          ))}
        </div>
      </aside>
      <main className="flex-1 p-8 space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <Footer />
      </main>

      <SignUpCursoModal setOpenDialog={setOpenDialog} openDialog={openDialog} />
      <SignUpComponenteModal setOpenDialog={setOpenDialog} openDialog={openDialog} cursos={cursos}/>
      <SignUpUserModal setOpenDialog={setOpenDialog} openDialog={openDialog} tipousuarios={tipousuario} />
    </div>
  );
}
