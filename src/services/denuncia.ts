import axios from "axios";
import { Denuncia, CreateDenunciaData } from "../types/denuncia";

type UpdateDenunciaPayload = {
  fkId_usuario?: string;
  fkId_conteudo_denunciado?: string;
  nivel_denuncia?: number;
  status?: string;
  resultado?: string;
};

// Busca todas as denúncias
export async function fetchDenuncias(): Promise<Denuncia[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/denuncia`);
  console.log(res.data);
  return res.data;
}

// Cria uma nova denúncia
export async function createDenuncia(data: CreateDenunciaData): Promise<Denuncia> {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/denuncia`, data);
  return res.data;
}

// Deleta uma denúncia pelo id
export async function deleteDenuncia(id: string, token: string): Promise<void> {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/denuncia/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Atualiza denúncia (status/resultado, etc.)
export async function updateDenuncia(
  id: string,
  data: Partial<UpdateDenunciaPayload>
): Promise<Denuncia> {
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/denuncia/${id}`, data);
  return res.data;
}
