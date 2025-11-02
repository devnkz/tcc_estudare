import React from "react";
import { Inter } from "next/font/google";
import { verify, JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { getTokenFromCookie } from "@/lib/getTokenServer";

import { QueryProvider } from "../providers/QueryProvider";
import { RouteChangeLoader } from "@/components/shared/RouteChangeLoader";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

// Interface opcional para o payload do token
interface DecodedTokenPayload extends JwtPayload {
  id?: string;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getTokenFromCookie();
  let userId: string | null = null;

  if (token) {
    try {
      const decoded = verify(
        token,
        process.env.JWT_SECRET!
      ) as DecodedTokenPayload;

      if (decoded?.id) {
        userId = decoded.id;
      }
    } catch (err: any) {
      // Caso o token esteja expirado ou inválido
      console.error("Erro ao verificar JWT:", err.message);

      // Evita travar o servidor
      if (
        err.name === "TokenExpiredError" ||
        err.name === "JsonWebTokenError"
      ) {
        // Redireciona de volta ao login
        userId = null;
      } else {
        throw err;
      }
    }
  } else {
    // Nenhum token — força login
    userId = null;
  }

  return (
    <html lang="pt-br">
      <body
        className={`${inter.className} w-full flex flex-col justify-center`}
      >
        <RouteChangeLoader />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
