import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estudare",
  description: "Estudare é uma plataforma para gerenciamento de estudos, organização de tarefas acadêmicas e acompanhamento do progresso educacional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
      >
        {children}
      </body>
    </html>
  );
}
