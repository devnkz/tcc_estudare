import React from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import UserProviderWrapper from "../providers/UserWrapperProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let id: string | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };
      id = decoded.id;
    } catch {}
  }

  console.log("ID do usuário decodificado:", id);

  return (
    <html lang="pt-br">
      <body
        className={`${inter.className} w-full flex flex-col justify-center`}
      >
        <QueryProvider>
          {/* Componente Client para popular o contexto */}
          <UserProviderWrapper userId={id}>{children}</UserProviderWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
