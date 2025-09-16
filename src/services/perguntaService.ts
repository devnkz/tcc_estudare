import { Pergunta, CreatePerguntaData, UpdatePerguntaData } from "../types/pergunta";
import axios from "axios";

// Busca todas as perguntas
export async function fetchPerguntas(): Promise<Pergunta[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pergunta`);
  return res.data;
}

// Busca perguntas com base no id do usuario
export async function fetchPerguntasByIdUser({userId} : {userId: string}): Promise<Pergunta[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pergunta/usuario/${userId}`);
  return res.data;
}

// Cria uma nova pergunta
export async function createPergunta(data: CreatePerguntaData): Promise<Pergunta> {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pergunta`, data);
  return res.data;
}

// Atualiza uma pergunta existente
export async function updatePergunta(data: UpdatePerguntaData): Promise<Pergunta> {
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pergunta/${data.id}`, { pergunta: data.conteudo, fkIdComponente: data.fkIdComponente });
  return res.data;
}

// Deleta uma pergunta pelo id
export async function deletePergunta(id: string, token: string): Promise<void> {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/pergunta/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
