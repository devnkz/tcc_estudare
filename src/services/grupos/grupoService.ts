import { Grupo, CreateGrupoData, UpdateGrupoData } from "../types/grupo";
import axios from "axios";

// Busca todos os grupos
export async function fetchGrupos(): Promise<Grupo[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/grupo`);
  return res.data;
}

// Busca grupo por ID
export async function fetchGruposById({ id }: { id: string }): Promise<Grupo> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/grupo/${id}`);
  return res.data;
}

// Cria um novo grupo
export async function createGrupo(data: CreateGrupoData): Promise<Grupo> {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/grupo`, data);
  return res.data;
}

// Atualiza um grupo existente
export async function updateGrupo(data: UpdateGrupoData): Promise<Grupo> {
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/grupo/${data.id}`, data);
  return res.data;
}

// Deleta um grupo pelo id
export async function deleteGrupo(id: string): Promise<void> {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/grupo/${id}`);
}
