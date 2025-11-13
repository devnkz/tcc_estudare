"use client";

import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { HeaderLoginCadastro } from "../../../../../components/layout/header";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useState } from "react";
import { motion } from "framer-motion";
import { ActionButton } from "@/components/ui/actionButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";

const interthin = Inter({ subsets: ["latin"], weight: ["100"] });
const interextraLight = Inter({ subsets: ["latin"], weight: ["200"] });
const interlight = Inter({ subsets: ["latin"], weight: ["300"] });
const interregular = Inter({ subsets: ["latin"], weight: ["400"] });
const intermedium = Inter({ subsets: ["latin"], weight: ["500"] });
const intersemibold = Inter({ subsets: ["latin"], weight: ["600"] });
const interbold = Inter({ subsets: ["latin"], weight: ["700"] });
const interextrabold = Inter({ subsets: ["latin"], weight: ["800"] });
const interblack = Inter({ subsets: ["latin"], weight: ["900"] });

export default function LoginUsuario() {
  const [form, setForm] = useState({
    email_usuario: "",
    senha_usuario: "",
  });
  const router = useRouter();

  const [isChecked, setIsChecked] = useState(false);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const login = async (event?: React.FormEvent) => {
    event?.preventDefault();
    // reset errors
    setErrorMessage("");
    setEmailError("");
    setSenhaError("");

    // basic client-side validation
    if (!form.email_usuario.trim()) {
      setEmailError("Preencha o email.");
    }
    if (!form.senha_usuario.trim()) {
      setSenhaError("Preencha a senha.");
    }
    if (!form.email_usuario.trim() || !form.senha_usuario.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        // set cookie and redirect
        const maxAge = isChecked ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days if remember me
        document.cookie = `token=${data.token}; path=/; max-age=${maxAge}; SameSite=Strict`;
        setSuccess(true);
        setTimeout(() => router.push("/home"), 600);
        return;
      }

      // handle common error statuses
      if (res.status === 401) {
        // generic message near password input
        setSenhaError("Credenciais inválidas — verifique e tente novamente");
      } else if (res.status === 404) {
        // email not registered
        setEmailError("Email não cadastrado.");
      } else if (res.status === 400) {
        const body = await res.json();
        setErrorMessage(body?.message || "Requisição inválida.");
      } else {
        const body = await res.json().catch(() => null);
        setErrorMessage(body?.message || "Erro ao conectar ao servidor.");
      }
    } catch (error) {
      console.error("Erro ao logar usuário:", error);
      setErrorMessage("Erro ao conectar ao servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      <div className="w-full lg:max-w-[1300px] mx-auto flex-1 flex flex-col mt-18">
        <HeaderLoginCadastro />

        <main className="flex-1 flex flex-col items-center">
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
            <form
              onSubmit={login}
              className="relative bg-white shadow-lg rounded-2xl p-8 w-full border border-gray-100 flex flex-col gap-5"
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    placeholder="Digite seu email"
                    value={form.email_usuario}
                    onChange={(e) =>
                      handleChange("email_usuario", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <LockClosedIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={form.senha_usuario}
                    onChange={(e) =>
                      handleChange("senha_usuario", e.target.value)
                    }
                    className="w-full pl-10 pr-10 py-2 border rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {mostrarSenha ? (
                      <EyeSlashIcon className="w-4.5 h-4.5 transition-colors" />
                    ) : (
                      <EyeIcon className="w-4.5 h-4.5 transition-colors" />
                    )}
                  </button>
                </div>
                {senhaError && (
                  <p className="text-red-500 text-xs mt-1">{senhaError}</p>
                )}
              </div>

              {/* Lembrar de mim / Esqueci senha */}
              <div className="flex items-center justify-between text-sm">
                <label
                  htmlFor="remember"
                  className="flex items-center relative cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="remember"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                    className={`${interbold.className} peer appearance-none w-4.5 h-4.5 bg-white border-2 border-purple-400 rounded-sm checked:bg-purple-600 checked:text-gray-200 checked:border-purple-600 transition-colors duration-300 cursor-pointer mr-2`}
                  />
                  <span className="absolute left-1 top-0 w-0.5 h-0.5 text-white text-sm pointer-events-none peer-checked:content-['✔']">
                    ✔
                  </span>
                  <div
                    className={`${interregular.className} font-regular font- text-gray-700 gap-1 text-sm`}
                  >
                    {isChecked ? "Lembraremos de você :)" : "Lembre de mim"}
                  </div>
                </label>

                <button
                  type="button"
                  className="text-purple-600 hover:underline cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Botão principal */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-red-600 bg-red-50 p-2 rounded mb-2"
                >
                  {errorMessage}
                </motion.div>
              )}

              <ActionButton
                type="submit"
                textIdle={isLoading ? "Entrando..." : "Entrar"}
                isLoading={isLoading}
                isSuccess={success}
                disabled={isLoading}
                enableRipplePulse
                className="w-full"
              />

              {/* Mensagem de redirecionamento */}
              <p className="text-center text-sm text-gray-600">
                Ainda não tem uma conta?
                <Link
                  href="/Auth/Register"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  {" "}
                  Criar agora
                </Link>
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
