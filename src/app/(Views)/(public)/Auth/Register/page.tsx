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
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { HeaderLoginCadastro } from "@/components/layout/header";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { motion, AnimatePresence } from "framer-motion";
import { ActionButton } from "@/components/ui/actionButton";
import { modal } from "@heroui/react";

export default function CadastroUsuario() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [senhaFocus, setSenhaFocus] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro" | null;
    texto: string;
  }>({ tipo: null, texto: "" });

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTimer = useRef<number | null>(null);

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
  const emailValue = watch("email_usuario");
  const nomeValue = watch("nome_usuario");
  const apelidoValue = watch("apelido_usuario");

  // email availability state
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const emailTimer = useRef<number | null>(null);
  const nomeTimer = useRef<number | null>(null);
  const apelidoTimer = useRef<number | null>(null);

  const [nomeStatus, setNomeStatus] = useState<
    "idle" | "checking" | "clean" | "bad"
  >("idle");
  const [apelidoStatus, setApelidoStatus] = useState<
    "idle" | "checking" | "clean" | "bad"
  >("idle");

  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    setMensagem({ tipo: null, texto: "" });
    if (emailStatus === "taken") {
      setMensagem({ tipo: "erro", texto: "Este email já está em uso." });
      return;
    }

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
        setSuccess(true);
        // Preserve redirect context (?next, ?redirect, ?from, ?returnUrl) and add a short delay before redirect
        const nextParam =
          searchParams.get("next") ||
          searchParams.get("redirect") ||
          searchParams.get("from") ||
          searchParams.get("returnUrl");
        const loginTarget = nextParam
          ? `/Auth/Login?next=${encodeURIComponent(nextParam)}`
          : "/Auth/Login";

        redirectTimer.current = window.setTimeout(() => {
          router.replace(loginTarget);
        }, 1200);

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

  // Cleanup pending redirect timeout on unmount
  useEffect(() => {
    return () => {
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current);
    };
  }, []);

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

  // Debounced email availability check (~1s after user stops typing)
  useEffect(() => {
    // only run availability check when there's an email and it contains '@'
    if (!emailValue || errors.email_usuario || !emailValue.includes("@")) {
      setEmailStatus("idle");
      return;
    }
    if (emailTimer.current) window.clearTimeout(emailTimer.current);
    emailTimer.current = window.setTimeout(async () => {
      try {
        setEmailStatus("checking");
        const url = `${
          process.env.NEXT_PUBLIC_API_URL
        }/user/check-email?email=${encodeURIComponent(emailValue)}`;
        const res = await fetch(url, { method: "GET" });
        if (res.ok) {
          const body = await res.json();
          // expect { exists: boolean } from backend; fallback to truthy
          if (body && body.exists) setEmailStatus("taken");
          else setEmailStatus("available");
        } else if (res.status === 404) {
          // not found -> available
          setEmailStatus("available");
        } else {
          setEmailStatus("idle");
        }
      } catch (e) {
        // network or server error -> don't block user
        setEmailStatus("idle");
      }
    }, 1000);

    return () => {
      if (emailTimer.current) window.clearTimeout(emailTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailValue]);

  // Debounced name check (~1s after stop typing; avoid offensive words)
  useEffect(() => {
    if (!nomeValue) {
      setNomeStatus("idle");
      return;
    }
    if (nomeTimer.current) window.clearTimeout(nomeTimer.current);
    nomeTimer.current = window.setTimeout(async () => {
      try {
        setNomeStatus("checking");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/validate-text`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: nomeValue }),
          }
        );
        if (res.ok) {
          const body = await res.json();
          setNomeStatus(body.containsOffensive ? "bad" : "clean");
        } else {
          setNomeStatus("idle");
        }
      } catch (e) {
        setNomeStatus("idle");
      }
    }, 1000);

    return () => {
      if (nomeTimer.current) window.clearTimeout(nomeTimer.current);
    };
  }, [nomeValue]);

  // Debounced apelido check (~1s after stop typing)
  useEffect(() => {
    if (!apelidoValue) {
      setApelidoStatus("idle");
      return;
    }
    if (apelidoTimer.current) window.clearTimeout(apelidoTimer.current);
    apelidoTimer.current = window.setTimeout(async () => {
      try {
        setApelidoStatus("checking");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/validate-text`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: apelidoValue }),
          }
        );
        if (res.ok) {
          const body = await res.json();
          setApelidoStatus(body.containsOffensive ? "bad" : "clean");
        } else {
          setApelidoStatus("idle");
        }
      } catch (e) {
        setApelidoStatus("idle");
      }
    }, 1000);

    return () => {
      if (apelidoTimer.current) window.clearTimeout(apelidoTimer.current);
    };
  }, [apelidoValue]);

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      <div className="w-full lg:max-w-[1300px] mx-auto flex-1 flex flex-col">
        <main
          className={
            "flex-1 flex flex-col items-center mt-18 " +
            (senhaFocus || senha ? "pb-12" : "")
          }
        >
          <HeaderLoginCadastro />

          <div className="relative w-full max-w-md">
            <GlowingEffect
              spread={80}
              glow={true}
              disabled={false}
              proximity={160}
              inactiveZone={0.25}
              borderWidth={3}
              movementDuration={0.9}
              blur={8}
            />
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 0.8, 0.12, 1] }}
              className="relative bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100 flex flex-col gap-5"
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
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {nomeStatus === "checking" && (
                      <svg
                        className="animate-spin h-4 w-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {nomeStatus === "bad" && (
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                    )}
                    {nomeStatus === "clean" && (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
                {errors.nome_usuario && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nome_usuario.message}
                  </p>
                )}
                {nomeStatus === "bad" && (
                  <p className="text-red-500 text-xs mt-1">
                    Nome contém palavras impróprias.
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
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {apelidoStatus === "checking" && (
                      <svg
                        className="animate-spin h-4 w-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {apelidoStatus === "bad" && (
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                    )}
                    {apelidoStatus === "clean" && (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
                {errors.apelido_usuario && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.apelido_usuario.message}
                  </p>
                )}
                {apelidoStatus === "bad" && (
                  <p className="text-red-500 text-xs mt-1">
                    Apelido contém palavras impróprias.
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
                  <AnimatePresence>
                    {emailStatus !== "idle" && (
                      <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {emailStatus === "checking" && (
                          <svg
                            className="animate-spin h-5 w-5 text-purple-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="2"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        )}
                        {emailStatus === "available" && (
                          <CheckCircleIcon className="h-5 w-5 text-green-500 stroke-[2.5]" />
                        )}
                        {emailStatus === "taken" && (
                          <XCircleIcon className="h-5 w-5 text-red-500 stroke-[2.5]" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                        type="email"
                        placeholder="Digite seu email"
                        className="w-full pl-10 pr-10 py-2 border rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
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
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                              req.valid
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <span
                              className={`flex items-center justify-center w-6 h-6 rounded-full ${
                                req.valid
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {req.valid ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </span>
                            <span className="flex-1 text-sm">{req.label}</span>
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

              {/* Botão principal animado */}
              <ActionButton
                type="submit"
                textIdle={
                  isSubmitting
                    ? "Cadastrando..."
                    : emailStatus === "checking"
                    ? "Verificando email..."
                    : "Cadastrar-se"
                }
                isLoading={isSubmitting || emailStatus === "checking"}
                isSuccess={success}
                disabled={
                  isSubmitting ||
                  emailStatus === "taken" ||
                  nomeStatus === "bad" ||
                  apelidoStatus === "bad"
                }
                enableRipplePulse
                className="w-full"
              />

              {/* email status feedback */}
              <AnimatePresence>
                {emailStatus === "taken" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="text-sm text-red-600 bg-red-50 p-2 rounded"
                  >
                    Este email já está em uso.
                  </motion.div>
                )}
                {emailStatus === "available" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="text-sm text-green-700 bg-green-50 p-2 rounded"
                  >
                    Email disponível ✅
                  </motion.div>
                )}
              </AnimatePresence>

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
            </motion.form>
          </div>
        </main>
      </div>
    </div>
  );
}
