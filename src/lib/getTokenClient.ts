// app/lib/getTokenClient.ts
// Este arquivo deve ser 'use client'

"use client";

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

export function useToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Executa apenas uma vez após montagem
    const cookieToken = getCookie("token");
    setToken((cookieToken as string) ?? null);
    setIsReady(true);
  }, []);
  
  return { token, isReady };
}