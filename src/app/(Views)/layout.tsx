"use client";

import "../globals.css";
import {
  HeaderDesktopAutenticado,
  HeaderDesktopNaoAutenticado,
} from "../../components/layout/header";
import { useEffect, useState } from "react";

export default function RootLayoutViews({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);

  const getCookie = (name: string) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  };

  // Atualiza o token sempre que ele mudar no cookie
  useEffect(() => {
    const interval = setInterval(() => {
      const tokenValue = getCookie("token");
      setToken((prev) => {
        if (prev !== tokenValue) return tokenValue;
        return prev;
      });
    }, 1000); // verifica a cada 1 segundo

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {token ? <HeaderDesktopAutenticado /> : <HeaderDesktopNaoAutenticado />}
      {children}
    </div>
  );
}
