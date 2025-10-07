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
    { text: "Seja específico e forneça contexto" },
    { text: "Verifique se sua pergunta está clara e objetiva" },
    { text: "Adicione detalhes relevantes que possam ajudar a responder" },
  ];

  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePerguntaData>();

  const { mutate, isPending } = useCreatePergunta();

  const onSubmit = (data: CreatePerguntaData) => {
    const payload = { ...data, fkId_usuario: id_usuario || "" };
    mutate(payload, {
      onSuccess: () => {
        router.push("/home");
      },
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between items-center">
      <main className="w-full flex flex-col items-center justify-center gap-4 p-4 flex-grow mt-6">
        <div className="flex gap-8 w-full md:w-3/4 lg:w-2/3 p-8">
          <div className="w-3/5">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-6xl font-bold text-black bg-clip-text">
                <span className="text-purple-600">FAÇA</span>
                <br />
                SUA PERGUNTA
              </h1>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Curso
                </span>
                <Controller
                  control={control}
                  name="fkId_curso"
                  rules={{ required: "Selecione um curso" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full text-base cursor-pointer bg-zinc-200 rounded-xs border border-zinc-200 hover:border-purple-500 hover:shadow-md transition-all duration-300">
                        <SelectValue placeholder="Selecione o curso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Cursos</SelectLabel>
                          {cursos?.map((curso: Curso) => (
                            <SelectItem
                              key={curso.id_curso}
                              value={String(curso.id_curso)}
                              className="hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
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

              {/* COMPONENTE (Select) */}
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Componente
                </span>
                <Controller
                  control={control}
                  name="fkId_componente"
                  rules={{ required: "Selecione um componente" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full text-base cursor-pointer bg-zinc-200 rounded-xs border border-zinc-200 hover:border-purple-500 hover:shadow-md transition-all duration-300">
                        <SelectValue placeholder="Selecione o componente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Componentes</SelectLabel>
                          {componentes?.map((componente: Componente) => (
                            <SelectItem
                              key={componente.id_componente}
                              value={String(componente.id_componente)}
                              className="hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
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

              {/* PERGUNTA (Textarea) */}
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Sua pergunta
                </span>
                <textarea
                  {...register("pergunta", {
                    required: "A pergunta é obrigatória",
                  })}
                  className="w-full text-base bg-zinc-200 border border-zinc-200 rounded px-3 py-2 min-h-[150px] focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-y transition-all duration-300 hover:border-purple-500 hover:shadow-md focus:shadow-purple-100"
                  placeholder="Descreva sua dúvida com detalhes para obter melhores respostas"
                />
                {errors.pergunta && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.pergunta.message}
                  </p>
                )}
              </div>

              {/* BOTÃO */}
              <div className="mt-6 flex flex-col gap-4">
                <div className="transform transition-all duration-300">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="p-4 rounded-md bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-950 hover:-translate-y-1 transition-all duration-300 cursor-pointer disabled:opacity-60"
                  >
                    <p className="text-white text-xs lg:text-lg">
                      {isPending ? "Enviando..." : "Fazer pergunta"}
                    </p>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* DICAS */}
          <div className="flex flex-col items-center">
            <Image
              src={"/imagens/ilustration_askQuestion.png"}
              alt="Imagem de pergunta"
              width={175}
              height={175}
            />
            <div className="flex flex-col h-fit gap-4 mt-2 p-4 bg-purple-50/50 rounded-lg border-l-4 border border-purple-100/50">
              <p className="text-sm text-purple-700 font-medium hover:text-purple-900">
                Dicas para uma boa pergunta:
              </p>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-2">
                {TipsForAsking.map((tip, index) => (
                  <li
                    key={index}
                    className="hover:text-purple-700 transition-colors duration-200"
                  >
                    {tip.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
