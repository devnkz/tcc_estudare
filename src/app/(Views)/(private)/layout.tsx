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

    // Se não há token, redireciona para login
    if (!token) {
      router.push("/Auth/Login");
      return;
    }

    // Verifica o token no servidor
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verifyToken`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      if (!res.ok) {
        // Token inválido no servidor
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/Auth/Login");
        return;
      }

      console.log("Token verificado com sucesso");
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      // Remove o token em caso de erro
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/Auth/Login");
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
