import { useEffect, useState } from "react";
import { useUpdateUserFoto } from "@/hooks/user/useCreateFotoPerfil";
import { useRemoveUserFoto } from "@/hooks/user/useRemoveFotoPerfil";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { BotoesFormulario } from "@/components/ui/button"; // substituído por botão customizado
import { User } from "@/types/user";
import { motion } from "framer-motion";
import { CheckCircle, Info, AlertCircle, Trash } from "lucide-react";
import { ActionButton } from "@/components/ui/actionButton";

export function UpdateUserFotoModal({
  openDialog,
  setOpenDialog,
  user,
}: {
  openDialog: null | "foto";
  setOpenDialog: (value: null | "foto") => void;
  user: User;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const { mutate, isPending } = useUpdateUserFoto();
  const removeFoto = useRemoveUserFoto();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFileError("Selecione um arquivo para continuar.");
      return;
    }

    const formData = new FormData();
    formData.append("foto", file);

    mutate(
      { id: user.id_usuario, data: formData },
      {
        onSuccess: () => {
          setSuccess(true);
          // aguarda alguns segundos para o usuário ver a confirmação e a UI propagar a nova imagem
          setTimeout(() => {
            setSuccess(false);
            setOpenDialog(null);
            setFile(null);
          }, 2500);
        },
      }
    );
  };

  // cleanup preview URL
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <Dialog
      open={openDialog === "foto"}
      onOpenChange={() => setOpenDialog(null)}
    >
      <DialogContent className="w-[calc(100vw-2rem)] sm:w-auto max-w-sm sm:max-w-md md:max-w-lg rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            Atualizar foto de perfil
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Aviso estático: formatos e atualização */}
          <div className="rounded-lg border border-purple-100 bg-purple-50/60 px-3 py-2 flex gap-2 items-start">
            <Info className="w-4 h-4 mt-0.5 text-purple-600" />
            <p className="text-xs sm:text-sm text-[var(--foreground)]">
              Você pode enviar imagens JPG, PNG, WEBP e também GIF animado. Após
              o envio, a foto pode levar alguns segundos para atualizar na
              interface.
            </p>
          </div>

          {/* Confirmação de sucesso */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-lg border border-purple-200 bg-purple-100/60 px-3 py-2 flex gap-2 items-start"
            >
              <CheckCircle className="w-4 h-4 mt-0.5 text-purple-700" />
              <p className="text-xs sm:text-sm text-[var(--foreground)]">
                Imagem enviada! Vamos atualizar sua foto em alguns segundos.
              </p>
            </motion.div>
          )}
          {/* Preview responsivo com animação */}
          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="w-full flex items-center justify-center"
            >
              <img
                src={previewUrl}
                alt="Pré-visualização da foto"
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover ring-4 ring-purple-100 shadow-md"
              />
            </motion.div>
          )}

          {/* Input de arquivo estilizado e responsivo */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Escolher imagem
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && f.type.startsWith("image/")) {
                  setFile(f);
                  setFileError(null);
                } else {
                  setFile(null);
                }
              }}
              aria-invalid={!!fileError}
              className={`block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-white file:cursor-pointer hover:file:bg-purple-700 transition-colors border rounded-md px-3 py-2 ${
                fileError
                  ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                  : "border-zinc-300"
              }`}
            />
            {fileError && (
              <div className="flex items-start gap-2 mt-1 text-red-600 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <p>{fileError}</p>
              </div>
            )}
            <p className="text-xs text-[var(--muted-foreground)]">
              Formatos suportados: JPG, PNG, WEBP e GIF. Tamanho recomendado:
              512x512.
            </p>
          </div>

          {/* Ações: remover / confirmar remoção / salvar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 pt-2">
            {/* Remover foto: desaparece ao confirmar e é substituído pelo botão de confirmação */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {!confirmRemove ? (
                <button
                  type="button"
                  onClick={() => setConfirmRemove(true)}
                  className="inline-flex items-center cursor-pointer gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={removeFoto.isPending}
                >
                  <Trash className="w-4 h-4" />
                  Remover foto
                </button>
              ) : (
                <div className="w-full sm:w-auto cursor-pointer flex flex-col items-center sm:items-start gap-1">
                  <button
                    type="button"
                    disabled={removeFoto.isPending}
                    onClick={() => {
                      if (removeFoto.isPending) return;
                      removeFoto.mutate(user.id_usuario, {
                        onSuccess: () => {
                          setFile(null);
                          setPreviewUrl(null);
                          setConfirmRemove(false);
                        },
                        onSettled: () => {
                          setConfirmRemove(false);
                        },
                      });
                    }}
                    className="w-full sm:w-auto rounded-md cursor-pointer px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {removeFoto.isPending ? "Removendo..." : "Confirme remover"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmRemove(false)}
                    className="text-xs cursor-pointer text-zinc-600 hover:text-zinc-800 transition self-center sm:self-auto"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Botão Salvar (direita no desktop) */}
            <div className="flex justify-end sm:ml-auto w-full sm:w-auto">
              <ActionButton
                type="submit"
                textIdle="Salvar"
                isLoading={isPending}
                isSuccess={success}
                className="w-full sm:w-auto"
                enableRipplePulse
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
