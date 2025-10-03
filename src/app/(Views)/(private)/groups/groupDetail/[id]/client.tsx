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

interface ClientGrupoDetailProps {
  grupoAtual: Grupo;
  users: User[];
  id_usuario_logado: string; // ID do usuário logado
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
  const [open, setOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const router = useRouter();

  const { data: grupoData } = useGrupoById(grupoAtual.id_grupo);

  const updateGrupoMutation = useUpdateGrupo();
  const removeMemberMutation = useRemoveGrupoMember();
  const leaveGroupMutation = useLeaveGroup();

  const handleAddMembers = () => {
    if (selectedUserIds.length === 0) return;

    const data: UpdateGrupoData = {
      id: grupoAtual.id_grupo,
      novosMembrosIds: selectedUserIds,
    };

    updateGrupoMutation.mutate(data, {
      onSuccess: () => {
        setSelectedUserIds([]);
        setOpen(false);
      },
      onError: (error: any) => {
        console.error("Erro ao adicionar membros:", error);
      },
    });
  };

  const handleRemoveMember = (membroId: string) => {
    removeMemberMutation.mutate(
      { grupoId: grupoAtual.id_grupo, membroId },
      {
        onError: (error: any) => {
          console.error("Erro ao remover membro:", error);
        },
      }
    );
  };

  const handleLeaveGroup = () => {
    leaveGroupMutation.mutate({ grupoId: grupoAtual.id_grupo });
    router.push("/groups");
  };

  // --- Chat ---
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3333"); // Backend
    socketRef.current = socket;

    socket.emit("join", grupoAtual.id_grupo);

    socket.on("historico", (msgs: Mensagem[]) => {
      setMensagens(msgs);
    });

    socket.on("mensagem_recebida", (msg: Mensagem) => {
      setMensagens((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [grupoAtual.id_grupo]);

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim()) return;

    const msgPayload = {
      text: novaMensagem,
      userId: id_usuario_logado,
      grupoId: grupoAtual.id_grupo,
    };

    socketRef.current?.emit("nova_mensagem", msgPayload);
    setNovaMensagem("");
  };

  useEffect(() => {
    // Scroll automático
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  return (
    <div className="p-4">
      {/* Grupo */}
      <h1 className="text-2xl font-bold">{grupoAtual.nome_grupo}</h1>

      <button
        className="p-2 mt-2 rounded-lg bg-red-500 text-white hover:bg-red-700 transition-colors"
        onClick={handleLeaveGroup}
        disabled={leaveGroupMutation.isPending}
      >
        {leaveGroupMutation.isPending ? "Saindo..." : "Sair do grupo"}
      </button>

      {/* Modal adicionar membros */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="w-[200px] mt-2 bg-purple-600 p-3 rounded-lg text-white cursor-pointer hover:-translate-y-1 transition-all duration-300">
            Adicionar novo membro
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicione um ou mais membros</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <MultiSelectCombobox
              items={users.map((u) => ({ id: u.id_usuario, ...u }))}
              selectedIds={selectedUserIds}
              setSelectedIds={setSelectedUserIds}
              placeholder="Selecionar membros"
              getLabel={(user) => user.nome_usuario}
            />
          </div>

          <DialogFooter>
            <button
              className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-900 transition-colors duration-300"
              onClick={handleAddMembers}
              disabled={updateGrupoMutation.isPending}
            >
              {updateGrupoMutation.isPending
                ? "Adicionando..."
                : "Adicionar membro(s)"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Criador e membros */}
      <h1 className="mt-4">
        Criador do grupo: {grupoAtual.usuario.nome_usuario}
      </h1>

      <h2 className="mt-4 mb-2 font-semibold">Membros:</h2>
      <div className="flex gap-4 overflow-x-auto">
        {grupoData?.membros?.map((membro: Membro) => (
          <div key={membro.id_membro} className="flex flex-col items-center">
            <img
              src={membro.usuario.foto_perfil ?? "/imagens/default-avatar.png"}
              alt={membro.usuario.nome_usuario}
              className="w-14 h-14 rounded-full object-cover"
            />
            <span className="text-sm mt-1">
              {membro.usuario.apelido_usuario}
            </span>
            {membro.usuario.id_usuario !== grupoAtual.fkId_usuario && (
              <button
                className="mt-1 text-red-500 text-xs hover:underline"
                onClick={() => handleRemoveMember(membro.id_membro)}
                disabled={removeMemberMutation.isPending}
              >
                {removeMemberMutation.isPending
                  ? "Removendo..."
                  : "Remover membro"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* --- CHAT --- */}
      <div className="mt-6">
        <h2 className="font-bold text-lg mb-2">Chat do grupo</h2>
        <div className="border p-2 rounded-lg h-64 overflow-y-auto mb-2 bg-gray-100 flex flex-col">
          {mensagens.map((m) => (
            <div
              key={m.id_mensagem}
              className={`mb-1 flex ${
                m.fkId_usuario === id_usuario_logado
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-1 rounded-lg max-w-xs break-words ${
                  m.fkId_usuario === id_usuario_logado
                    ? "bg-purple-600 text-white"
                    : "bg-white text-black"
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

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md"
            placeholder="Digite sua mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEnviarMensagem()}
          />
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
            onClick={handleEnviarMensagem}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
