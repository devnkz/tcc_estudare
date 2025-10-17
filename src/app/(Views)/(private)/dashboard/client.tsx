"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FileWarning } from "lucide-react";
import { LayoutDashboard, Users2, Settings } from "lucide-react";
import Footer from "@/components/layout/footer";
import { SignUpCursoModal } from "./Create-modals/curso";
import { SignUpComponenteModal } from "./Create-modals/componente";
import { SignUpUserModal } from "./Create-modals/usuario";
import { Denuncia } from "@/types/denuncia";
import { Curso } from "@/types/curso";
import { PenalidadeModal } from "./Create-modals/penalidade";

export default function DashboardPage({
  tipousuario,
  cursos,
  denuncias,
}: {
  tipousuario: any[];
  cursos: Curso[];
  denuncias: Denuncia[];
}) {
  const [openDialog, setOpenDialog] = useState<
    null | "curso" | "componente" | "usuario"
  >(null);

  // estado para penalidade
  const [openPenalidade, setOpenPenalidade] = useState(false);
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(
    null
  );

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
    { name: "Dashboard", icon: LayoutDashboard, href: "#" },
    { name: "Usuários", icon: Users2, href: "#" },
    { name: "Denúncias", icon: FileWarning, href: "#" },
    { name: "Configurações", icon: Settings, href: "#" },
  ];

  // função de submissão da penalidade
  const handleSubmitPenalidade = (data: any) => {
    console.log("Criando penalidade:", data);
    // aqui você pode chamar seu hook ou API
    setOpenPenalidade(false);
  };

  return (
    <div className="min-h-screen w-full bg-white text-black flex mt-24">
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

        <div className="space-y-4">
          {denuncias
            .slice()
            .sort((a, b) => {
              const prioridadeA =
                a.nivel_denuncia * (a.usuario.credibilidade_usuario / 100);
              const prioridadeB =
                b.nivel_denuncia * (b.usuario.credibilidade_usuario / 100);
              return prioridadeB - prioridadeA;
            })
            .map((denuncia) => {
              const nivel = denuncia.nivel_denuncia;

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
                  className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 bg-zinc-50 rounded-2xl shadow-md border border-zinc-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex flex-col gap-1 text-sm sm:text-base">
                    <span className="text-zinc-500">
                      Nova denúncia de{" "}
                      <span className="font-semibold text-zinc-800">
                        {denuncia.usuario.nome_usuario}
                      </span>
                    </span>
                    <span className="text-zinc-500 text-xs">
                      Credibilidade do usuário:{" "}
                      <span className="font-semibold">
                        {denuncia.usuario.credibilidade_usuario}
                      </span>
                    </span>
                    <span className="text-zinc-500 text-xs">
                      Tipo de conteudo denunciado:{" "}
                      <span className="font-semibold">
                        {denuncia.tipo_conteudo}
                      </span>
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(denuncia.dataCriacao_denuncia).toLocaleString()}
                    </span>
                    <span className="text-zinc-600 italic">
                      Motivo: {denuncia.descricao}
                    </span>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          denuncia.status === "pendente"
                            ? "bg-yellow-100 text-yellow-700"
                            : denuncia.status === "resolvida"
                            ? "bg-green-100 text-green-700"
                            : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {denuncia.status}
                      </span>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${nivelColor}`}
                      >
                        {nivelLabel} ({nivel})
                      </span>
                    </div>

                    <div className="flex gap-2 mt-1 flex-wrap">
                      <button
                        className="px-3 py-1 text-xs rounded-lg bg-purple-200 text-purple-800 hover:bg-purple-300 transition-colors shadow-sm"
                        onClick={() => {
                          const tipo = denuncia.tipo_conteudo; // Pergunta ou Resposta
                          const id =
                            denuncia.fkId_conteudo_denunciado ||
                            denuncia.id_denuncia; // ajuste conforme sua estrutura
                          const url = `/home?tipo_conteudo=${tipo}&id_conteudo=${id}`;
                          window.open(url, "_blank"); // abre em nova aba
                        }}
                      >
                        👁 Visualizar
                      </button>

                      <button
                        className="px-3 py-1 text-xs rounded-lg bg-red-200 text-red-800 hover:bg-red-300 transition-colors shadow-sm"
                        onClick={() => {
                          setSelectedDenuncia(denuncia);
                          setOpenPenalidade(true);
                        }}
                      >
                        ⚠ Penalidade
                      </button>

                      <button className="px-3 py-1 text-xs rounded-lg bg-green-200 text-green-800 hover:bg-green-300 transition-colors shadow-sm">
                        ✅ Concluir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <Footer />
      </main>

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
        />
      )}
    </div>
  );
}
