"use client";

import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  UserCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Curso } from "@/types/curso";

export default function CadastroUsuario({ cursos }: { cursos: any }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      apelido: "",
      fkIdCurso: "",
      email: "",
      senha: "",
    },
  });

  const senha = watch("senha");

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const responseData = await res.json();
        console.log("Usuário cadastrado com sucesso:", responseData);
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  };

  const getPasswordStrength = (password: any) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength(senha);
  const totalSegments = 4;

  const getStrengthColor = (index: any) => {
    if (index >= strength) return "bg-gray-200";
    if (strength <= 2) return "bg-purple-300";
    if (strength === 3) return "bg-purple-400";
    if (strength === 4) return "bg-purple-500";
    return "bg-purple-600";
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white w-full font-sans`}>
      <div className="w-full lg:max-w-[1300px] mx-auto flex-1 flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center px-2 mt-5 mb-29">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100 flex flex-col gap-5"
          >
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Nome é obrigatório." }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Digite seu nome"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
                    />
                  )}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Apelido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apelido
              </label>
              <div className="relative">
                <UserCircleIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Controller
                  name="apelido"
                  control={control}
                  rules={{ required: "Apelido é obrigatório." }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Digite seu apelido"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
                    />
                  )}
                />
              </div>
              {errors.apelido && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.apelido.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Componente
              </span>
              <Controller
                control={control}
                name="fkIdCurso"
                rules={{ required: "Selecione seu curso" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full text-base cursor-pointer bg-zinc-200 rounded-xs border border-zinc-200 hover:border-purple-500 hover:shadow-md transition-all duration-300">
                      <SelectValue placeholder="Selecione o curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Componentes</SelectLabel>
                        {cursos?.map((curso: Curso) => (
                          <SelectItem
                            key={curso.id}
                            value={String(curso.id)}
                            className="hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
                          >
                            {curso.nome}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.fkIdCurso && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.fkIdCurso.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email é obrigatório.",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Email inválido.",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="Digite seu email"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
                    />
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Senha com olhinho */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <LockClosedIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Controller
                  name="senha"
                  control={control}
                  rules={{
                    required: "Senha é obrigatória.",
                    minLength: {
                      value: 8,
                      message: "A senha deve ter pelo menos 8 caracteres.",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="Digite sua senha"
                      className="w-full pl-10 pr-10 py-2 border rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {mostrarSenha ? (
                    <EyeSlashIcon className="w-4 h-4 transition-colors" />
                  ) : (
                    <EyeIcon className="w-4 h-4 transition-colors" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.senha.message}
                </p>
              )}

              {/* Barra de força */}
              <div className="flex gap-1 mt-2">
                {Array.from({ length: totalSegments }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded ${getStrengthColor(i)}`}
                  />
                ))}
              </div>
            </div>

            {/* Botão principal */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 transition-all text-white font-semibold py-3 rounded-lg shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar-se"}
            </button>

            {/* Mensagem de redirecionamento */}
            <p className="text-center text-sm text-gray-600">
              Já possui uma conta?{" "}
              <a
                href="Auth/Login"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Entrar agora
              </a>
            </p>
          </form>
        </main>
      </div>
      {/* Removed Footer and replaced with a placeholder */}
      <footer className="w-full py-4 border-t border-gray-200 text-center text-sm text-gray-500">
        © 2023 Todos os direitos reservados.
      </footer>
    </div>
  );
}
