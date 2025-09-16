"use client";
import React, { useState } from "react";
import { useCreateGrupo } from "@/hooks/grupo/useCreate";
import { CreateGrupoData, Grupo } from "@/types/grupo";
import { User } from "@/types/user";
import { Componente } from "@/types/componente";
import { Input } from "@/components/ui/input";
import { MultiSelectCombobox } from "@/components/ui/comboxFilter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/userContext";
import { useListGruposByUser } from "@/hooks/grupo/useListByUser";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GroupsPageProps {
  users: User[];
  componentes: Componente[];
  grupos: Grupo[];
}

const GroupsPage: React.FC<GroupsPageProps> = ({
  users,
  componentes,
  grupos,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string>("");
  const [nomeGrupo, setNomeGrupo] = useState("");

  const { data: gruposData = [] } = useListGruposByUser(grupos);

  const createGrupo = useCreateGrupo();
  const router = useRouter();
  const { userId } = useUser();

  const handleCreateGroup = () => {
    if (!nomeGrupo) return;

    const data: CreateGrupoData = {
      nomeGrupo,
      membrosIds: selectedUserIds,
      fkIdComponente: selectedComponentId,
      createdById: userId!,
    };

    createGrupo.mutate(data, {
      onSuccess: () => {
        setSelectedUserIds([]);
        setSelectedComponentId("");
        setNomeGrupo("");
        setOpen(false);
      },
      onError: (error) => {
        console.error("Erro ao criar grupo:", error);
        console.log("Dados enviados:", data);
      },
    });
  };

  return (
    <div className="py-6 md:w-3/4 lg:w-2/3 min-h-screen max-w-[1200px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-purple-500 to-zinc-900">
            GRUPOS
          </h1>
          <h2 className="text-base text-zinc-600 w-3/6">
            Participe de conversas exclusivas com seus colegas em grupos
            fechados e compartilhe ideias, dúvidas e conhecimentos com mais
            liberdade e privacidade!
          </h2>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="w-[200px] bg-purple-600 p-3 rounded-lg text-white cursor-pointer hover:-translate-y-1 transition-all duration-300">
              Criar novo grupo
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crie seu grupo com seus colegas</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <Input
                label="Nome do grupo"
                placeholder="Nome do grupo"
                value={nomeGrupo}
                onChange={(e) => setNomeGrupo(e.target.value)}
              />

              <MultiSelectCombobox
                items={users}
                selectedIds={selectedUserIds}
                setSelectedIds={setSelectedUserIds}
                placeholder="Selecionar membros"
                getLabel={(user) => user.name}
              />

              <MultiSelectCombobox
                items={componentes}
                selectedIds={selectedComponentId ? [selectedComponentId] : []}
                setSelectedIds={(ids) => setSelectedComponentId(ids[0] || "")}
                placeholder="Selecionar componente"
                getLabel={(c) => c.nome}
              />
            </div>

            <DialogFooter>
              <button
                className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-900 transition-colors duration-300"
                onClick={handleCreateGroup}
                disabled={createGrupo.isPending}
              >
                {createGrupo.isPending ? "Criando..." : "Criar Grupo"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gruposData.map((group: any) => (
          <div key={group.id}>
            <Card
              className="hover:shadow-lg hover:-translate-y-1 hover:bg-purple-50 transition-all duration-300 cursor-pointer"
              onClick={() => router.push(`/groups/groupDetail/${group.id}`)}
            >
              <CardHeader>
                <CardTitle>{group.nomeGrupo}</CardTitle>
                <h2 className="text-sm text-zinc-600">
                  {group.componente?.nome}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center font-bold text-sm justify-between">
                  Membros{" "}
                  <span className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                    {group.membros?.map((membro: any) => (
                      <Avatar key={membro.id} className="w-8 h-8">
                        <AvatarImage
                          src={
                            membro.user.fotoPerfil ??
                            "/imagens/default-avatar.png"
                          }
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    ))}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsPage;
