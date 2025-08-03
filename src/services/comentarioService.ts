import { Comentario, CreateComentarioData, UpdateComentarioData } from "@/types/comentario";
import axios from "axios";

// Busca todos os comentários
export async function fetchComentarios(): Promise<Comentario[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comentario`);
  return res.data;
}

// Cria um novo comentário
export async function createComentario(data: CreateComentarioData): Promise<Comentario> {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comentario`, data);
  return res.data;
}

// Atualiza um comentário existente
export async function updateComentario(data: UpdateComentarioData): Promise<Comentario> {
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/comentario/${data.id}`,{ conteudo: data.comentario });
  return res.data;
}

// Deleta um comentário pelo id
export async function deleteComentario(id: string): Promise<void> {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/comentario/${id}`);
}