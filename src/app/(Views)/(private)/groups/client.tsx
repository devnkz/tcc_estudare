"use client";

import React, { useEffect, useState } from "react";
import { useCreateGrupo } from "@/hooks/grupo/useCreate";
import { CreateGrupoData, Grupo } from "@/types/grupo";
import { User } from "@/types/user";
import { Input } from "@/components/ui/input";
import { MultiSelectCombobox } from "@/components/ui/comboxFilter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListGruposByUser } from "@/hooks/grupo/useListByUser";
import Footer from "@/components/layout/footer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  PlusCircle,
  UserPlus,
  Loader2,
  Sparkles,
  UserRound,
  MessageCircle,
  MessageCircleMore,
} from "lucide-react";

interface GroupsPageProps {
  users: User[];
  grupos: Grupo[];
  id_usuario: string;
  nome_usuario: string;
}

const GroupsPage: React.FC<GroupsPageProps> = ({
  users,
  grupos,
  id_usuario,
  nome_usuario,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [nome_grupo, setNome_Grupo] = useState("");

  const { data: gruposData = [] } = useListGruposByUser(grupos);
  const createGrupo = useCreateGrupo();
  const router = useRouter();

  const handleCreateGroup = () => {
    if (!nome_grupo || selectedUserIds.length === 0) return;
    const data: CreateGrupoData = {
      nome_grupo,
      membrosIds: selectedUserIds,
      createdById: id_usuario!,
    };
    createGrupo.mutate(data, {
      onSuccess: () => {
        setSelectedUserIds([]);
        setNome_Grupo("");
        setOpen(false);
      },
    });
  };

  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center text-zinc-900 font-inter "
      style={{ paddingTop: headerHeight + 10 }}
    >
      {/* HEADER */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent flex items-center gap-3 mb-4">
            <MessageCircleMore className="w-10 h-10 text-grad text-shadow-purple-600 text-purple-600" />
            Grupos
          </h1>
          <p className="text-zinc-600 leading-relaxed text-lg mb-6">
            Participe de grupos privados com seus colegas e compartilhe
            conhecimento, dúvidas e ideias em um ambiente colaborativo.
          </p>

          {/* BOTÃO CRIAR GRUPO */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-700  text-white px-5 py-3 rounded-xl cursor-pointer shadow-md hover: transition-all duration-300"
              >
                <PlusCircle className="w-5 h-5" />
                Criar novo grupo
              </motion.button>
            </DialogTrigger>

            <DialogContent className="bg-white rounded-xl shadow-xl p-7 ">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-purple-600">
                  Crie um novo grupo
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 py-4">
                <p>Nome do grupo: </p>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="Ex: Estudo de Matemática"
                  value={nome_grupo}
                  onChange={(e) => setNome_Grupo(e.target.value)}
                />

                <h1>Criador do grupo: {nome_usuario}</h1>

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
                  onClick={handleCreateGroup}
                  disabled={createGrupo.isPending}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-700 cursor-pointer hover:bg-fuchsia-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  {createGrupo.isPending ? (
                    <>
                      <Loader2 className="animate-spin cursor-pointer w-5 h-5" />{" "}
                      Criando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 cursor-pointer" /> Criar
                      Grupo
                    </>
                  )}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* ILUSTRAÇÃO */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center lg:justify-end"
        >
          <img
            src="/imagens/laptop_13543834.png"
            alt="Ilustração"
            className="w-6/7 max-w-sm drop-shadow-md"
          />
        </motion.div>
      </div>

      {/* GRUPOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        <AnimatePresence>
          {gruposData.map((group: Grupo) => (
            <motion.div
              className="gap-3 mb-3"
              key={group.id_grupo}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4 }}
            >
              <Card
                className="group bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                onClick={() =>
                  router.push(`/groups/groupDetail/${group.id_grupo}`)
                }
              >
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-zinc-800">
                    <Users className="w-5 h-5 text-purple-500" />
                    {group.nome_grupo}
                  </CardTitle>
                </CardHeader>

                <CardContent className="">
                  <p className="text-sm text-zinc-500 mb-5">
                    Espaço de aprendizado entre membros.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-700">
                      Membros
                    </span>
                    <div className="flex -space-x-2">
                      {group.membros?.slice(0, 5).map((membro) => (
                        <Avatar key={membro.id_membro} className="w-8 h-8">
                          <AvatarImage
                            src={
                              membro.usuario?.foto_perfil ??
                              "/imagens/default-avatar.png"
                            }
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};

export default GroupsPage;
