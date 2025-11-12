import axios from "axios";

export interface CreateNotificacaoData {
  fkId_usuario: string;
  titulo: string;
  mensagem: string;
  tipo: string; // e.g., "denuncia"
}

export async function createNotificacao(data: CreateNotificacaoData) {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notificacao`, data);
  return res.data;
}

export async function listNotificacoesByUser(userId: string) {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notificacao/user/${userId}`);
  return res.data;
}
