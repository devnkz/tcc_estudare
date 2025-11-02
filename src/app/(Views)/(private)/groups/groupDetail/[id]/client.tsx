"use client";

import { Grupo, Membro } from "@/types/grupo";
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
import { useUpdateGrupo, UpdateGrupoData } from "@/hooks/grupo/useUpdate";
import { useRemoveGrupoMember } from "@/hooks/grupo/useRemoveMember";
import { useLeaveGroup } from "@/hooks/grupo/useLeave";
import { useGrupoById } from "@/hooks/grupo/useListById";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";

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
}

export default function ClientGrupoDetail({
  grupoAtual,
  users,
  id_usuario_logado,
}: ClientGrupoDetailProps) {
  const [grupo, setGrupo] = useState(grupoAtual); // <--- estado local
  const [open, setOpen] = useState(false);
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [novoNome, setNovoNome] = useState(grupoAtual.nome_grupo);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const router = useRouter();

  const { data: grupoData } = useGrupoById(grupo.id_grupo);
  const updateGrupoMutation = useUpdateGrupo();
  const removeMemberMutation = useRemoveGrupoMember();
  const leaveGroupMutation = useLeaveGroup();

  const handleAddMembers = () => {
    if (selectedUserIds.length === 0) return;

    const data: UpdateGrupoData = {
      id: grupo.id_grupo,
      novosMembrosIds: selectedUserIds,
    };

    updateGrupoMutation.mutate(data, {
      onSuccess: () => {
        setSelectedUserIds([]);
        setOpen(false);
      },
      onError: (error: any) =>
        console.error("Erro ao adicionar membros:", error),
    });
  };

  const handleEditGroup = () => {
    if (!novoNome.trim()) return;

    const data: UpdateGrupoData = {
      id: grupo.id_grupo,
      nome_grupo: novoNome,
    };

    updateGrupoMutation.mutate(data, {
      onSuccess: () => {
        setGrupo((prev) => ({ ...prev, nome_grupo: novoNome })); // atualiza o frontend
        setEditNameOpen(false);
      },
      onError: (error: any) => console.error("Erro ao renomear grupo:", error),
    });
  };

  const handleRemoveMember = (membroId: string) => {
    removeMemberMutation.mutate(
      { grupoId: grupo.id_grupo, membroId },
      {
        onError: (error: any) =>
          console.error("Erro ao remover membro:", error),
      }
    );
  };

  const handleLeaveGroup = () => {
    leaveGroupMutation.mutate({ grupoId: grupo.id_grupo });
    router.push("/groups");
  };

  // --- Chat ---
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket: Socket = io("http://localhost:3333");
    socketRef.current = socket;

    socket.emit("join", grupo.id_grupo);

    socket.on("historico", (msgs: Mensagem[]) => setMensagens(msgs));
    socket.on("mensagem_recebida", (msg: Mensagem) =>
      setMensagens((prev) => [...prev, msg])
    );

    return () => {
      socket.disconnect();
    };
  }, [grupo.id_grupo]);

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim()) return;

    const msgPayload = {
      text: novaMensagem,
      userId: id_usuario_logado,
      grupoId: grupo.id_grupo,
    };

    socketRef.current?.emit("nova_mensagem", msgPayload);
    setNovaMensagem("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

  return (
    <div
      className="flex justify-center px-4"
      style={{ paddingTop: headerHeight + 20 }}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md border border-zinc-200 p-6 flex flex-col gap-6">
        {/* Topo */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-3xl font-bold text-purple-700 break-words">
            {grupo.nome_grupo}
          </h1>

          <div className="flex gap-2 flex-wrap">
            {/* Editar grupo */}
            <Dialog open={editNameOpen} onOpenChange={setEditNameOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-all text-sm font-medium">
                  <PencilIcon className="h-4 w-4" />
                  Editar nome
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar nome do grupo</DialogTitle>
                </DialogHeader>
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full border border-zinc-300 rounded-md p-2"
                />
                <DialogFooter>
                  <button
                    onClick={handleEditGroup}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-all"
                  >
                    Salvar alterações
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Adicionar membros */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-all text-sm font-medium">
                  <PlusIcon className="h-4 w-4" />
                  Adicionar membros
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar novo(s) membro(s)</DialogTitle>
                </DialogHeader>

                <MultiSelectCombobox
                  items={users.map((u) => ({ id: u.id_usuario, ...u }))}
                  selectedIds={selectedUserIds}
                  setSelectedIds={setSelectedUserIds}
                  placeholder="Selecionar membros"
                  getLabel={(user) => user.nome_usuario}
                />

                <DialogFooter>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-all"
                    onClick={handleAddMembers}
                    disabled={updateGrupoMutation.isPending}
                  >
                    {updateGrupoMutation.isPending
                      ? "Adicionando..."
                      : "Adicionar"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Sair */}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
              onClick={handleLeaveGroup}
              disabled={leaveGroupMutation.isPending}
            >
              {leaveGroupMutation.isPending ? "Saindo..." : "Sair do grupo"}
            </button>
          </div>
        </div>

        {/* Criador */}
        <p className="text-sm text-gray-600">
          Criado por{" "}
          <span className="text-purple-700 font-medium">
            {grupo.usuario.nome_usuario}
          </span>
        </p>

        {/* Membros */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Membros do grupo
          </h2>
          <div className="flex gap-6 flex-wrap">
            {grupoData?.membros?.map((membro: Membro) => (
              <div
                key={membro.id_membro}
                className="flex flex-col items-center"
              >
                <img
                  src={
                    membro.usuario.foto_perfil ?? "/imagens/default-avatar.png"
                  }
                  alt={membro.usuario.nome_usuario}
                  className="w-14 h-14 rounded-full object-cover border border-zinc-200"
                />
                <span className="text-sm mt-1 font-medium">
                  {membro.usuario.apelido_usuario}
                </span>
                {membro.usuario.id_usuario !== grupo.fkId_usuario && (
                  <button
                    className="mt-1 text-red-500 text-xs hover:underline"
                    onClick={() => handleRemoveMember(membro.id_membro)}
                    disabled={removeMemberMutation.isPending}
                  >
                    {removeMemberMutation.isPending
                      ? "Removendo..."
                      : "Remover"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div>
          <h2 className="font-semibold text-lg text-gray-800 mb-3">
            Chat do grupo
          </h2>

          <div className="border border-zinc-200 rounded-lg bg-gray-50 h-72 p-3 overflow-y-auto">
            {mensagens.map((m) => (
              <div
                key={m.id_mensagem}
                className={`mb-2 flex ${
                  m.fkId_usuario === id_usuario_logado
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs break-words shadow-sm ${
                    m.fkId_usuario === id_usuario_logado
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <span className="font-bold text-sm mr-1">
                    {m.usuario.apelido_usuario}:
                  </span>
                  <span className="text-sm">{m.mensagem}</span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2 mt-3">
            <input
              type="text"
              className="flex-1 p-2 border border-zinc-300 rounded-md"
              placeholder="Digite sua mensagem..."
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnviarMensagem()}
            />
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-all"
              onClick={handleEnviarMensagem}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
