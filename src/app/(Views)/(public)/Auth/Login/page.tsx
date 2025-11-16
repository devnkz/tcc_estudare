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

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const interregular = Inter({ subsets: ["latin"], weight: ["400"] });
const interbold = Inter({ subsets: ["latin"], weight: ["700"] });

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

  // --------- MODAL + OTP ---------
  const [openOTPModal, setOpenOTPModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const login = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setErrorMessage("");
    setEmailError("");
    setSenhaError("");

    if (!form.email_usuario.trim()) setEmailError("Preencha o email.");
    if (!form.senha_usuario.trim()) setSenhaError("Preencha a senha.");
    if (!form.email_usuario.trim() || !form.senha_usuario.trim()) return;

    setIsLoading(true);

    try {
      // Apenas verifica credenciais primeiro
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        if (res.status === 401) setSenhaError("Credenciais inválidas.");
        else if (res.status === 404) setEmailError("Email não cadastrado.");
        else setErrorMessage("Erro ao conectar ao servidor.");
        return;
      }

      // Abre modal para digitar OTP
      setOpenOTPModal(true);
    } catch (error) {
      console.error("Erro ao logar usuário:", error);
      setErrorMessage("Erro ao conectar ao servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmarOTP = async () => {
    if (otpValue.length !== 6) {
      setErrorMessage("Digite os 6 dígitos.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verify-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email_usuario,
            code: otpValue,
          }),
        }
      );

      if (!res.ok) {
        setErrorMessage("Código incorreto.");
        return;
      }

      const data = await res.json();

      document.cookie = `token=${data.token}; path=/; max-age=${
        isChecked ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7
      }; SameSite=Strict`;

      setSuccess(true);
      setTimeout(() => router.push("/home"), 600);
    } catch (e) {
      setErrorMessage("Falha ao validar código.");
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

              {/* lembrete */}
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
                    className={`${interregular.className} text-gray-700 text-sm`}
                  >
                    {isChecked ? "Lembraremos de você :)" : "Lembre de mim"}
                  </div>
                </label>

                <button className="text-purple-600 hover:underline">
                  Esqueceu a senha?
                </button>
              </div>

              {/* mensagens */}
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

              <p className="text-center text-sm text-gray-600">
                Ainda não tem uma conta?
                <Link
                  href="/Auth/Register"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  {" "}
                  Criar agora
                </Link>
              </p>
            </form>
          </div>
        </main>
      </div>

      {/* MODAL OTP */}
      <Dialog open={openOTPModal} onOpenChange={setOpenOTPModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Digite o código enviado ao seu email</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center py-4">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <DialogFooter>
            <button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={confirmarOTP}
            >
              Confirmar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
