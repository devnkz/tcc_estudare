import { Curso, CreateCursoData, UpdateCursoData } from "../types/curso";
import axios from "axios";

// Busca todos os cursos
export async function fetchCursos(): Promise<Curso[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/curso`);
  return res.data;
}

// Cria um novo curso
export async function createCurso(data: CreateCursoData): Promise<Curso> {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/curso`, data);
  return res.data;
}

// Atualiza um curso existente
export async function updateCurso(data: UpdateCursoData): Promise<Curso> {
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/curso/${data.id}`, data);
  return res.data;
}

// Deleta um curso pelo id
export async function deleteCurso(id: string): Promise<void> {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/curso/${id}`);
}