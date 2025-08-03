import { Artigo, CreateArtigoData, UpdateArtigoData } from "../types/artigo";

// Busca todos os artigos
export async function fetchArtigos(): Promise<Artigo[]> {
  const res = await fetch("/api/artigo");
  if (!res.ok) {
    throw new Error("Erro ao buscar artigos");
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