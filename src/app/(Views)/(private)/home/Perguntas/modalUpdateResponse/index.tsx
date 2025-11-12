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
  triggerId?: string;
  triggerClassName?: string;
  onSuccess?: (msg?: string) => void;
}

export default function ModalUpdateResponse({
  resposta,
  triggerId,
  triggerClassName,
  onSuccess,
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
          onSuccess?.("Resposta atualizada");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          id={triggerId}
          className={
            triggerClassName ??
            "px-4 py-2 bg-purple-600 rounded-md text-white cursor-pointer hover:bg-purple-700 transition-transform duration-200"
          }
        >
          Editar
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
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            {isPending ? "Salvando..." : "Salvar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
