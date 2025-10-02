"use client";

import { Grupo, Membro } from "@/types/grupo";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MultiSelectCombobox } from "@/components/ui/comboxFilter";
import { User } from "@/types/user";
import { useState } from "react";
import { useUpdateGrupo, UpdateGrupoData } from "@/hooks/grupo/useUpdate";
import { useRemoveGrupoMember } from "@/hooks/grupo/useRemoveMember";
import { useLeaveGroup } from "@/hooks/grupo/useLeave";
import { useRouter } from "next/navigation";
import { useGrupoById } from "@/hooks/grupo/useListById";

interface ClientGrupoDetailProps {
  grupoAtual: Grupo;
  users: User[];
}

export default function ClientGrupoDetail({
  grupoAtual,
  users,
}: ClientGrupoDetailProps) {
  const [open, setOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const router = useRouter();

  const { data: grupoData } = useGrupoById(grupoAtual.id_grupo);
  console.log("Grupo data do react-query: ", grupoData);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{grupoAtual.nome_grupo}</h1>

      <button
        className="p-2 mt-2 rounded-lg bg-red-500 text-white hover:bg-red-700 transition-colors"
        onClick={handleLeaveGroup}
        disabled={leaveGroupMutation.isPending}
      >
        {leaveGroupMutation.isPending ? "Saindo..." : "Sair do grupo"}
      </button>

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

      <h1>Criador do grupo: {grupoAtual.usuario.nome_usuario}</h1>

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
    </div>
  );
}
