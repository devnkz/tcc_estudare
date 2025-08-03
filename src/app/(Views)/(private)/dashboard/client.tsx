"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { Plus } from "lucide-react";
import { BarChart3, FileWarning, ActivityIcon } from "lucide-react";
import { LayoutDashboard, Users2, Settings } from "lucide-react";
import Footer from "@/components/layout/footer";

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

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-zinc-500 text-sm">Total de Usuários</p>
                <p className="text-lg font-semibold text-zinc-800">1.240</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <FileWarning className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-zinc-500 text-sm">Denúncias Pendentes</p>
                <p className="text-lg font-semibold text-zinc-800">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <ActivityIcon className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-zinc-500 text-sm">Atividades Recentes</p>
                <p className="text-lg font-semibold text-zinc-800">87</p>
              </div>
            </div>
          </div>
        </div>

        {/* Atividades recentes */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
          <ul className="space-y-3">
            <li className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              Usuário <span className="font-medium">joao123</span> fez uma
              pergunta.
              <span className="text-zinc-400 text-sm ml-2">há 5 min</span>
            </li>
            <li className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              Pergunta{" "}
              <span className="font-medium">
                "Qual a capital da Austrália?"
              </span>{" "}
              foi denunciada.
              <span className="text-zinc-400 text-sm ml-2">há 10 min</span>
            </li>
            <li className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              Novo usuário <span className="font-medium">ana_dev</span> se
              registrou.
              <span className="text-zinc-400 text-sm ml-2">há 15 min</span>
            </li>
          </ul>
        </section>

        <Footer />
      </main>

      <Dialog
        open={openDialog === "curso"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Curso</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <Input placeholder="Digite o nome do curso" label="Nome do curso" />
            <Button textButton="Confirmar" rotaRedirecionamento="#" />
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog === "componente"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Componente</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <Input
              placeholder="Digite o nome do componente"
              label="Nome do componente"
            />

            <label className="text-sm">Selecione o curso do componente</label>
            <Select>
              <SelectTrigger className="w-full bg-zinc-200 rounded-sm hover:border-purple-600 cursor-pointer">
                <SelectValue placeholder="Selecione o curso que esse componente pertence" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Cursos</SelectLabel>
                  {cursos.length > 0 ? (
                    cursos.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.nomeCurso}
                      </SelectItem>
                    ))
                  ) : (
                    <div>Nenhum encontrado</div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button textButton="Confirmar" rotaRedirecionamento="#" />
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog === "usuario"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Usuário</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <Input placeholder="Nome completo" label="Nome" />
            <Input placeholder="Digite seu apelido" label="Apelido" />
            <Input placeholder="Email" label="Email" />
            <Input placeholder="Senha" type="password" label="Senha" />

            <label className="text-sm">Tipo do usuário</label>
            <Select>
              <SelectTrigger
                className="w-full mt-2 rounded-sm text-base cursor-pointer bg-zinc-200 hover:border-purple-600
              trasition-all duration-300"
              >
                <SelectValue placeholder="Selecione o tipo do usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipos de usuario</SelectLabel>
                  {tipousuario.length > 0 ? (
                    tipousuario.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.nomeTipoUsuario}
                      </SelectItem>
                    ))
                  ) : (
                    <div>Nenhum encontrado</div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button textButton="Confirmar" rotaRedirecionamento="#" />
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
