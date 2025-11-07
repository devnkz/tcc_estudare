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
    { text: "Seja específico e forneça contexto." },
    { text: "Verifique se sua pergunta está clara. " },
    { text: "Adicione detalhes relevantes." },
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
  const maxChars = 1000;

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

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

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
      onSuccess: () => router.push("/home"),
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
    <div
      className="w-full min-h-screen flex flex-col justify-between items-center font-[Inter]"
      style={{ paddingTop: headerHeight + 20 }}
    >
      <main
        className="w-full max-w-[1100px] px-4 md:px-6 flex flex-col items-center"
        style={{ paddingBottom: headerHeight - 10 }}
      >
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-8 w-full p-6 md:p-10 bg-[var(--card)]/80 rounded-2xl shadow-xl border border-[var(--border)]/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* FORMULÁRIO */}
          <div className="flex-1 w-full max-w-md">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              <span className="text-purple-500">FAÇA SUA </span>
              <span className="text-purple-700">PERGUNTA</span>
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* SELECT CURSO */}
              <div>
                <label className="text-sm font-semibold text-[var(--foreground)]">
                  Curso
                </label>
                <Controller
                  control={control}
                  name="fkId_curso"
                  rules={{ required: "Selecione um curso" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full text-base cursor-pointer bg-[var(--input)] border border-[var(--border)] rounded-md hover:border-purple-500 hover:shadow-md focus:border-purple-500 transition-all duration-300">
                        <SelectValue placeholder="Selecione o curso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Cursos</SelectLabel>
                          {cursos.map((curso: Curso) => (
                            <SelectItem
                              key={curso.id_curso}
                              value={String(curso.id_curso)}
                              className="hover:bg-purple-50 hover:text-purple-600 transition-all"
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
                  <p className="text-[var(--destructive)] text-sm mt-1">
                    {errors.fkId_curso.message}
                  </p>
                )}
              </div>

              {/* SELECT COMPONENTE */}
              <div>
                <label className="text-sm font-semibold text-[var(--foreground)]">
                  Componente
                </label>
                <Controller
                  control={control}
                  name="fkId_componente"
                  rules={{ required: "Selecione um componente" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full text-base cursor-pointer bg-[var(--input)] border border-[var(--border)] rounded-md hover:border-purple-500 hover:shadow-md focus:border-purple-500 transition-all duration-300">
                        <SelectValue placeholder="Selecione o componente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Componentes</SelectLabel>
                          {componentes.map((componente: Componente) => (
                            <SelectItem
                              key={componente.id_componente}
                              value={String(componente.id_componente)}
                              className="hover:bg-purple-50 hover:text-purple-600 transition-all"
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
                  <p className="text-[var(--destructive)] text-sm mt-1">
                    {errors.fkId_componente.message}
                  </p>
                )}
              </div>

              {/* TEXTAREA */}
              <div>
                <label className="text-sm font-semibold text-[var(--foreground)] mb-1 block">
                  Sua pergunta
                </label>
                <textarea
                  {...register("pergunta", {
                    required: "A pergunta é obrigatória",
                  })}
                  value={perguntaText}
                  onChange={handlePerguntaChange}
                  className="w-full text-base bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-3 min-h-[150px] focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 resize-y transition-all duration-300 hover:border-purple-500 hover:shadow-md"
                  placeholder="Descreva sua dúvida com detalhes..."
                />
                <div className="flex items-center justify-between mt-1">
                  <div className="text-sm">
                    {errors.pergunta && (
                      <p className="text-[var(--destructive)] text-sm">
                        {errors.pergunta.message}
                      </p>
                    )}
                    {hasBadWords && !errors.pergunta && (
                      <p className="text-[var(--destructive)] text-sm">
                        Sua pergunta contém palavras impróprias — remova-as
                        antes de enviar.
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    <span
                      className={`${
                        perguntaText.length > maxChars
                          ? "text-[var(--destructive)]"
                          : "text-[var(--muted-foreground)]"
                      }`}
                    >
                      {perguntaText.length}/{maxChars}
                    </span>
                  </div>
                </div>
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={isPending || hasBadWords}
                className="p-4 rounded-md bg-purple-600 text-white flex gap-2 justify-center items-center hover:bg-purple-700 transition-all duration-300 cursor-pointer disabled:opacity-60"
              >
                <p className="text-white text-lg font-semibold tracking-wide">
                  {isPending ? "Enviando..." : "Fazer pergunta"}
                </p>
              </button>
            </form>
          </div>

          {/* DICAS E IMAGEM */}
          <div className="flex flex-col items-center flex-1 justify-center gap-6 mt-6 md:mt-0">
            <img
              src="/imagens/search_13543825.png"
              alt="Ilustração"
              width={260}
              height={260}
              className="w-40 md:w-72 h-auto animate-bounce-slow p-3"
            />

            <div className="flex flex-col p-6 gap-2 bg-[var(--secondary)]/8 rounded-xl border border-[var(--border)]/20 shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-xs">
              <p className="text-base text-[var(--secondary-foreground)] font-semibold">
                Dicas para uma boa pergunta:
              </p>
              <ul className="text-sm text-[var(--muted-foreground)] list-disc space-y-2 pl-5">
                {TipsForAsking.map((tip, index) => (
                  <li key={index}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 7 }}
                      transition={{ type: "spring", stiffness: 100 }}
                    >
                      {tip.text}
                    </motion.div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
