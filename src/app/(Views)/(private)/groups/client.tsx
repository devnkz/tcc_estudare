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
  grupos: Grupo[];
}

const GroupsPage: React.FC<GroupsPageProps> = ({ users, grupos }) => {
  const [open, setOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [nome_grupo, setNome_Grupo] = useState("");

  const { data: gruposData = [] } = useListGruposByUser(grupos);
  const createGrupo = useCreateGrupo();
  const router = useRouter();
  const { userId } = useUser();

  const handleCreateGroup = () => {
    if (!nome_grupo || selectedUserIds.length === 0) {
      console.warn("Preencha todos os campos!", nome_grupo, selectedUserIds);
      return;
    }

    const data: CreateGrupoData = {
      nome_grupo,
      membrosIds: selectedUserIds,
      createdById: userId!,
    };

    console.log("Data: ", data);

    createGrupo.mutate(data, {
      onSuccess: () => {
        setSelectedUserIds([]);
        setNome_Grupo("");
        setOpen(false);
      },
      onError: (error) => {
        console.error("Erro ao criar grupo:", error);
        console.log("Dados enviados:", data);
      },
    });
  };

  return (
    <div className="py-6 md:w-3/4 lg:w-2/3 min-h-screen max-w-[1200px] flex flex-col gap-6">
      {/* HEADER */}
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

        {/* DIALOG CRIAR GRUPO */}
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
                value={nome_grupo}
                onChange={(e) => setNome_Grupo(e.target.value)}
              />

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

      {/* GRUPOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gruposData.map((group: Grupo) => (
          <Card
            key={group.id_grupo}
            className="hover:shadow-lg hover:-translate-y-1 hover:bg-purple-50 transition-all duration-300 cursor-pointer"
            onClick={() => router.push(`/groups/groupDetail/${group.id_grupo}`)}
          >
            <CardHeader>
              <CardTitle>{group.nome_grupo}</CardTitle>
              <p className="text-zinc-600 text-sm">
                Bem-vindos! Aproveitem e estudem bastante.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center font-bold text-sm justify-between">
                Membros{" "}
                <span className="flex -space-x-2">
                  {group.membros?.map((membro) => (
                    <Avatar key={membro.id_membro} className="w-8 h-8">
                      <AvatarImage
                        src={
                          membro.usuario?.foto_perfil ??
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
        ))}
      </div>
    </div>
  );
};

export default GroupsPage;
