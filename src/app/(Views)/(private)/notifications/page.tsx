import NotificacaoPageClient from "./index";
import React from "react";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface JWTPayload {
  id: string;
}

export default async function NotificacaoPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let userId: string | undefined = undefined;

  if (typeof token === "string") {
    const decoded = jwtDecode<JWTPayload>(token);
    userId = decoded.id;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notificacao/user/${userId}`
  );

  const data = await res.json();

  return <NotificacaoPageClient data={data} />;
}
