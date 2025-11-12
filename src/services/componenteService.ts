import { Componente, CreateComponenteData, UpdateComponenteData } from "../types/componente";
import axios from "axios";

// Busca todos os componentes
export async function fetchComponentes(): Promise<Componente[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/componente`);
  return res.data;
}

// Busca componentes por curso
export async function fetchComponentesByCurso(cursoId: string): Promise<Componente[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/componente/curso/${cursoId}`);
  return res.data;
}

// Cria um novo componente
export async function createComponente(data: CreateComponenteData): Promise<Componente> {
  // Backend espera nome_componente e fkId_curso
  const payload = { nome_componente: data.nome, fkId_curso: data.fkIdCurso };
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/componente`, payload);
  return res.data;
}

// Atualiza um componente existente
export async function updateComponente(data: UpdateComponenteData): Promise<Componente> {
  const payload: any = { nome_componente: data.nome };
  if (data.fkIdCurso) payload.fkId_curso = data.fkIdCurso;
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/componente/${data.id}`, payload);
  return res.data;
}

// Deleta um componente pelo id
export async function deleteComponente(id: string): Promise<void> {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/componente/${id}`);
}