// src/services/respostaService.ts
import { Resposta, CreateRespostaData, UpdateRespostaData } from "../types/resposta";

// Busca todas as respostas
export async function fetchRespostas(): Promise<Resposta[]> {
  const res = await fetch("/api/resposta");
  if (!res.ok) {
    throw new Error("Erro ao buscar respostas");
  }
  return res.json();
}

// Cria uma nova resposta
export async function createResposta(data: CreateRespostaData): Promise<Resposta> {
  const res = await fetch("/api/resposta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar resposta");
  }
  return res.json();
}

// Atualiza uma resposta existente
export async function updateResposta(data: UpdateRespostaData): Promise<Resposta> {
  const res = await fetch(`/api/resposta/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conteudo: data.resposta }),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar resposta");
  }
  return res.json();
}


// Deleta uma resposta pelo id
export async function deleteResposta(id: string): Promise<void> {
  const res = await fetch(`/api/resposta/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Erro ao deletar resposta");
  }
}