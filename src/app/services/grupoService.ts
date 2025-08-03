// src/services/grupoService.ts

export interface Grupo {
  id: string;
  nomeGrupo: string;
}

export interface CreateGrupoData {
  nomeGrupo: string;
}

export interface UpdateGrupoData {
  id: string;
  nomeGrupo: string;
}

// Busca todos os grupos
export async function fetchGrupos(): Promise<Grupo[]> {
  const res = await fetch("/api/grupo");
  if (!res.ok) {
    throw new Error("Erro ao buscar grupos");
  }
  return res.json();
}

// Cria um novo grupo
export async function createGrupo(data: CreateGrupoData): Promise<Grupo> {
  const res = await fetch("/api/grupo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar grupo");
  }
  return res.json();
}

// Atualiza um grupo existente
export async function updateGrupo(data: UpdateGrupoData): Promise<Grupo> {
  const res = await fetch(`/api/grupo/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar grupo");
  }
  return res.json();
}

// Deleta um grupo pelo id
export async function deleteGrupo(id: string): Promise<void> {
  const res = await fetch(`/api/grupo/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Erro ao deletar grupo");
  }
}