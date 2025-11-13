"use client";

import "../globals.css";
import {
  HeaderDesktopAutenticado,
  HeaderDesktopNaoAutenticado,
} from "../../components/layout/header";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RootLayoutViews({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  const getCookie = (name: string) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  };

  const decodeJWT = (token: string) => {
    if (!token) return null;

    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return null;

    const decodeBase64Url = (str: string) => {
      str = str.replace(/-/g, "+").replace(/_/g, "/");
      while (str.length % 4) str += "=";
      try {
        return JSON.parse(atob(str));
      } catch {
        return null;
      }
    };

    return {
      header: decodeBase64Url(header),
      payload: decodeBase64Url(payload),
      signature,
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const tokenValue = getCookie("token");
      setToken((prev) => {
        if (prev !== tokenValue) {
          if (tokenValue) {
            setDecodedToken(decodeJWT(tokenValue));
          } else {
            setDecodedToken(null);
          }
          return tokenValue;
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {!isDashboard &&
        (token ? (
          <HeaderDesktopAutenticado
            tipo_usuario={decodedToken?.payload?.tipo_usuario || ""}
          />
        ) : (
          <HeaderDesktopNaoAutenticado />
        ))}
      {children}
    </div>
  );
}
