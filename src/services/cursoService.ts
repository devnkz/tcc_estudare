import { Curso, CreateCursoData, UpdateCursoData } from "../types/curso";
import axios from "axios";

// Busca todos os cursos
export async function fetchCursos(): Promise<Curso[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/curso`);
  return res.data;
}

// Cria um novo curso
export async function createCurso(data: CreateCursoData): Promise<Curso> {
  // Backend espera campo nome_curso; converte aqui mantendo tipagem de front
  const payload = { nome_curso: data.nome };
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/curso`, payload);
  return res.data;
}

// Atualiza um curso existente
export async function updateCurso(data: UpdateCursoData): Promise<Curso> {
  const payload = { nome_curso: data.nome };
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/curso/${data.id}`, payload);
  return res.data;
}

// Deleta um curso pelo id
export async function deleteCurso(id: string, force: boolean = false): Promise<{ deletedComponents?: number; deletedQuestions?: number }> {
  const params = force ? { force: "true" } : {};
  const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/curso/${id}`, { params });
  return res.data;
}