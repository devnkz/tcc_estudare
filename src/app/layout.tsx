// app/layout.tsx

import React from "react";
import { Inter } from "next/font/google";
import { verify } from "jsonwebtoken";
import { getTokenFromCookie } from "@/lib/getTokenServer";

import { QueryProvider } from "../providers/QueryProvider";
import { RouteChangeLoader } from "@/components/shared/RouteChangeLoader";

import "./globals.css";

// Definimos a interface do payload para garantir que ele tenha a propriedade 'id'
interface DecodedTokenPayload {
  id: string;
}

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Await é crucial para que a promessa seja resolvida.
  // get token from a server action.
  const token = await getTokenFromCookie();

  let id: string | null = null;

  if (token) {
    // Usamos a tipagem genérica para garantir que o resultado decodificado
    // tenha a estrutura que esperamos.
    const decoded = verify(
      token,
      process.env.JWT_SECRET!
    ) as DecodedTokenPayload;

    // Verificamos se 'id' existe no objeto decodificado antes de atribuir
    if (decoded.id) {
      id = decoded.id;
    }
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
