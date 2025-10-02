import { cookies } from "next/headers";
import { Grupo } from "../../types/grupo";
import axios from "axios";

// Busca todos os grupos do usuário logado
export async function fetchGruposByUser(): Promise<Grupo[]> {
   const cookieStore = cookies(); // Server Component
   const token = (await cookieStore).get("token")?.value; // pega o valor do token
   console.log(token)

   if (!token) {
    throw new Error("Token não encontrado. Usuário não autenticado.");
  }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/grupo/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}