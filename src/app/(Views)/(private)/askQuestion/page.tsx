"use client";

import { useState } from "react";
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

export default function AskQuestionPage() {
  const [form, setForm] = useState({
    titulo: "",
    materia: "",
    pergunta: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulando envio com um pequeno delay
    setTimeout(() => {
      // Aqui você implementaria a lógica para enviar a pergunta
      console.log("Pergunta enviada:", form);

      // Mostrar mensagem de sucesso
      setShowSuccess(true);

      // Esconder mensagem após 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
        // Resetar o formulário após envio
        setForm({ titulo: "", materia: "", pergunta: "" });
        setIsSubmitting(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between items-center ">
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Matéria
                </span>
                <Select
                  onValueChange={(value) => handleChange("materia", value)}
                >
                  <SelectTrigger className="w-full text-base bg-zinc-200 rounded-xs border border-zinc-200 hover:border-purple-500 hover:shadow-md transition-all duration-300">
                    <SelectValue placeholder="Selecione a matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Matérias</SelectLabel>
                      <SelectItem
                        value="matematica"
                        className="hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
                      >
                        Matemática
                      </SelectItem>
                      <SelectItem
                        value="portugues"
                        className="hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
                      >
                        Português
                      </SelectItem>
                      <SelectItem
                        value="fisica"
                        className="hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
                      >
                        Física
                      </SelectItem>
                      <SelectItem
                        value="quimica"
                        className="hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
                      >
                        Química
                      </SelectItem>
                      <SelectItem
                        value="biologia"
                        className="hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
                      >
                        Biologia
                      </SelectItem>
                      <SelectItem
                        value="historia"
                        className="hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
                      >
                        História
                      </SelectItem>
                      <SelectItem
                        value="geografia"
                        className="hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
                      >
                        Geografia
                      </SelectItem>
                      <SelectItem
                        value="ingles"
                        className="hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
                      >
                        Inglês
                      </SelectItem>
                      <SelectItem
                        value="programacao"
                        className="hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
                      >
                        Programação
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Sua pergunta
                </span>
                <textarea
                  className="w-full text-base bg-zinc-200 border border-zinc-200 rounded px-3 py-2 min-h-[150px] focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-y transition-all duration-300 hover:border-purple-500 hover:shadow-md focus:shadow-purple-100"
                  placeholder="Descreva sua dúvida com detalhes para obter melhores respostas"
                  value={form.pergunta}
                  onChange={(e) => handleChange("pergunta", e.target.value)}
                  required
                />
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <div className="transform transition-all duration-300 active:scale-95">
                  <button className="p-4 rounded-md bg-purple-600 flex gap-2 justify-center items-center hover:bg-purple-950 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <p className="text-white text-xs lg:text-lg">
                      Fazer pergunta
                    </p>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="flex flex-col items-center">
            <Image
              src={"/imagens/ilustration_askQuestion.png"}
              alt="Imagem de pergunta"
              width={175}
              height={175}
            />

            <div className="flex flex-col h-fit gap-4 mt-2 p-4 bg-purple-50/50 rounded-lg border-l-4 border border-purple-100/50 transition-all duration-300 hover:bg-purple-50 hover:border-purple-200/50 hover:border-l-[6px]">
              <p className="text-sm text-purple-700 font-medium transition-all duration-300 hover:text-purple-900 hover:translate-x-1">
                Dicas para uma boa pergunta:
              </p>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-2">
                <li className="transition-all duration-300 hover:translate-x-2 hover:text-purple-700">
                  <span className="font-medium">Seja específico</span> e forneça
                  contexto
                </li>
                <li className="transition-all duration-300 hover:translate-x-2 hover:text-purple-700">
                  <span className="font-medium">Verifique</span> se sua pergunta
                  está clara e objetiva
                </li>
                <li className="transition-all duration-300 hover:translate-x-2 hover:text-purple-700">
                  <span className="font-medium">Adicione detalhes</span>{" "}
                  relevantes que possam ajudar a responder
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
