"use client";

import { Input } from "../(UsuarioViews)/(public)/Auth/components/input";
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

export default function DashboardPage() {
  const [openDialog, setOpenDialog] = useState<
    null | "curso" | "componente" | "usuario"
  >(null);

  return (
    <div className="min-h-screen w-full bg-white text-black flex">
      <aside className="w-64 bg-gray-100 border-r p-4 flex flex-col gap-12">
        <div className="text-2xl font-bold text-purple-600">Admin Panel</div>

        <nav className="space-y-3">
          <a
            href="#"
            className="flex items-center gap-2 text-zinc-700 hover:text-purple-600"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-zinc-700 hover:text-purple-600"
          >
            <Users2 className="w-5 h-5" /> Usuários
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-zinc-700 hover:text-purple-600"
          >
            <FileWarning className="w-5 h-5" /> Denúncias
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-zinc-700 hover:text-purple-600"
          >
            <Settings className="w-5 h-5" /> Configurações
          </a>
        </nav>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-500">Ações Rápidas</h3>
          <button
            onClick={() => setOpenDialog("curso")}
            className="flex items-center gap-2 text-zinc-700 hover:text-purple-600 transition-colors"
          >
            <Plus className="w-5 h-5" /> Novo Curso
          </button>
          <button
            onClick={() => setOpenDialog("componente")}
            className="flex items-center gap-2 text-zinc-700 hover:text-purple-600 transition-colors"
          >
            <Plus className="w-5 h-5" /> Novo Componente
          </button>
          <button
            onClick={() => setOpenDialog("usuario")}
            className="flex items-center gap-2 text-zinc-700 hover:text-purple-600 transition-colors"
          >
            <Plus className="w-5 h-5" /> Novo Usuário
          </button>
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

        <footer className="text-center text-zinc-400 text-sm mt-12">
          &copy; {new Date().getFullYear()} Estudare. Todos os direitos
          reservados.
        </footer>
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
            <Input
              placeholder="Digite a descrição"
              label="Descrição do curso"
            />
            <Button type="submit">Salvar</Button>
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

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button type="submit">Salvar</Button>
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
            <Input placeholder="Email" label="Email" />
            <Input placeholder="Senha" type="password" label="Senha" />

            <Select>
              <SelectTrigger className="w-[300px] cursor-pointer">
                <SelectValue placeholder="Selecione o tipo do usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipos de usuario</SelectLabel>
                  <SelectItem value="apple">Aluno</SelectItem>
                  <SelectItem value="banana">Professor</SelectItem>
                  <SelectItem value="blueberry">Administrador</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button type="submit">Salvar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
