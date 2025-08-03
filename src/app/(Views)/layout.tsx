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
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/Dashboard");

  const getCookie = (name: string) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const tokenValue = getCookie("token");
      setToken((prev) => {
        if (prev !== tokenValue) return tokenValue;
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {!isDashboard &&
        (token ? (
          <HeaderDesktopAutenticado />
        ) : (
          <HeaderDesktopNaoAutenticado />
        ))}
      {children}
    </div>
  );
}
