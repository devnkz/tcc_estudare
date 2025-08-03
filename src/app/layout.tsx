import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Estudare",
  description:
    "Estudare é uma plataforma para gerenciamento de estudos, organização de tarefas acadêmicas e acompanhamento do progresso educacional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${inter.className} w-full flex flex-col justify-center`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
