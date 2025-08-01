import type { Metadata } from "next";
import "./globals.css";
import {
  HeaderDesktopAutenticado,
  HeaderDesktopNaoAutenticado,
} from "./components/Header";

import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Estudare",
  description:
    "Estudare é uma plataforma para gerenciamento de estudos, organização de tarefas acadêmicas e acompanhamento do progresso educacional.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return (
    <html lang="pt-br">
      <body className="w-full flex flex-col items-center">
        {!token ? (
          <HeaderDesktopNaoAutenticado />
        ) : (
          <HeaderDesktopAutenticado />
        )}
        {children}
      </body>
    </html>
  );
}
