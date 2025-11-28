"use client";

import {
  User as UserIcon,
  Pencil as PencilIcon,
  AlertTriangle as ExclamationTriangleIcon,
  Star as StarIcon,
  Calendar as CalendarIcon,
  LogOut,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { ShieldCheck, ThumbsUp, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { UpdateUserModal } from "./updateUserModal";
import { UpdateUserFotoModal } from "./fotoPerfilUser/index";
import { useEffect, useState } from "react";
import { deleteToken } from "@/lib/deleteToken";
// replaced GoPencil with lucide-react PencilIcon
import { useGetUser } from "@/hooks/user/useListId";
import {
  BsEmojiExpressionless,
  BsEmojiGrin,
  BsEmojiAngry,
} from "react-icons/bs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pergunta } from "@/types/pergunta";
import { User } from "@/types/user";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Image as ImageIcon } from "lucide-react";
import { ActionButton } from "@/components/ui/actionButton";
import { useDenuncia } from "@/hooks/denuncia/useDenuncia";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { fetchPerguntaById } from "@/services/perguntaService";
import { fetchRespostaById } from "@/services/respostaService";
import { Resposta } from "@/types/resposta";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Conquista } from "@/types/conquista";

function PenalidadeCard({
  penalidade,
  onView,
}: {
  penalidade: any;
  onView: (id_conteudo: string, tipo_conteudo: string) => void;
}) {
  const denunciaId =
    penalidade?.denuncia?.id_denuncia ?? penalidade?.fkId_denuncia;
  const { data: denunciaData } = useDenuncia(denunciaId);

  const tipoConteudo =
    penalidade?.denuncia?.tipo_conteudo ?? denunciaData?.tipo_conteudo;
  const fkConteudo =
    penalidade?.denuncia?.fkId_conteudo_denunciado ??
    denunciaData?.fkId_conteudo_denunciado ??
    null;

  const TipoIcon =
    tipoConteudo === "pergunta"
      ? MessageSquare
      : tipoConteudo === "resposta"
      ? MessageSquare
      : FileText;

  return (
    <div className="flex items-start">
      <div
        className={`w-1 rounded-l-lg ${
          penalidade.ativa ? "bg-red-500" : "bg-zinc-200"
        }`}
      />
      <div className="p-3 rounded-lg border border-zinc-200 bg-white shadow-sm flex-1 flex flex-col gap-2 hover:shadow-md transition relative">
        <div className="absolute top-3 right-3">
          <div
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              penalidade.ativa
                ? "bg-red-100 text-red-700"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {penalidade.ativa ? (
              <>
                <ExclamationTriangleIcon className="w-3 h-3 inline mr-1 text-red-600" />{" "}
                Ativa
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3 inline mr-1 text-emerald-600" />{" "}
                Inativa
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-start gap-3">
          <div className="flex items-center gap-2">
            <TipoIcon className="w-5 h-5 text-zinc-600" />
            <div className="text-sm text-zinc-700 font-medium">
              {tipoConteudo ?? "conteúdo"}
            </div>
          </div>
        </div>

        <div className="text-sm text-zinc-700 truncate">
          <span className="font-medium">Detalhes:</span> {penalidade.descricao}
        </div>

        <div className="text-right text-sm text-zinc-500">
          <div className="text-xs">Pontos perdidos</div>
          <div className="font-bold text-zinc-900 text-lg">
            {penalidade.perder_credibilidade ?? 0}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-zinc-500">
          <div className="flex flex-col">
            <div className="font-medium text-zinc-700">Início</div>
            <div>
              {penalidade.dataInicio_penalidade
                ? new Date(penalidade.dataInicio_penalidade).toLocaleDateString(
                    "pt-BR"
                  )
                : "-"}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="font-medium text-zinc-700">Fim</div>
            <div>
              {penalidade.dataFim_penalidade
                ? new Date(penalidade.dataFim_penalidade).toLocaleDateString(
                    "pt-BR"
                  )
                : "-"}
            </div>
          </div>

          {fkConteudo && tipoConteudo && (
            <button
              onClick={() => onView(fkConteudo, tipoConteudo)}
              className="px-2 py-1 rounded-md bg-white border border-zinc-200 text-xs text-zinc-700 hover:bg-zinc-50"
            >
              Ver conteúdo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UsuarioClientPage({
  usuario: initialUser,
  perguntas,
  conquistas,
}: {
  usuario: User;
  perguntas: Pergunta[];
  conquistas: Conquista[];
}) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState<null | "usuario" | "foto">(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [openPenalidades, setOpenPenalidades] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewTipo, setPreviewTipo] = useState<string | null>(null);
  const [openDenunciaDetail, setOpenDenunciaDetail] = useState(false);
  const [selectedDenunciaId, setSelectedDenunciaId] = useState<string | null>(
    null
  );
  const [selectedPenalidade, setSelectedPenalidade] = useState<any | null>(
    null
  );
  const userId = initialUser?.id_usuario;

  const { data: usuario_data, isError } = useGetUser(userId, initialUser);

  // Preview query to fetch content when preview modal is opened
  const previewQuery = useQuery({
    queryKey: ["preview", previewTipo, previewId],
    queryFn: async () => {
      if (!previewId || !previewTipo) return null;
      if (previewTipo === "pergunta") return fetchPerguntaById(previewId);
      if (previewTipo === "resposta") return fetchRespostaById(previewId);
      return null;
    },
    enabled: Boolean(previewOpen && previewId && previewTipo),
  });

  // Denuncia detail query (fetch denuncia by selected id)
  const denunciaDetailQuery = useDenuncia(selectedDenunciaId ?? undefined);

  // Keep backward-compatible: we'll also have an imperative fetch when the modal opens
  // to mirror the notifications page approach (robust to field name differences).
  const [loadingDenuncia, setLoadingDenuncia] = useState(false);
  const [denunciaLocal, setDenunciaLocal] = useState<any | null>(null);
  const [denunciaError, setDenunciaError] = useState<string | null>(null);
  const [conteudoTexto, setConteudoTexto] = useState<string | null>(null);

  // When modal opens or selectedDenunciaId changes, fetch the denuncia (imperative pattern)
  useEffect(() => {
    let mounted = true;
    async function loadDenuncia() {
      const denunciaId = selectedDenunciaId;
      if (!openDenunciaDetail || !denunciaId) return;
      try {
        setLoadingDenuncia(true);
        setDenunciaError(null);
        setDenunciaLocal(null);
        setConteudoTexto(null);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/denuncia/${denunciaId}`
        );
        if (!mounted) return;
        const d = res.data;
        setDenunciaLocal(d);

        // resolve item denunciado if not present
        if (d.item_denunciado) {
          setConteudoTexto(d.item_denunciado);
        } else {
          const tipo = d.tipo_conteudo;
          const fk = d.fkId_conteudo_denunciado;
          if (fk && tipo === "pergunta") {
            const p = await fetchPerguntaById(String(fk));
            if (!mounted) return;
            setConteudoTexto(p.pergunta ?? null);
          } else if (fk && tipo === "resposta") {
            const r = await fetchRespostaById(String(fk));
            if (!mounted) return;
            setConteudoTexto(r.resposta ?? null);
          }
        }
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
  }, [openDenunciaDetail, selectedDenunciaId]);

  if (!usuario_data) return null;

  const cred = usuario_data.credibilidade_usuario;

  let CredibilidadeEmoji: any;
  let credibilidadeMensagem: string | undefined;

  const credNum = Number(cred ?? 0);
  if (credNum >= 75) {
    CredibilidadeEmoji = ShieldCheck;
    credibilidadeMensagem =
      "Excelente! Sua conduta é um exemplo — continue assim.";
  } else if (credNum >= 50) {
    CredibilidadeEmoji = ThumbsUp;
    credibilidadeMensagem =
      "Muito bom! Você está no caminho certo, mantenha o bom comportamento.";
  } else if (credNum >= 25) {
    CredibilidadeEmoji = ExclamationTriangleIcon;
    credibilidadeMensagem =
      "Atenção: seu comportamento precisa melhorar. Siga as regras da comunidade para evitar penalidades.";
  } else {
    CredibilidadeEmoji = XCircle;
    credibilidadeMensagem =
      "Aviso: seu comportamento está prejudicando a comunidade. Reveja suas ações.";
  }

  let progressGradient = "from-purple-600 to-fuchsia-500";
  let progressTextClass = "text-purple-700";
  if (credNum >= 75) {
    progressGradient = "from-purple-600 to-fuchsia-500";
    progressTextClass = "text-purple-700";
  } else if (credNum >= 50) {
    progressGradient = "from-emerald-500 to-green-500";
    progressTextClass = "text-emerald-600";
  } else if (credNum >= 25) {
    progressGradient = "from-orange-400 to-orange-600";
    progressTextClass = "text-orange-600";
  } else {
    progressGradient = "from-red-600 to-rose-600";
    progressTextClass = "text-red-600";
  }

  const handleVisualizarConteudo = (
    id_conteudo: string,
    tipo_conteudo: string
  ) => {
    // Open preview modal instead of navigating directly
    setPreviewId(id_conteudo);
    setPreviewTipo(tipo_conteudo);
    setPreviewOpen(true);
  };

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div
      className="min-h-screen w-full flex justify-center bg-white px-4 md:px-6"
      style={{ paddingTop: headerHeight ? headerHeight + 2 : undefined }}
    >
      <div className="w-full max-w-3xl flex flex-col justify-start items-stretch py-7 md:py-7 space-y-8 relative">
        {/* FOTO + NOME */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-3"
        >
          <div
            className="relative cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setOpenDialog("foto")}
          >
            {usuario_data.foto_perfil ? (
              <img
                src={usuario_data.foto_perfil}
                alt="Foto do usuário"
                className="h-36 w-36 rounded-full object-cover border border-neutral-300"
              />
            ) : (
              <UserIcon className="h-36 w-36 p-8 bg-neutral-200 rounded-full" />
            )}
            <span className="absolute bottom-0 right-0 p-2 rounded-full text-neutral-700 border border-neutral-300 bg-white shadow-sm cursor-pointer">
              <PencilIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-semibold text-2xl md:text-3xl text-neutral-800">
              {usuario_data.nome_usuario}
            </h2>
            <p className="text-neutral-600 text-md">
              Mais conhecido como:{" "}
              <span className="font-bold">{usuario_data.apelido_usuario}</span>
            </p>
            {/* Botão pill colocado ABAIXO das infos (acima de credibilidade) */}
          </div>
          <button
            onClick={() => setOpenDialog("usuario")}
            className="inline-flex items-center gap-2 rounded-full border border-purple-400/60 text-purple-700 px-6 py-2 bg-white hover:bg-purple-50 shadow-sm transition cursor-pointer"
            title="Editar dados"
            aria-label="Editar dados"
          >
            <PencilIcon className="text-purple-700 w-4 h-4" />
            <span className="text-sm font-medium">Editar dados</span>
          </button>
        </motion.div>

        {/* CREDIBILIDADE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="flex-1 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm flex items-center gap-6">
              <div className="flex-shrink-0">
                <CredibilidadeEmoji
                  className={`w-12 h-12 ${progressTextClass}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-zinc-800">
                    Credibilidade
                  </span>
                  <span
                    className={`text-2xl font-extrabold ${progressTextClass}`}
                  >
                    {cred}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${progressTextClass}`}>
                  {credibilidadeMensagem}
                </p>
                <div className="w-full h-2 rounded-full bg-zinc-100 mt-3">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${progressGradient}`}
                    style={{ width: `${Math.max(0, Math.min(100, credNum))}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex items-center justify-center">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-zinc-500" />
                <div className="text-left">
                  <span className="text-sm text-zinc-600 block">Desde</span>
                  <span className="text-lg font-semibold text-zinc-800 block">
                    {usuario_data.dataCriacao_usuario
                      ? new Date(
                          usuario_data.dataCriacao_usuario
                        ).toLocaleDateString("pt-BR")
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PENALIDADES */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Penalidades (smaller, personal view) */}
          <div className="relative rounded-xl border border-red-100 bg-white p-4 shadow-sm space-y-3 h-full flex flex-col justify-between">
            <span className="absolute -top-3 -right-3 inline-flex items-center justify-center bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 text-sm font-semibold z-10">
              {(usuario_data.penalidades || []).length} Penalidade(s)
            </span>
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-red-700 text-base">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                Suas penalidades
              </h3>
              <p className="text-sm text-neutral-600 mt-2">
                Aqui você encontra suas penalidades registradas. Se houver
                dúvidas, entre em contato com a equipe.
              </p>
            </div>
            <div className="flex justify-end">
              <ActionButton
                textIdle="Ver suas penalidades"
                onClick={() => setOpenPenalidades(true)}
                className="min-w-[140px] bg-gradient-to-r from-red-600 to-rose-600"
              />
            </div>

            {/* Penalidades dialog (personal, red-themed) */}
            <Dialog
              open={openPenalidades}
              onOpenChange={(v: boolean | undefined) =>
                setOpenPenalidades(Boolean(v))
              }
            >
              <DialogContent className="w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[560px] max-w-4xl min-h-[40vh] rounded-2xl p-6 bg-white border border-zinc-100 shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-extrabold bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                    Suas penalidades
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-start gap-4 mt-2">
                  {(usuario_data.penalidades || []).length > 0 ? (
                    (usuario_data.penalidades || []).map((p: any) => (
                      <div
                        key={p.id_penalidade}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          const denunciaId =
                            p.denuncia?.id_denuncia ?? p.fkId_denuncia;
                          setSelectedDenunciaId(denunciaId ?? null);
                          setSelectedPenalidade(p);
                          setOpenDenunciaDetail(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const denunciaId =
                              p.denuncia?.id_denuncia ?? p.fkId_denuncia;
                            setSelectedDenunciaId(denunciaId ?? null);
                            setSelectedPenalidade(p);
                            setOpenDenunciaDetail(true);
                          }
                        }}
                      >
                        <PenalidadeCard
                          penalidade={p}
                          onView={handleVisualizarConteudo}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-500 text-sm italic">
                      Nenhuma penalidade registrada.
                    </p>
                  )}
                </div>
                {/* footer removed: modal closes by clicking outside or pressing Esc */}
              </DialogContent>
            </Dialog>
          </div>

          {/* Conquistas placeholder */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-3 h-full flex flex-col justify-between">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-amber-600 text-base">
                <StarIcon className="w-5 h-5 text-amber-500" />
                Conquistas
              </h3>
              <p className="text-sm text-amber-600 mt-2">
                Espaço reservado para exibir conquistas do usuário.
              </p>
            </div>
            <div className="w-full">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="cursor-pointer hover:text-purple-600 h-10 rounded-full bg-zinc-100 w-fit px-4 flex items-center text-sm font-medium text-zinc-700">
                    {conquistas.length} Conquista(s)
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-3 p-2">
                      {conquistas.map((c, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-zinc-200 p-4 bg-white shadow-sm"
                        >
                          <h3 className="text-base font-semibold text-purple-600">
                            {c.titulo}
                          </h3>
                          <p className="text-sm text-zinc-600">{c.descricao}</p>
                          <div className="mt-2 h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600"
                              style={{
                                width: `${
                                  (c.progressoAtual! / c.progressoMax) * 10
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </motion.div>

        {/* BOTÃO SAIR */}
        <div className="pt-4 border-t border-zinc-200 w-full">
          <button
            onClick={() => setLogoutOpen(true)}
            className="w-full inline-flex items-center cursor-pointer justify-center gap-2 py-2 rounded-md border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400 transition"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>

      {/* MODAIS */}
      <UpdateUserModal
        openDialog={openDialog === "usuario" ? "usuario" : null}
        setOpenDialog={setOpenDialog}
        user={usuario_data}
      />
      <UpdateUserFotoModal
        openDialog={openDialog === "foto" ? "foto" : null}
        setOpenDialog={setOpenDialog}
        user={usuario_data}
      />

      {/* Content Preview Modal */}
      <Dialog
        open={previewOpen}
        onOpenChange={(v: boolean | undefined) => {
          setPreviewOpen(Boolean(v));
          if (!v) {
            setPreviewId(null);
            setPreviewTipo(null);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100vw-2rem)] sm:w-auto max-w-lg sm:min-w-[260px] min-w-[220px] min-h-[320px] rounded-2xl p-5 bg-white border border-zinc-100 shadow-xl"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Preview do conteúdo denunciado
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            {/* Render preview from `previewQuery` */}
            {!previewId || !previewTipo ? (
              <div className="text-sm text-zinc-500">
                Nenhum conteúdo selecionado.
              </div>
            ) : previewQuery.isLoading ? (
              <div className="text-sm text-zinc-500">Carregando...</div>
            ) : previewQuery.isError ? (
              <div className="text-sm text-red-600">
                Erro ao carregar conteúdo.
              </div>
            ) : previewTipo === "pergunta" && previewQuery.data ? (
              (() => {
                const p = previewQuery.data as Pergunta;
                return (
                  <div>
                    <h3 className="font-semibold text-zinc-800">Pergunta</h3>
                    <p className="mt-2 text-zinc-700">{p.pergunta}</p>
                    <div className="mt-3 text-xs text-zinc-500">
                      Por: {p.usuario?.nome_usuario ?? "-"}
                    </div>
                  </div>
                );
              })()
            ) : previewTipo === "resposta" && previewQuery.data ? (
              (() => {
                const r = previewQuery.data as Resposta;
                return (
                  <div>
                    <h3 className="font-semibold text-zinc-800">Resposta</h3>
                    <p className="mt-2 text-zinc-700">{r.resposta}</p>
                    <div className="mt-3 text-xs text-zinc-500">
                      Por: {r.usuario?.nome_usuario ?? "-"}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-sm text-zinc-500">
                Conteúdo não disponível para visualização.
              </div>
            )}
          </div>
          {/* footer removed: modal closes by clicking outside or pressing Esc */}
        </DialogContent>
      </Dialog>

      {/* Denúncia detail modal (opened when clicking a penalidade card) */}
      <Dialog
        open={openDenunciaDetail}
        onOpenChange={(v: boolean | undefined) => {
          setOpenDenunciaDetail(Boolean(v));
          if (!v) {
            setSelectedDenunciaId(null);
            setSelectedPenalidade(null);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100vw-2rem)] sm:w-auto max-w-lg mx-4 bg-white rounded-2xl border border-zinc-100 shadow-xl p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-rose-600">
              Denúncia
            </DialogTitle>
            <div className="text-sm text-zinc-500 mt-1">
              {selectedPenalidade?.dataInicio_penalidade
                ? `Data de início da penalidade: ${new Date(
                    selectedPenalidade.dataInicio_penalidade
                  ).toLocaleString("pt-BR")}`
                : ""}
            </div>
          </DialogHeader>

          <div className="mt-4 grid grid-cols-1 gap-3">
            {loadingDenuncia || denunciaDetailQuery.isLoading ? (
              <div className="p-3 bg-yellow-50 border border-yellow-100 rounded text-yellow-800 text-sm">
                Carregando denúncia...
              </div>
            ) : denunciaError || denunciaDetailQuery.isError ? (
              <div className="p-3 bg-red-50 border border-red-100 rounded text-red-700 text-sm">
                {denunciaError}
              </div>
            ) : !(denunciaLocal ?? denunciaDetailQuery.data) ? (
              <div className="p-3 text-sm text-zinc-500">
                Nenhuma denúncia selecionada.
              </div>
            ) : (
              (() => {
                const d = denunciaLocal ?? denunciaDetailQuery.data!;
                const motivo = d.tipo_denuncia ?? d.tipo_conteudo ?? "—";
                const revisado = d.revisadoTipo ?? d.tipo_conteudo ?? "—";
                const item = loadingDenuncia
                  ? "Carregando item..."
                  : denunciaError
                  ? "Erro ao carregar item denunciado."
                  : conteudoTexto
                  ? conteudoTexto
                  : d.item_denunciado
                  ? d.item_denunciado
                  : "Conteúdo não disponível.";

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-zinc-100 bg-gray-50 p-3">
                        <div className="text-xs text-zinc-500 uppercase tracking-wide">
                          Motivo
                        </div>
                        <div className="text-sm font-semibold mt-1">
                          {String(motivo).toUpperCase()}
                        </div>
                      </div>

                      <div className="rounded-lg border border-zinc-100 bg-white p-3">
                        <div className="text-xs text-zinc-500 uppercase tracking-wide">
                          Pontos de credibilidade perdidos
                        </div>
                        <div className="text-sm font-semibold mt-1">
                          {selectedPenalidade?.perder_credibilidade ?? 0}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-zinc-100 bg-gray-50 p-3">
                      <div className="text-xs text-zinc-500 uppercase tracking-wide">
                        O que foi revisado
                      </div>
                      <div className="text-sm font-semibold mt-1">
                        {revisado}
                      </div>
                    </div>

                    <div className="rounded-lg border border-zinc-100 bg-white p-3">
                      <div className="text-xs text-zinc-500 uppercase tracking-wide">
                        Item analisado
                      </div>
                      <div className="mt-2 p-3 bg-white rounded border text-sm max-w-prose mx-auto">
                        {item}
                      </div>
                    </div>

                    <div className="rounded-lg border border-zinc-100 bg-gray-50 p-3">
                      <div className="text-xs text-zinc-500 uppercase tracking-wide">
                        Descrição da penalidade (observação do moderador)
                      </div>
                      <div className="text-sm mt-1 break-words">
                        {selectedPenalidade?.descricao ?? "-"}
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          {/* footer removed: modal closes by clicking outside or pressing Esc */}
        </DialogContent>
      </Dialog>

      {/* CONFIRM SAIR */}
      <Dialog
        open={logoutOpen}
        onOpenChange={(v: boolean | undefined) => {
          setLogoutOpen(Boolean(v));
          if (!v) setLeaving(false);
        }}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-zinc-900">Sair da conta</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-zinc-600">
            Tem certeza que deseja sair da sua conta?
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-md border cursor-pointer border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              onClick={() => setLogoutOpen(false)}
              type="button"
            >
              Cancelar
            </button>
            <ActionButton
              type="button"
              textIdle="Sair"
              isLoading={leaving}
              onClick={() => {
                if (leaving) return;
                setLeaving(true);
                setTimeout(() => {
                  deleteToken("token");
                  router.push("/Auth/Login");
                }, 450);
              }}
              className="bg-red-600 cursor-pointer hover:bg-red-700"
              enableRipplePulse
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
