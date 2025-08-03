import { Pergunta, CreatePerguntaData, UpdatePerguntaData } from "../types/pergunta";
import axios from "axios";

// Busca todas as perguntas
export async function fetchPerguntas(): Promise<Pergunta[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pergunta`);
  return res.data;
}

// Cria uma nova pergunta
export async function createPergunta(data: CreatePerguntaData): Promise<Pergunta> {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pergunta`, data);
  return res.data;
}

// Atualiza uma pergunta existente
export async function updatePergunta(data: UpdatePerguntaData): Promise<Pergunta> {
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pergunta/${data.id}`, { pergunta: data.pergunta });
  return res.data;
}

// Deleta uma pergunta pelo id
export async function deletePergunta(id: string): Promise<void> {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/pergunta/${id}`);
}
