"use client";

import Footer from "@/components/layout/footer";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  UserCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { HeaderLoginCadastro } from "@/components/layout/header";
import { motion, AnimatePresence } from "framer-motion";
import { modal } from "@heroui/react";

export default function CadastroUsuario() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [senhaFocus, setSenhaFocus] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro" | null;
    texto: string;
  }>({ tipo: null, texto: "" });

  const router = useRouter();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nome_usuario: "",
      apelido_usuario: "",
      email_usuario: "",
      senha_usuario: "",
      fkIdTipoUsuario: "dcf9817e-9d57-4f68-9b29-eb5ca87ee26c",
    },
  });

  const senha = watch("senha_usuario");

  const onSubmit = async (data: any) => {
    setMensagem({ tipo: null, texto: "" });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMensagem({
          tipo: "sucesso",
          texto: "Você foi cadastrado com sucesso! Redirecionando...",
        });
        setTimeout(() => {
          router.push("/Auth/Login");
        }, 1500);

        console.log("Usuário cadastrado com sucesso", data);
      } else if (res.status === 409) {
        setMensagem({
          tipo: "erro",
          texto: "Já existe um usuário cadastrado com esse email.",
        });
      } else {
        const errorData = await res.json();
        setMensagem({
          tipo: "erro",
          texto: errorData.message || "Erro ao cadastrar usuário.",
        });
        console.error("Erro ao cadastrar usuário:", errorData);
        console.log("Resposta do servidor:", data);
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setMensagem({
        tipo: "erro",
        texto: "Erro ao conectar ao servidor.",
      });
    }
  };

  // Funções para força de senha
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength(senha);
  const totalSegments = 4;

  const getStrengthColor = (index: number) => {
    if (index >= strength) return "bg-gray-200";
    if (strength <= 2) return "bg-purple-300";
    if (strength === 3) return "bg-purple-400";
    if (strength === 4) return "bg-purple-500";
    return "bg-purple-600";
  };

  const requisitosSenha = [
    { label: "Pelo menos 8 caracteres", valid: senha?.length >= 8 },
    { label: "Inclua números", valid: /\d/.test(senha) },
    { label: "Use letras maiúsculas", valid: /[A-Z]/.test(senha) },
    { label: "Adicione caractere especial", valid: /[^A-Za-z0-9]/.test(senha) },
  ];

  return (
    <div className="max-h-screen flex flex-col bg-white w-full">
      <div className="w-full lg:max-w-[1300px] mx-auto flex-1 flex flex-col">
        <main className="flex-1 flex flex-col items-center">
          <HeaderLoginCadastro />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100 flex flex-col gap-5 relative"
          >
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Controller
                  name="nome_usuario"
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
              {errors.nome_usuario && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nome_usuario.message}
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
                  name="apelido_usuario"
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
              {errors.apelido_usuario && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.apelido_usuario.message}
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
                  name="email_usuario"
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
                      type="email_usuario"
                      placeholder="Digite seu email"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
                    />
                  )}
                />
              </div>
              {errors.email_usuario && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email_usuario.message}
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <LockClosedIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Controller
                  name="senha_usuario"
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
                      onFocus={() => setSenhaFocus(true)}
                      onBlur={() => setSenhaFocus(false)}
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
              {errors.senha_usuario && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.senha_usuario.message}
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

              {/* Checklist animado */}
              <AnimatePresence mode="sync">
                {(senhaFocus || senha) && (
                  <motion.div
                    key="password-tips"
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.98, height: 0 }}
                    animate={{ opacity: 1, y: 0, scale: 1, height: "auto" }}
                    exit={{ opacity: 0, y: -10, scale: 0.97, height: 0 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.25, 0.1, 0.25, 1], // easing mais natural
                    }}
                    className="mt-3 p-4 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Torne sua senha mais segura:
                    </p>
                    <ul className="space-y-2 text-sm">
                      {requisitosSenha.map((req, i) => (
                        <li
                          key={i}
                          className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                            req.valid
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <span
                            className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                              req.valid
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            {req.valid ? "✔" : "✖"}
                          </span>
                          {req.label}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mensagem de feedback */}
            {mensagem.tipo && (
              <div
                className={`text-center text-sm font-medium p-2 rounded ${
                  mensagem.tipo === "sucesso"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {mensagem.texto}
              </div>
            )}

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
                href="/Auth/Login"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Entrar agora
              </a>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}
