"use client";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/animatedToast";
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
    <ToastProvider>
      <div className={`${inter.className} w-full flex justify-center`}>
        <div className="w-full max-w-7xl flex">
          <SidebarDashboard
            onCreateCurso={() => setCreateKey("curso")}
            onCreateComponente={() => setCreateKey("componente")}
            onCreateUsuario={() => setCreateKey("usuario")}
            onOpenAudit={() => setAuditNonce((n) => n + 1)}
          />
          <main className="flex-1 min-h-screen px-4 md:px-6 py-4">
            {/* Propaga sinal de criação via data-atributo em um wrapper conhecido */}
            <div
              id="dashboard-root-wrapper"
              data-create-key={createKey || ""}
              data-open-audit={auditNonce || ""}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
