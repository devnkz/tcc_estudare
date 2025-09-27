"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { MultiSelectCombobox } from "@/components/ui/comboxFilter";
import { Input } from "@/components/ui/input";
import { Componente } from "@/types/componente";
import { Pergunta } from "@/types/pergunta";
import { useUpdatePergunta } from "@/hooks/pergunta/useUpdate";
import { useState } from "react";

interface ModalUpdateQuestionProps {
  componentes: Componente[];
  pergunta: Pergunta;
}

export default function ModalUpdateQuestion({
  componentes,
  pergunta,
}: ModalUpdateQuestionProps) {
  const [conteudoUpdate, setConteudoUpdate] = useState(pergunta.pergunta);
  const [selectedComponentId, setSelectedComponentId] = useState<string>(
    pergunta.fkIdComponente || ""
  );

  const [isOpen, setIsOpen] = useState(false);

  const { mutate: updatePergunta, isPending } = useUpdatePergunta();

  const handleUpdate = () => {
    if (!conteudoUpdate.trim()) return;

    updatePergunta(
      {
        id: pergunta.id,
        conteudo: conteudoUpdate,
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
          Editar sua pergunta
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

          <MultiSelectCombobox
            items={componentes || []}
            selectedIds={selectedComponentId ? [selectedComponentId] : []}
            setSelectedIds={(ids) => setSelectedComponentId(ids[0] || "")}
            placeholder="Altere o componente caso queira"
            getLabel={(c) => c.nome}
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
