"use client";

import Footer from "@/components/layout/footer";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/16/solid";
import { Input } from "../../../../../components/ui/input";
import {
  BotoesFormulario,
  MensagemRedirecionamento,
} from "../../../../../components/ui/button";
import { HeaderLoginCadastro } from "../../../../../components/layout/header";
import { useState } from "react";

export default function CadastroUsuario() {
  const [form, setForm] = useState({
    name: "",
    apelido: "",
    email: "",
    senha: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const login = async () => {
    event?.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  return (
    <div className="bg-white w-full p-4 flex flex-col justify-between items-center">
      <HeaderLoginCadastro />

      <main className="w-full lg:max-w-[1200px] flex flex-col items-center justify-center gap-4">
        <form
          onSubmit={login}
          className="flex flex-col gap-4 p-8 rounded w-full md:w-2/4 text-black"
        >
          <Input
            label="Nome"
            placeholder="Digite seu nome"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <Input
            label="Apelido"
            placeholder="Digite seu apelido"
            value={form.apelido}
            onChange={(e) => handleChange("apelido", e.target.value)}
          />

          <Input
            type="email"
            icon={EnvelopeIcon}
            placeholder="Digite seu email"
            label="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <Input
            type="password"
            icon={LockClosedIcon}
            podeMostrarSenha
            placeholder="Digite sua senha"
            label="Senha"
            value={form.senha}
            onChange={(e) => handleChange("senha", e.target.value)}
          />

          <BotoesFormulario textButton="Cadastrar-se" />

          <MensagemRedirecionamento
            pergunta="Já possui uma conta?"
            textButton="Entrar agora"
            rotaRedirecionamento="/Auth/Login"
          />
        </form>
      </main>
      <Footer />
    </div>
  );
}
