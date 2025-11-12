import { CreateGrupoData, Grupo } from "../../types/grupo";
import axios from "axios";
import { getCookie } from "cookies-next";

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

export async function RemoveMemberAndGroup(grupoId: string, membroId: string, token: string): Promise<void> {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/grupo/${grupoId}/membro/${membroId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

// Deleta um grupo pelo id
export async function deleteGrupo(id: string): Promise<void> {
  const token = getCookie("token");
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/grupo/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
