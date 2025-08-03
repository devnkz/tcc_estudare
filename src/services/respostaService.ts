// src/services/respostaService.ts
import { Resposta, CreateRespostaData, UpdateRespostaData } from "../types/resposta";
import axios from "axios";

// Busca todas as respostas
export async function fetchRespostas(): Promise<Resposta[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resposta`);
  return res.data;
}

// Cria uma nova resposta
export async function createResposta(data: CreateRespostaData): Promise<Resposta> {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/resposta`, data);
  return res.data;
}

// Atualiza uma resposta existente
export async function updateResposta(data: UpdateRespostaData): Promise<Resposta> {
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/resposta/${data.id}`, { conteudo: data.resposta });
  return res.data;
}

// Deleta uma resposta pelo id
export async function deleteResposta(id: string): Promise<void> {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/resposta/${id}`);
}