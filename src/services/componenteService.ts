import { Componente, CreateComponenteData, UpdateComponenteData } from "../types/componente";

// Busca todos os componentes
export async function fetchComponentes(): Promise<Componente[]> {
  const res = await fetch("/api/componente");
  if (!res.ok) {
    throw new Error("Erro ao buscar componentes");
  }
  return res.json();
}

// Busca componentes por curso
export async function fetchComponentesByCurso(cursoId: string): Promise<Componente[]> {
  const res = await fetch(`/api/componente/curso/${cursoId}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar componentes do curso");
  }
  return res.json();
}

// Cria um novo componente
export async function createComponente(data: CreateComponenteData): Promise<Componente> {
  const res = await fetch("/api/componente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar componente");
  }
  return res.json();
}

// Atualiza um componente existente
export async function updateComponente(data: UpdateComponenteData): Promise<Componente> {
  const res = await fetch(`/api/componente/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar componente");
  }
  return res.json();
}

// Deleta um componente pelo id
export async function deleteComponente(id: string): Promise<void> {
  const res = await fetch(`/api/componente/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Erro ao deletar componente");
  }
}