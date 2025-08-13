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
import { HeaderLoginCadastro } from "../../../../../components/layout/header";
import { useState } from "react";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function CadastroUsuario() {
  const [form, setForm] = useState({
    name: "",
    apelido: "",
    email: "",
    senha: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const login = async (event?: React.FormEvent) => {
    event?.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Usuário cadastrado com sucesso:", data);
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  };
  // Função para calcular força da senha
  const getPasswordStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = getPasswordStrength(form.senha);
  const totalSegments = 4;

  const getStrengthColor = (index: number) => {
    if (index >= strength) return "bg-gray-200";
    if (strength <= 2) return "bg-purple-300";
    if (strength === 3) return "bg-purple-400";
    if (strength === 4) return "bg-purple-500";
    return "bg-purple-600";
  };

  return (
    <div
      className={`${inter.className} min-h-screen flex flex-col bg-white w-full`}
    >
      <div className="w-full lg:max-w-[1300px] mx-auto flex-1 flex flex-col">
        <HeaderLoginCadastro />

        <main className="flex-1 flex flex-col items-center justify-center px-2 mt-5 mb-29">
          <form
            onSubmit={login}
            className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100 flex flex-col gap-5"
          >
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
                />
              </div>
            </div>

            {/* Apelido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apelido
              </label>
              <div className="relative">
                <UserCircleIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Digite seu apelido"
                  value={form.apelido}
                  onChange={(e) => handleChange("apelido", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Digite seu email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
                />
              </div>
            </div>

            {/* Senha com olhinho */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <LockClosedIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={form.senha}
                  onChange={(e) => handleChange("senha", e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 outline-none"
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
              className="w-full bg-purple-600 hover:bg-purple-700 transition-all text-white font-semibold py-3 rounded-lg shadow-md cursor-pointer"
            >
              Cadastrar-se
            </button>

            {/* Mensagem de redirecionamento */}
            <p className="text-center text-sm text-gray-600">
              Já possui uma conta?{" "}
              <Link
                href="Auth/Login"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Entrar agora
              </Link>
            </p>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}
