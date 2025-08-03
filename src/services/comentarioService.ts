import { Comentario, CreateComentarioData, UpdateComentarioData } from "@/types/comentario";

// Busca todos os comentários
export async function fetchComentarios(): Promise<Comentario[]> {
  const res = await fetch("/api/comentario");
  if (!res.ok) {
    throw new Error("Erro ao buscar comentários");
  }
  return res.json();
}

// Cria um novo comentário
export async function createComentario(data: CreateComentarioData): Promise<Comentario> {
  const res = await fetch("/api/comentario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar comentário");
  }
  return res.json();
}

// Atualiza um comentário existente
export async function updateComentario(data: UpdateComentarioData): Promise<Comentario> {
  const res = await fetch(`/api/comentario/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conteudo: data.comentario }),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar comentário");
  }
  return res.json();
}

// Deleta um comentário pelo id
export async function deleteComentario(id: string): Promise<void> {
  const res = await fetch(`/api/comentario/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Erro ao deletar comentário");
  }
}