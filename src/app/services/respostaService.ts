// src/services/respostaService.ts

export interface Resposta {
  id: string;
  conteudo: string;
  fkIdUsuario: string;
  fkIdPergunta: string;
  isAceita?: boolean;
  votos?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRespostaData {
  conteudo: string;
  fkIdUsuario: string;
  fkIdPergunta: string;
}

export interface UpdateRespostaData {
  id: string;
  conteudo: string;
}

// Busca todas as respostas
export async function fetchRespostas(): Promise<Resposta[]> {
  const res = await fetch("/api/resposta");
  if (!res.ok) {
    throw new Error("Erro ao buscar respostas");
  }
  return res.json();
}

// Busca uma resposta pelo id
export async function fetchRespostaById(id: string): Promise<Resposta> {
  const res = await fetch(`/api/resposta/${id}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar resposta");
  }
  return res.json();
}

// Busca respostas por pergunta
export async function fetchRespostasByPergunta(perguntaId: string): Promise<Resposta[]> {
  const res = await fetch(`/api/resposta/pergunta/${perguntaId}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar respostas da pergunta");
  }
  return res.json();
}

// Busca respostas por usuário
export async function fetchRespostasByUsuario(usuarioId: string): Promise<Resposta[]> {
  const res = await fetch(`/api/resposta/usuario/${usuarioId}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar respostas do usuário");
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
    body: JSON.stringify({ conteudo: data.conteudo }),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar resposta");
  }
  return res.json();
}

// Marca uma resposta como aceita
export async function aceitaResposta(id: string): Promise<Resposta> {
  const res = await fetch(`/api/resposta/${id}/aceitar`, {
    method: "PUT",
  });
  if (!res.ok) {
    throw new Error("Erro ao aceitar resposta");
  }
  return res.json();
}

// Vota em uma resposta (positivo ou negativo)
export async function votaResposta(id: string, tipo: 'up' | 'down'): Promise<Resposta> {
  const res = await fetch(`/api/resposta/${id}/voto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo }),
  });
  if (!res.ok) {
    throw new Error("Erro ao votar na resposta");
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