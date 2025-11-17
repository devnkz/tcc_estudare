"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../../../../components/layout/footer";
import {
  ExclamationCircleIcon,
  InformationCircleIcon,
  EyeIcon,
  TrashIcon,
  BellIcon,
} from "@heroicons/react/24/solid";
import {
  Dialog as ConfirmDialog,
  DialogContent as ConfirmContent,
  DialogHeader as ConfirmHeader,
  DialogTitle as ConfirmTitle,
  DialogFooter as ConfirmFooter,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { ActionButton } from "@/components/ui/actionButton";

// using heroicons BellIcon (imported above)

function NotificationItem({
  n,
  onOpen,
  onRemove,
}: {
  n: any;
  onOpen: (n: any) => void;
  onRemove: (id: string) => void;
}) {
  async function deleteNotification() {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notificacao/${n.id_notificacao}`,
      {
        method: "DELETE",
      }
    );
    onRemove?.(n.id_notificacao);
  }

  const [confirmLoading, setConfirmLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  async function markAsRead() {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/notificacao/${n.id_notificacao}`,
        { lida: true }
      );
      // remove from UI list (clear for this user)
      onRemove?.(n.id_notificacao);
    } catch (e) {
      console.error("Falha ao marcar como lida", e);
    }
  }

  // mark as read on the server but do not remove from the UI immediately
  async function markAsReadOnly() {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/notificacao/${n.id_notificacao}`,
        { lida: true }
      );
    } catch (e) {
      console.error("Falha ao marcar como lida (sem remover)", e);
    }
  }

  const tipo = (n.tipo || "").toLowerCase();

  const tipoColor =
    tipo === "denuncia"
      ? "bg-rose-50 text-rose-600"
      : tipo === "info"
      ? "bg-sky-50 text-sky-600"
      : "bg-zinc-50 text-zinc-700";

  return (
    <div
      className={`w-full rounded-xl p-4 flex flex-col md:flex-row items-start gap-4 shadow-sm transition-shadow duration-200 border hover:shadow-md min-h-[180px] relative ${
        n.lida
          ? "bg-[var(--card)] border-[var(--border)]"
          : "bg-white border-blue-50"
      }`}
    >
      <div className="flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${tipoColor}`}
          aria-hidden
        >
          {tipo === "denuncia" ? (
            <ExclamationCircleIcon className="w-6 h-6 text-rose-600" />
          ) : (
            <InformationCircleIcon className="w-6 h-6 text-sky-600" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--foreground)] truncate">
                {tipo === "denuncia" ? "Atualização da Denúncia" : n.titulo}
              </h3>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${tipoColor} ml-2`}
              >
                {tipo === "denuncia"
                  ? "Denúncia"
                  : tipo === "info"
                  ? "Informação"
                  : "Geral"}
              </span>
            </div>

            <p className="mt-1 text-sm text-[var(--muted-foreground)] line-clamp-2">
              {tipo === "denuncia" ? "Sua denúncia foi analisada." : n.mensagem}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-sm text-[var(--muted-foreground)]">
              {new Date(n.dataCriacao_notificacao).toLocaleDateString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* spacer to keep card content spacing; actions are absolute positioned */}
        <div className="mt-3" />

        <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <ConfirmContent className="w-[calc(100vw-2rem)] sm:w-auto max-w-sm rounded-2xl p-6 bg-white border border-red-200 shadow-xl z-[9999]">
            <ConfirmHeader>
              <ConfirmTitle className="text-xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                Confirmar ação
              </ConfirmTitle>
            </ConfirmHeader>

            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg border border-red-100 bg-red-50/70 px-3 py-2 text-[var(--foreground)] flex gap-2 items-start"
            >
              <Info className="w-4 h-4 mt-0.5 text-red-600" />
              <p className="text-xs sm:text-sm">
                Tem certeza que deseja excluir esta notificação? Esta
                notificação pode ser importante caso você queira recorrer.
              </p>
            </motion.div>

            <ConfirmFooter>
              <div className="flex items-center justify-between w-full gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="text-sm cursor-pointer text-zinc-600 hover:text-zinc-800 transition"
                >
                  Cancelar
                </button>
                <ActionButton
                  type="button"
                  textIdle="Confirmar exclusão"
                  isLoading={confirmLoading}
                  enableRipplePulse
                  className="min-w-[180px] cursor-pointer bg-gradient-to-r from-red-600 to-rose-600"
                  onClick={async () => {
                    try {
                      setConfirmLoading(true);
                      await deleteNotification();
                      setConfirmOpen(false);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setConfirmLoading(false);
                    }
                  }}
                />
              </div>
            </ConfirmFooter>
          </ConfirmContent>
        </ConfirmDialog>

        {/* absolute positioned delete button in bottom-left */}
        <div className="absolute left-4 bottom-4">
          <button
            onClick={() => setConfirmOpen(true)}
            aria-label="Excluir notificação"
            className="px-2 py-2 rounded-md bg-transparent text-red-600 hover:bg-red-50 transition flex items-center cursor-pointer"
          >
            <TrashIcon className="w-5 h-5" />
            <span className="ml-2 text-sm">Excluir</span>
          </button>
        </div>

        {/* absolute positioned action button in bottom-right */}
        <div className="absolute right-4 bottom-4">
          <button
            onClick={() => {
              onOpen?.(n);
              // mark as read on server, but keep the item visible until user closes modal
              markAsReadOnly();
            }}
            className="px-3 py-1 rounded-md bg-violet-600 text-white text-sm cursor-pointer hover:bg-violet-700 transition flex items-center gap-2"
          >
            <EyeIcon className="w-4 h-4 text-white" />
            <span>Ver notificação</span>
          </button>
        </div>
      </div>

      {/* modal is rendered at page level */}
    </div>
  );
}

function NotificationModal({
  open,
  onClose,
  n,
}: {
  open: boolean;
  onClose: () => void;
  n: any;
}) {
  if (!open) return null;

  const [loadingDenuncia, setLoadingDenuncia] = useState(false);
  const [denuncia, setDenuncia] = useState<any | null>(null);
  const [denunciaError, setDenunciaError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDenuncia() {
      const denunciaId =
        n?.fkId_denuncia || n?.fkIdDenuncia || n?.fk_id_denuncia;
      if (!denunciaId) return;

      try {
        setLoadingDenuncia(true);
        setDenunciaError(null);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/denuncia/${denunciaId}`
        );
        if (!mounted) return;
        setDenuncia(res.data);
      } catch (err: any) {
        if (!mounted) return;
        setDenunciaError(
          err?.response?.data?.message || "Falha ao carregar denúncia."
        );
      } finally {
        if (mounted) setLoadingDenuncia(false);
      }
    }

    loadDenuncia();

    return () => {
      mounted = false;
    };
  }, [n]);

  const tipo = (n.tipo || "").toLowerCase();

  const defaultRevisao =
    n.revisao ||
    n.mensagem_revisao ||
    "Após análise da Equipe Estudare, foi concluído que sua denúncia falta com argumentos para realização de uma intervenção maior.";
  const reporterName =
    denuncia?.usuario?.apelido_usuario ||
    denuncia?.usuario?.nome_usuario ||
    denuncia?.usuarios?.apelido_usuario ||
    denuncia?.usuarios?.nome_usuario ||
    n.quem_denunciou ||
    n.reporterName ||
    n.denuncianteNome ||
    n.autorNome ||
    n.nome_denunciante ||
    "Você";
  const denunciadoName =
    denuncia?.denunciadoNome ||
    denuncia?.denunciadoUsuario?.apelido_usuario ||
    denuncia?.denunciadoUsuario?.nome_usuario ||
    denuncia?.fkId_usuario_conteudo ||
    n.denunciadoNome ||
    n.denunciado ||
    n.item_denunciado ||
    n.alvoNome ||
    n.targetName ||
    "—";

  const tipoDenuncia =
    denuncia?.tipo_denuncia ||
    denuncia?.tipo_conteudo ||
    n.tipo_denuncia ||
    n.tipo ||
    "—";

  const nivel = denuncia?.nivel_denuncia ?? n.nivel_denuncia ?? n.nivel ?? "—";

  const conteudoId =
    denuncia?.fkId_conteudo_denunciado ||
    n.fkId_conteudo_denunciado ||
    n.conteudoId ||
    n.itemId;

  const notaDenuncia =
    denuncia?.descricao || n.mensagem || n.nota || "(sem nota)";

  const dataRevisao =
    n.dataRevisao ||
    n.data_revisao ||
    n.dataAtualizacao ||
    n.dataCriacao_notificacao ||
    denuncia?.dataCriacao_denuncia;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="relative w-full max-w-lg mx-4 bg-white rounded-2xl border border-zinc-100 shadow-xl p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-rose-600">
              {tipo === "Denúncia" ? "Atualização Denúncia" : n.titulo}
            </h2>
            <div className="text-sm text-zinc-500 mt-1">
              {dataRevisao
                ? `Data da atualização: ${new Date(dataRevisao).toLocaleString(
                    "pt-BR"
                  )}`
                : ""}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-sm text-zinc-600 cursor-pointer"
          >
            Fechar
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {loadingDenuncia && (
            <div className="col-span-2 p-3 bg-yellow-50 border border-yellow-100 rounded text-yellow-800 text-sm">
              Carregando dados da denúncia...
            </div>
          )}

          {denunciaError && (
            <div className="col-span-2 p-3 bg-red-50 border border-red-100 rounded text-red-700 text-sm">
              {denunciaError}
            </div>
          )}
          <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3 flex flex-col gap-1">
            <div className="text-xs text-blue-700 font-semibold">
              Quem denunciou
            </div>
            <div className="text-sm text-blue-800 mt-1">{reporterName}</div>
          </div>

          <div className="rounded-lg border border-red-100 bg-red-50/60 p-3 flex flex-col gap-1">
            <div className="text-xs text-rose-700 font-semibold">
              Denunciado
            </div>
            <div className="text-sm text-rose-700 mt-1">{denunciadoName}</div>
          </div>
        </div>

        <div className="mt-3 text-sm text-zinc-600">
          Denúncia realizada por{" "}
          <span className="text-blue-600 font-semibold">{reporterName}</span>{" "}
          contra{" "}
          <span className="text-rose-600 font-semibold">{denunciadoName}</span>.
        </div>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-zinc-100 bg-gray-50 p-3">
            <div className="flex items-start justify-between">
              <div className="text-xs text-zinc-500 uppercase tracking-wide">
                Motivo
              </div>
              {(() => {
                const levelNum = Number(nivel ?? 0);
                const badgeClass =
                  levelNum <= 1
                    ? "bg-blue-100 text-blue-700"
                    : levelNum <= 2
                    ? "bg-orange-100 text-orange-700"
                    : "bg-red-100 text-red-700";
                return (
                  <div
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeClass}`}
                  >
                    Nível {levelNum || "—"}
                  </div>
                );
              })()}
            </div>
            <div className="text-sm font-semibold mt-3">
              {String(tipoDenuncia).toUpperCase()}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-gray-50 p-3">
            <div className="text-xs text-zinc-500 uppercase tracking-wide">
              Observação do denunciante
            </div>
            <div className="text-sm mt-1 break-words">{notaDenuncia}</div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-gray-50 p-3">
            <div className="text-xs text-zinc-500 uppercase tracking-wide">
              O que foi revisado
            </div>
            <div className="text-sm font-semibold mt-1">
              {denuncia?.revisadoTipo ||
                n.revisadoTipo ||
                n.tipo_conteudo ||
                "—"}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-white p-3">
            <div className="text-xs text-zinc-500 uppercase tracking-wide">
              Item denunciado
            </div>
            <div className="mt-2 p-3 bg-white rounded border text-sm max-w-prose mx-auto">
              {denuncia?.item_denunciado ||
                n.item_denunciado ||
                "(Conteúdo não disponível)"}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-100 bg-gray-50 p-3">
            <div className="text-xs text-zinc-500 uppercase tracking-wide">
              Resultado / Observação do Moderador
            </div>
            <div className="text-sm mt-1 break-words">
              {denuncia?.resultado ||
                n.resultado ||
                n.revisao ||
                defaultRevisao}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function NotificacaoPageClient({ data }: { data: any }) {
  const list = Array.isArray(data)
    ? data
    : data?.data && Array.isArray(data.data)
    ? data.data
    : data
    ? [data]
    : [];

  const [notifications, setNotifications] = useState<any[]>(list);
  const [selectedNotif, setSelectedNotif] = useState<any | null>(null);

  function handleRemoveNotification(id: string) {
    setNotifications((prev) => prev.filter((it) => it.id_notificacao !== id));
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-between items-center bg-[var(--background)]">
      <main className="w-full max-w-[1200px] px-4 md:px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="rounded-md p-2 bg-[var(--primary)] text-[var(--primary-foreground)]">
              <BellIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
                Notificações
              </h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Aqui estão as suas últimas notificações
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3 py-2 rounded-md bg-[var(--secondary)] text-[var(--secondary-foreground)] text-sm">
              Limpar
            </button>
            <button className="px-3 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm">
              Marcar todas
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notifications.length === 0 ? (
            <div className="col-span-1 md:col-span-2 py-8">
              <div className="text-center mx-auto max-w-2xl">
                <div className="flex items-center justify-center mb-3">
                  <div className="relative">
                    <div className="rounded-full p-3 bg-gradient-to-tr from-purple-600 to-purple-400">
                      <BellIcon className="w-10 h-10 text-white" />
                    </div>
                    <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-purple-500 ring-2 ring-white animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)]">
                  Tudo calmo por aqui
                </h3>
                <p className="mt-3 text-base md:text-lg text-[var(--muted-foreground)]">
                  Você não possui notificações no momento — quando houver
                  atualizações sobre denúncias, revisões ou comunicados
                  importantes, elas aparecerão aqui. Aproveite o momento para
                  revisar sua página ou retornar mais tarde.
                </p>
              </div>
            </div>
          ) : (
            notifications.map((n: any) => (
              <NotificationItem
                key={n.id_notificacao}
                n={n}
                onOpen={(x) => setSelectedNotif(x)}
                onRemove={handleRemoveNotification}
              />
            ))
          )}
        </section>
        {/* single modal instance: only render when we have a notification selected */}
        <AnimatePresence>
          {selectedNotif && (
            <NotificationModal
              open={true}
              onClose={() => setSelectedNotif(null)}
              n={selectedNotif}
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
