// app/lib/getTokenClient.ts
// Este arquivo deve ser 'use client'

"use client";

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

export function useToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Esta função será executada após CADA renderização
    const cookieToken = getCookie("token");
    setToken(cookieToken as string);
    setIsReady(true);
  }); // Sem array de dependências aqui

  return { token, isReady };
}