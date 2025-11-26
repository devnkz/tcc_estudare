"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { InteractiveHoverButtonSecondary } from "@/components/ui/interactive-hover-button-secondary";

const interbold = Inter({ subsets: ["latin"], weight: ["700"] });
const interregular = Inter({ subsets: ["latin"], weight: ["400"] });

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErro("");

    if (!senha || !confirmar) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/forgot-password/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, novaSenha: senha }),
        }
      );

      if (!res.ok) {
        setErro("Token inválido ou expirado.");
        return;
      }

      setSucesso("Senha redefinida com sucesso!");
      setTimeout(() => router.push("/Auth/Login"), 1500);
    } catch (err) {
      setErro("Erro ao redefinir senha.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-center items-center p-6">
      <main className="w-full max-w-md text-center mx-auto">
        <h1 className={`${interbold.className} text-purple-600 text-5xl mb-4`}>
          Redefinir senha
        </h1>

        {!token && (
          <p className={`${interregular.className} text-red-500 mt-4`}>
            Token inválido. Tente solicitar novamente.
          </p>
        )}

        {token && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-4 text-left"
          >
            <div>
              <label
                className={`${interregular.className} text-sm text-zinc-600`}
              >
                Nova senha
              </label>
              <input
                type="password"
                className="w-full border border-zinc-300 rounded-lg p-3 focus:outline-purple-600"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div>
              <label
                className={`${interregular.className} text-sm text-zinc-600`}
              >
                Confirmar nova senha
              </label>
              <input
                type="password"
                className="w-full border border-zinc-300 rounded-lg p-3 focus:outline-purple-600"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
              />
            </div>

            {erro && <p className="text-red-500 text-sm">{erro}</p>}
            {sucesso && <p className="text-green-600 text-sm">{sucesso}</p>}

            <InteractiveHoverButton
              text="Redefinir senha"
              className="bg-purple-600 text-white border-purple-600 w-full py-4"
            />

            <InteractiveHoverButtonSecondary
              text="Voltar para o login"
              onClick={() => router.push("/login")}
              className="w-full"
            />
          </form>
        )}
      </main>
    </div>
  );
}
