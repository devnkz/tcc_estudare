// src/services/artigoService.ts

export interface Artigo {
  id: string;
  titulo: string;
  conteudo: string;
  fkIdUsuario: string;
  fkIdMateria?: string;
  imagem?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateArtigoData {
  titulo: string;
  conteudo: string;
  fkIdUsuario: string;
  fkIdMateria?: string;
  imagem?: string;
}

export interface UpdateArtigoData {
  id: string;
  titulo?: string;
  conteudo?: string;
  fkIdMateria?: string;
  imagem?: string;
}

// Busca todos os artigos
export async function fetchArtigos(): Promise<Artigo[]> {
  const res = await fetch("/api/artigo");
  if (!res.ok) {
    throw new Error("Erro ao buscar artigos");
  }
  return res.json();
}

// Busca um artigo pelo id
export async function fetchArtigoById(id: string): Promise<Artigo> {
  const res = await fetch(`/api/artigo/${id}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar artigo");
  }
  return res.json();
}

// Busca artigos por usuário
export async function fetchArtigosByUsuario(usuarioId: string): Promise<Artigo[]> {
  const res = await fetch(`/api/artigo/usuario/${usuarioId}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar artigos do usuário");
  }
  return res.json();
}

// Busca artigos por matéria
export async function fetchArtigosByMateria(materiaId: string): Promise<Artigo[]> {
  const res = await fetch(`/api/artigo/materia/${materiaId}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar artigos da matéria");
  }
  return res.json();
}

// Cria um novo artigo
export async function createArtigo(data: CreateArtigoData): Promise<Artigo> {
  const res = await fetch("/api/artigo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar artigo");
  }
  return res.json();
}

// Atualiza um artigo existente
export async function updateArtigo(data: UpdateArtigoData): Promise<Artigo> {
  const res = await fetch(`/api/artigo/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar artigo");
  }
  return res.json();
}

// Deleta um artigo pelo id
export async function deleteArtigo(id: string): Promise<void> {
  const res = await fetch(`/api/artigo/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Erro ao deletar artigo");
  }
}