import { useState } from "react";
import { useUpdateUserFoto } from "@/hooks/user/useCreateFotoPerfil";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BotoesFormulario } from "@/components/ui/button";

export function UpdateUserFotoModal({
  openDialog,
  setOpenDialog,
  user,
}: {
  openDialog: null | "foto";
  setOpenDialog: (value: null | "foto") => void;
  user: any;
}) {
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useUpdateUserFoto();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("foto", file);

    mutate(
      { id: user.id_usuario, data: formData },
      {
        onSuccess: () => {
          setOpenDialog(null);
        },
      }
    );
  };

  return (
    <Dialog
      open={openDialog === "foto"}
      onOpenChange={() => setOpenDialog(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar foto de perfil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
            className="border p-2 rounded w-full"
          />
          <BotoesFormulario
            textButton={isPending ? "Enviando..." : "Alterar foto"}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
