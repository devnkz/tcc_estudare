"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Resposta } from "@/types/resposta";
import { useUpdateResposta } from "@/hooks/resposta/useUpdate";
import { useState } from "react";

interface ModalUpdateResponseProps {
  resposta: Resposta;
}

export default function ModalUpdateResponse({
  resposta,
}: ModalUpdateResponseProps) {
  const [conteudoUpdate, setConteudoUpdate] = useState(resposta.resposta);

  const [isOpen, setIsOpen] = useState(false);

  const { mutate: updateResposta, isPending } = useUpdateResposta();

  const handleUpdate = () => {
    if (!conteudoUpdate.trim()) return;

    updateResposta(
      {
        id_resposta: resposta.id_resposta,
        fkId_pergunta: resposta.fkId_pergunta,
        fkId_usuario: resposta.fkId_usuario,
        resposta: conteudoUpdate,
      },    
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="w-[200px] bg-purple-600 p-3 rounded-lg text-white cursor-pointer hover:-translate-y-1 transition-all duration-300">
          Editar sua resposta
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edite sua resposta</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            label="Edite sua resposta"
            type="text"
            placeholder="Edite sua resposta"
            value={conteudoUpdate}
            onChange={(e) => setConteudoUpdate(e.target.value)}
          />
        </div>

        <DialogFooter>
          <button
            onClick={handleUpdate}
            disabled={isPending}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors"
          >
            {isPending ? "Salvando..." : "Salvar alterações"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
