// app/lib/auth.ts

import { cookies } from 'next/headers';

// Agora a função é assíncrona, e o Next.js permite o uso de cookies()
export const getTokenFromCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
};