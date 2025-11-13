"use client";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { SidebarDashboard } from "@/components/layout/sidebarDashboard";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export default function RootLayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [createKey, setCreateKey] = useState<
    null | "curso" | "componente" | "usuario"
  >(null);
  const [auditNonce, setAuditNonce] = useState<number>(0);

  return (
    <div className={`${inter.className} w-full min-h-screen overflow-x-hidden`}>
      <SidebarDashboard
        onCreateCurso={() => setCreateKey("curso")}
        onCreateComponente={() => setCreateKey("componente")}
        onCreateUsuario={() => setCreateKey("usuario")}
        onOpenAudit={() => setAuditNonce((n) => n + 1)}
      />
      <main className="md:ml-[68px] min-h-screen overflow-x-hidden pt-6 px-6 md:px-8 lg:px-12 xl:px-16 pb-10 md:mr-6 lg:mr-8 xl:mr-12">
        {/* Propaga sinal de criação via data-atributo em um wrapper conhecido */}
        <div
          id="dashboard-root-wrapper"
          data-create-key={createKey || ""}
          data-open-audit={auditNonce || ""}
          className="max-w-[1600px]"
        >
          {children}
        </div>
      </main>
    </div>
  );
}
