"use client";

import { Inter } from "next/font/google";
import { HeaderDesktopNaoAutenticado } from "../../../../components/layout/header";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { InteractiveHoverButtonSecondary } from "@/components/ui/interactive-hover-button-secondary";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/footer";

const interbold = Inter({ subsets: ["latin"], weight: ["700"] });
const interregular = Inter({ subsets: ["latin"], weight: ["400"] });

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Por favor, insira seu e-mail.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email_usuario: email }),
        }
      );

      console.log("email enviado", email);

      if (!res.ok) {
        setError("Não encontramos uma conta com esse e-mail.");
        setLoading(false);
        return;
      }

      setSent(true);
      setLoading(false);
    } catch (err) {
      setError("Algo deu errado. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-center items-center p-6">
      <main className="w-full max-w-md mx-auto text-center">
        <h1 className={`${interbold.className} text-purple-600 text-5xl mb-4`}>
          Recuperar senha
        </h1>

        {!sent && (
          <p className={`${interregular.className} text-zinc-600 text-lg mb-6`}>
            Digite seu e-mail para enviarmos um código de recuperação.
          </p>
        )}

        {sent && (
          <p className={`${interregular.className} text-zinc-600 text-lg mb-6`}>
            Enviamos um código para seu e-mail. Verifique sua caixa de entrada.
          </p>
        )}

        {!sent && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail"
              className="w-full border border-zinc-300 rounded-xl px-4 py-3 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />

            {error && <span className="text-red-500 text-sm">{error}</span>}

            <InteractiveHoverButton
              text={loading ? "Enviando..." : "Enviar"}
              className="bg-purple-600 text-white border-purple-600 py-4 w-full"
            />
          </form>
        )}
        <InteractiveHoverButtonSecondary
          onClick={() => router.push("/Auth/Login")}
          text="Voltar para login"
          className="w-full mt-6"
        />
      </main>
    </div>
  );
}
