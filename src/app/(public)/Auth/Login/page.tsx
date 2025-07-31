"use client";

import Footer from "@/app/components/Footer";
import { Inter } from "next/font/google";
import {
  BotoesFormulario,
  MensagemRedirecionamento,
} from "../components/button";
import { Input } from "../components/input";
import { HeaderLoginCadastro } from "../components/header";
import { LockClosedIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export default function LoginUsuario() {
  const [form, setForm] = useState({
    email: "",
    senha: "",
  });
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const login = async () => {
    event?.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Salvar o token nos cookies
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
        
        // Redirecionar para o dashboard após login
        router.push("/Dashboard");
      }
    } catch (error) {
      console.error("Erro ao logar usuário:", error);
    }
  };

  return (
    <div
      className={`${inter.className} bg-white w-full h-screen p-4 flex flex-col justify-between items-center`}
    >
      <HeaderLoginCadastro />
      <main className="w-full lg:max-w-[1200px] flex flex-col items-center justify-center gap-4">
        <form
          onSubmit={login}
          className="flex flex-col gap-4 p-8 rounded w-full md:w-2/4 text-black"
        >
          <Input
            label="Email"
            placeholder="Digite seu email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            icon={LockClosedIcon}
            podeMostrarSenha
            value={form.senha}
            onChange={(e) => handleChange("senha", e.target.value)}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="lembrar"
                className="accent-purple-600"
              />
              <span className="text-sm">Lembre de mim</span>
            </label>
            <button
              type="button"
              className="text-purple-600 text-sm hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>

          <BotoesFormulario textButton="Entrar" />

          <MensagemRedirecionamento
            pergunta="Ainda não tem uma conta ?"
            textButton="Criar agora"
            rotaRedirecionamento="/Auth/Register"
          />
        </form>
      </main>
      <Footer />
    </div>
  );
}
