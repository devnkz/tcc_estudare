"use client";

import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { HeaderLoginCadastro } from "../../../../../components/layout/header";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ActionButton } from "@/components/ui/actionButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";
import { getCookie } from "cookies-next";

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

  // If user becomes authenticated in another tab, redirect away from login
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = getCookie("token");
        if (token) router.replace("/home");
      } catch (e) {}
    };
    checkAuth();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token" || e.key === null) checkAuth();
    };
    const onVisibility = () => {
      if (!document.hidden) checkAuth();
    };
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);
    const iv = window.setInterval(checkAuth, 1500);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(iv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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

  useEffect(() => {
    if (!openOTPModal) return;
    const t = setTimeout(() => {
      try {
        const el = document.querySelector('[data-slot="input-otp"] input');
        if (el && (el as HTMLElement).focus) (el as HTMLElement).focus();
      } catch (e) {
        // ignore
      }
    }, 120);
    return () => clearTimeout(t);
  }, [openOTPModal]);

  // countdown timer (seconds)
  const [secondsLeft, setSecondsLeft] = useState<number>(300);
  useEffect(() => {
    if (!openOTPModal) return;
    setSecondsLeft(300);
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [openOTPModal]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const pct = Math.max(0, Math.round((secondsLeft / 300) * 100));

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
      setSuccess(false);
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
            email_usuario: form.email_usuario,
            codigo: otpValue,
          }),
        }
      );

      if (!res.ok) {
        setErrorMessage("Código informado não está correto.");
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
        <DialogContent className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-purple-600">
              Enviamos um código para o <br /> seu e-mail :)
            </DialogTitle>
            <p className="text-base text-zinc-600 mt-3 max-w-[36rem] text-center leading-relaxed">
              Verifique sua caixa de entrada. Expira em{" "}
              <span className="font-semibold">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </span>
            </p>
          </DialogHeader>

          <div className="flex flex-col items-center pb-4">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
              containerClassName="gap-3"
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="h-12 w-12 text-2xl rounded-md bg-white shadow-sm border border-zinc-200"
                />
                <InputOTPSlot
                  index={1}
                  className="h-12 w-12 text-2xl rounded-md bg-white shadow-sm border border-zinc-200"
                />
                <InputOTPSlot
                  index={2}
                  className="h-12 w-12 text-2xl rounded-md bg-white shadow-sm border border-zinc-200"
                />
              </InputOTPGroup>
              <InputOTPSeparator className="text-zinc-400 mx-2" />
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  className="h-12 w-12 text-2xl rounded-md bg-white shadow-sm border border-zinc-200"
                />
                <InputOTPSlot
                  index={4}
                  className="h-12 w-12 text-2xl rounded-md bg-white shadow-sm border border-zinc-200"
                />
                <InputOTPSlot
                  index={5}
                  className="h-12 w-12 text-2xl rounded-md bg-white shadow-sm border border-zinc-200"
                />
              </InputOTPGroup>
            </InputOTP>

            <div className="w-full">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-red-600 bg-red-50 p-2 rounded mt-4 w-full"
                >
                  {errorMessage}
                </motion.div>
              )}

              <p className="text-sm text-zinc-500 mt-3 text-center max-w-[36rem] mx-auto">
                Se não receber, verifique a pasta de spam.
              </p>
            </div>
          </div>

          <DialogFooter>
            <ActionButton
              textIdle={isLoading ? "Confirmando..." : "Confirmar"}
              isLoading={isLoading}
              isSuccess={success}
              className="w-full"
              onClick={confirmarOTP}
              enableRipplePulse
              disabled={otpValue.length !== 6 || isLoading}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
