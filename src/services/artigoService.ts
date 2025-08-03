import { Artigo, CreateArtigoData, UpdateArtigoData } from "../types/artigo";
import axios from "axios";

// Busca todos os artigos
export async function fetchArtigos(): Promise<Artigo[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/artigo`);
  return res.data;
}

// Cria um novo artigo
export async function createArtigo(data: CreateArtigoData): Promise<Artigo> {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/artigo`, data);
  return res.data;
}

// Atualiza um artigo existente
export async function updateArtigo(data: UpdateArtigoData): Promise<Artigo> {
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/artigo/${data.id}`, data);
  return res.data;
}

// Deleta um artigo pelo id
export async function deleteArtigo(id: string): Promise<void> {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/artigo/${id}`);
}