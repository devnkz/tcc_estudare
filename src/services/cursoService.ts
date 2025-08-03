import { Curso, CreateCursoData, UpdateCursoData } from "../types/curso";

// Busca todos os cursos
export async function fetchCursos(): Promise<Curso[]> {
  const res = await fetch("/api/curso");
  if (!res.ok) {
    throw new Error("Erro ao buscar cursos");
  }
  return res.json();
}

// Cria um novo curso
export async function createCurso(data: CreateCursoData): Promise<Curso> {
  const res = await fetch("/api/curso", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar curso");
  }
  return res.json();
}

// Atualiza um curso existente
export async function updateCurso(data: UpdateCursoData): Promise<Curso> {
  const res = await fetch(`/api/curso/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar curso");
  }
  return res.json();
}

// Deleta um curso pelo id
export async function deleteCurso(id: string): Promise<void> {
  const res = await fetch(`/api/curso/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Erro ao deletar curso");
  }
}