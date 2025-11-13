"use client";

import Footer from "@/components/layout/footer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatePerguntaData } from "@/types/pergunta";
import { Componente } from "@/types/componente";
import { useCreatePergunta } from "@/hooks/pergunta/useCreate";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Curso } from "@/types/curso";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import badWordsJSON from "@/utils/badWordsPT.json";
import { ActionButton } from "@/components/ui/actionButton";

export default function AskQuestionPage({
  componentes,
  cursos,
  id_usuario,
}: {
  componentes: Componente[];
  cursos: Curso[];
  id_usuario: string;
}) {
  const TipsForAsking = [
    { text: "Seja específico e forneça contexto sobre sua dúvida." },
    { text: "Verifique se sua pergunta está clara e objetiva." },
    { text: "Informe o que você já tentou fazer para resolver." },
    { text: "Use linguagem respeitosa e cordial." },
    { text: "Evite abreviações e gírias que possam confundir." },
    { text: "Releia antes de enviar para corrigir erros." },
    {
      text: "Adicione detalhes relevantes que ajudem a entender a sua problemática.",
    },
  ];

  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
  } = useForm<CreatePerguntaData>();

  // local state for textarea, bad-words filter and char counter
  const [perguntaText, setPerguntaText] = useState("");
  const [filteredText, setFilteredText] = useState("");
  const [hasBadWords, setHasBadWords] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const maxChars = 191;

  // Animated text for componentes
  const [componenteIndex, setComponenteIndex] = useState(0);
  const componenteNames = useMemo(
    () => componentes.map((c) => c.nome_componente),
    [componentes]
  );

  useEffect(() => {
    if (componenteNames.length === 0) return;
    const timeoutId = setTimeout(() => {
      setComponenteIndex((prev) =>
        prev === componenteNames.length - 1 ? 0 : prev + 1
      );
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [componenteIndex, componenteNames]);

  // use the full bad-words list from the utils JSON
  // note: the file is a local copy of the backend list for client-side UX checks
  // we still recommend server-side validation for security
  // import via require/import at top

  function normalize(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[@4]/g, "a")
      .replace(/3/g, "e")
      .replace(/[1!]/g, "i")
      .replace(/0/g, "o")
      .replace(/\$/g, "s")
      .replace(/(\w)\1{2,}/g, "$1");
  }

  // build a normalized set from the JSON list for fast client-side checks
  const normalizedBadWords = useMemo(() => {
    try {
      const list = (badWordsJSON && (badWordsJSON as any).words) || [];
      return new Set(list.map((w: string) => normalize(String(w))));
    } catch (e) {
      return new Set<string>();
    }
  }, [badWordsJSON]);

  function escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function filtrarTextoLocal(text: string) {
    const normalized = normalize(text);
    // remove punctuation to tokenize
    const normalizedClean = normalized.replace(/[^a-z0-9\s]/g, " ").trim();
    const tokens = normalizedClean.split(/\s+/).filter(Boolean);

    const offendingTokens = Array.from(
      new Set(tokens.filter((t) => normalizedBadWords.has(t)))
    );
    const contem = offendingTokens.length > 0;

    let textoFiltrado = text;
    if (contem && offendingTokens.length) {
      // build a single regex for the detected offending tokens and mask them in the original text
      const pattern = offendingTokens.map((w) => escapeRegex(w)).join("|");
      const re = new RegExp("\\b(?:" + pattern + ")\\b", "ig");
      textoFiltrado = textoFiltrado.replace(re, (m) => "*****");
    }

    return {
      textoOriginal: text,
      textoFiltrado,
      contemPalavraOfensiva: contem,
    };
  }

  const { mutate, isPending } = useCreatePergunta();

  const onSubmit = (data: CreatePerguntaData) => {
    // run local filter and block submission if offensive words are present
    const filtro = filtrarTextoLocal(perguntaText || data.pergunta || "");
    setFilteredText(filtro.textoFiltrado);
    setHasBadWords(filtro.contemPalavraOfensiva);

    if (filtro.contemPalavraOfensiva) {
      // set a form error so the user sees why submission is blocked
      setError("pergunta" as any, {
        type: "manual",
        message:
          "Sua pergunta contém palavras impróprias — remova-as antes de enviar.",
      });
      return;
    }

    const payload = {
      ...data,
      pergunta: filtro.textoFiltrado,
      fkId_usuario: id_usuario || "",
    };

    mutate(payload, {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/home");
        }, 1500);
      },
    });
  };

  // keep react-hook-form in sync when textarea changes
  const handlePerguntaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value.slice(0, maxChars);
    setPerguntaText(v);
    setValue("pergunta" as any, v);
    const r = filtrarTextoLocal(v);
    setHasBadWords(r.contemPalavraOfensiva);
    setFilteredText(r.textoFiltrado);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-purple-50/30 via-white to-purple-50/20 pt-20 lg:pt-24">
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-8 lg:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-1">
              <span className="text-gray-900">Pergunte sobre</span>
            </h1>

            {/* Animated subtitle */}
            <div className="relative min-h-[4rem] sm:min-h-[3rem] md:min-h-[3.5rem] lg:min-h-[4rem] flex items-center justify-center overflow-visible mb-4 px-2 w-full max-w-full">
              {componenteNames.map((nome, index) => (
                <motion.span
                  key={index}
                  className="absolute text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-700 text-center px-4 max-w-[90vw] break-words leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  animate={
                    componenteIndex === index
                      ? { y: 0, opacity: 1 }
                      : {
                          y: componenteIndex > index ? -20 : 20,
                          opacity: 0,
                        }
                  }
                >
                  {nome}
                </motion.span>
              ))}
            </div>

            <p className="text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto">
              Tire suas dúvidas com a comunidade Estudare
            </p>
          </motion.div>

          {/* GRID LAYOUT */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start max-w-6xl mx-auto">
            {/* FORMULÁRIO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.1,
              }}
              className="bg-white rounded-2xl shadow-lg border border-zinc-200/60 p-6 sm:p-8"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                {/* SELECT CURSO */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="w-1 h-4 bg-purple-600 rounded-full"></span>
                    Curso
                  </label>
                  <Controller
                    control={control}
                    name="fkId_curso"
                    rules={{ required: "Selecione um curso" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full h-11 text-base cursor-pointer bg-white border-2 border-zinc-200 rounded-xl hover:border-purple-400 hover:shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300">
                          <SelectValue placeholder="Selecione o curso" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Cursos</SelectLabel>
                            {cursos.map((curso: Curso) => (
                              <SelectItem
                                key={curso.id_curso}
                                value={String(curso.id_curso)}
                                className="hover:bg-purple-50 hover:text-purple-600 transition-all cursor-pointer"
                              >
                                {curso.nome_curso}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.fkId_curso && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {errors.fkId_curso.message}
                    </p>
                  )}
                </div>

                {/* SELECT COMPONENTE */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="w-1 h-4 bg-purple-600 rounded-full"></span>
                    Componente Curricular
                  </label>
                  <Controller
                    control={control}
                    name="fkId_componente"
                    rules={{ required: "Selecione um componente" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full h-11 text-base cursor-pointer bg-white border-2 border-zinc-200 rounded-xl hover:border-purple-400 hover:shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300">
                          <SelectValue placeholder="Selecione o componente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Componentes</SelectLabel>
                            {componentes.map((componente: Componente) => (
                              <SelectItem
                                key={componente.id_componente}
                                value={String(componente.id_componente)}
                                className="hover:bg-purple-50 hover:text-purple-600 transition-all cursor-pointer"
                              >
                                {componente.nome_componente}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.fkId_componente && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {errors.fkId_componente.message}
                    </p>
                  )}
                </div>

                {/* TEXTAREA */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="w-1 h-4 bg-purple-600 rounded-full"></span>
                    Sua Pergunta
                  </label>
                  <textarea
                    {...register("pergunta", {
                      required: "A pergunta é obrigatória",
                    })}
                    value={perguntaText}
                    onChange={handlePerguntaChange}
                    className="w-full text-base bg-white border-2 border-zinc-200 rounded-xl px-4 py-3 min-h-[160px] focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-y transition-all duration-300 hover:border-purple-400 hover:shadow-sm placeholder:text-zinc-400"
                    placeholder="Descreva sua dúvida com detalhes... Quanto mais informações, melhor!"
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-sm flex-1">
                      {errors.pergunta && (
                        <p className="text-red-500 text-sm font-medium">
                          {errors.pergunta.message}
                        </p>
                      )}
                      {hasBadWords && !errors.pergunta && (
                        <p className="text-red-500 text-sm font-medium">
                          Sua pergunta contém palavras impróprias
                        </p>
                      )}
                    </div>
                    <div className="text-sm font-medium">
                      <span
                        className={`${
                          perguntaText.length > maxChars
                            ? "text-red-500"
                            : perguntaText.length > maxChars * 0.9
                            ? "text-orange-500"
                            : "text-zinc-500"
                        }`}
                      >
                        {perguntaText.length}/{maxChars}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTÃO */}
                <ActionButton
                  type="submit"
                  textIdle="Publicar Pergunta"
                  isLoading={isPending}
                  isSuccess={isSuccess}
                  disabled={isPending || hasBadWords || isSuccess}
                  enableRipplePulse
                  className="mt-2 w-full h-12 rounded-full"
                />
              </form>
            </motion.div>

            {/* SIDEBAR - DICAS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.2,
              }}
              className="flex flex-col gap-6 lg:sticky lg:top-6"
            >
              {/* CARD DE DICAS - ESTILO ARTÍSTICO */}
              <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl shadow-2xl overflow-hidden h-full">
                {/* Decoração de fundo */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                </div>

                {/* Três pontinhos no topo */}
                <div className="relative flex justify-end p-6 pb-0">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="relative px-8 pb-8 pt-4 flex flex-col h-full">
                  {/* Aspas decorativas */}
                  <div className="text-6xl font-serif text-white/20 leading-none mb-2">
                    "
                  </div>

                  {/* Título */}
                  <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
                    Dicas para uma{" "}
                    <span className="text-purple-200">boa pergunta</span>
                  </h3>

                  {/* Lista de dicas */}
                  <ul className="space-y-3 mb-6 flex-1">
                    {TipsForAsking.map((tip, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3 group"
                        whileHover={{ x: 6, scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm font-bold mt-0.5 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                          {index + 1}
                        </span>
                        <span className="text-sm text-white/90 leading-relaxed pt-1">
                          {tip.text}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Assinatura */}
                  <div className="text-sm text-purple-200 font-medium mt-auto">
                    - Equipe Estudare
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
