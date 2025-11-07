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
import { Componente } from "@/types/componente";
import { Pergunta } from "@/types/pergunta";
import { useUpdatePergunta } from "@/hooks/pergunta/useUpdate";
import { useState } from "react";

interface ModalUpdateQuestionProps {
  componentes?: Componente[];
  pergunta: Pergunta;
  triggerId?: string;
}

export default function ModalUpdateQuestion({
  pergunta,
  triggerId,
}: ModalUpdateQuestionProps) {
  const [conteudoUpdate, setConteudoUpdate] = useState(pergunta.pergunta);

  const [isOpen, setIsOpen] = useState(false);

  const { mutate: updatePergunta, isPending } = useUpdatePergunta();

  const handleUpdate = () => {
    if (!conteudoUpdate.trim()) return;

    updatePergunta(
      {
        id_pergunta: pergunta.id_pergunta,
        pergunta: conteudoUpdate,
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
        <button
          id={triggerId}
          className="px-4 py-2 bg-purple-600 rounded-md text-white cursor-pointer hover:bg-purple-700 transition-transform duration-200"
        >
          Editar
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edite sua pergunta</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            label="Edite sua pergunta"
            type="text"
            placeholder="Edite sua pergunta"
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
