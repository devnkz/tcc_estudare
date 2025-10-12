"use client";

import Footer from "@/components/layout/footer";
import Image from "next/image";
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
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  } = useForm<CreatePerguntaData>();

  const { mutate, isPending } = useCreatePergunta();

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) setHeaderHeight(header.offsetHeight);
  }, []);

  const onSubmit = (data: CreatePerguntaData) => {
    const payload = { ...data, fkId_usuario: id_usuario || "" };
    mutate(payload, {
      onSuccess: () => router.push("/home"),
    });
  };

  return (
    <div
      className="w-full flex flex-col justify-between items-center font-[Inter] "
      style={{ paddingTop: headerHeight }}
    >
      <main className="w-full flex flex-col items-center justify-center mt-10 mb-10">
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-16 w-full max-w-4xl p-10 bg-white/80 rounded-2xl shadow-xl border border-purple-100/40 backdrop-blur-sm"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* FORMULÁRIO */}
          <div className="flex-1 w-full max-w-md">
            <h1 className="text-5xl font-extrabold text-purple-700 leading-tight gap-2">
              <span className="text-black">FAÇA SUA </span>
              PERGUNTA
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* SELECT CURSO */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Curso
                </label>
                <Controller
                  control={control}
                  name="fkId_curso"
                  rules={{ required: "Selecione um curso" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full text-base cursor-pointer bg-zinc-100 border border-zinc-200 rounded-md hover:border-purple-400 hover:shadow-md focus:border-purple-500 transition-all duration-300">
                        <SelectValue placeholder="Selecione o curso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Cursos</SelectLabel>
                          {cursos.map((curso: Curso) => (
                            <SelectItem
                              key={curso.id_curso}
                              value={String(curso.id_curso)}
                              className="hover:bg-purple-100 hover:text-purple-700 transition-all"
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
                  <p className="text-red-600 text-sm mt-1">
                    {errors.fkId_curso.message}
                  </p>
                )}
              </div>

              {/* SELECT COMPONENTE */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Componente
                </label>
                <Controller
                  control={control}
                  name="fkId_componente"
                  rules={{ required: "Selecione um componente" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full text-base cursor-pointer bg-zinc-100 border border-zinc-200 rounded-md hover:border-purple-400 hover:shadow-md focus:border-purple-500 transition-all duration-300">
                        <SelectValue placeholder="Selecione o componente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Componentes</SelectLabel>
                          {componentes.map((componente: Componente) => (
                            <SelectItem
                              key={componente.id_componente}
                              value={String(componente.id_componente)}
                              className="hover:bg-purple-100 hover:text-purple-700 transition-all"
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
                  <p className="text-red-600 text-sm mt-1">
                    {errors.fkId_componente.message}
                  </p>
                )}
              </div>

              {/* TEXTAREA */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Sua pergunta
                </label>
                <textarea
                  {...register("pergunta", {
                    required: "A pergunta é obrigatória",
                  })}
                  className="w-full text-base bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-3 min-h-[150px] focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-y transition-all duration-300 hover:border-purple-400 hover:shadow-md"
                  placeholder="Descreva sua dúvida com detalhes..."
                />
                {errors.pergunta && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.pergunta.message}
                  </p>
                )}
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={isPending}
                className="p-4 rounded-md bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer disabled:opacity-60"
              >
                <p className="text-white text-lg font-semibold tracking-wide">
                  {isPending ? "Enviando..." : "Fazer pergunta "}
                </p>
              </button>
            </form>
          </div>

          {/* DICAS E IMAGEM */}
          <div className="flex flex-col items-center flex-1 justify-center ">
            <Image
              src="/imagens/video_13543815.png"
              alt="Ilustração"
              width={350}
              height={350}
              className="animate-bounce-slow p-3"
            />

            <div className="flex flex-col p-7 gap-2 bg-gradient-to-br from-purple-50 via-purple-100/30 to-purple-50 rounded-xl border border-purple-200/50 shadow-md hover:shadow-lg transition-all duration-300 max-w-xs">
              <p className="text-base text-purple-800 font-semibold">
                Dicas para uma boa pergunta:
              </p>
              <ul className="text-sm text-gray-700 list-disc space-y-2 text-left cursor-pointer">
                {TipsForAsking.map((tip, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, x: 7 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {tip.text}
                  </motion.div>
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
