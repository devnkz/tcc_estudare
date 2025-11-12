"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const getTokenFromCookies = (): string | null => {
    if (typeof document === "undefined") return null;

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    return token ? token.split("=")[1] : null;
  };

  const verifyToken = async () => {
    const token = getTokenFromCookies();
    if (!token) {
      router.push("/Auth/Login");
      return;
    }
    const attempt = async () => {
      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/verifyToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    };
    try {
      let res = await attempt();
      if (!res.ok) {
        // uma segunda tentativa leve em caso de status >=500
        if (res.status >= 500) res = await attempt();
      }
      if (!res.ok) {
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/Auth/Login");
        return;
      }
      setIsLoading(false);
    } catch (e) {
      // erro de rede: mostra fallback sem expulsar imediatamente
      console.warn("Falha de rede ao validar token, tentativa de retry em 1s");
      setTimeout(async () => {
        try {
          const res2 = await attempt();
          if (res2.ok) {
            setIsLoading(false);
            return;
          }
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          router.push("/Auth/Login");
        } catch {
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          router.push("/Auth/Login");
        }
      }, 1000);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
