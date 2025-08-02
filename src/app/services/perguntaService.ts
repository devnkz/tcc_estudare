// src/services/perguntaService.ts

export interface Pergunta {
  id: string;
  pergunta: string;
  fkIdUsuario?: string;
  fkIdComponent?: string;
  createdAt?: string;
}

export interface CreatePerguntaData {
  pergunta: string;
  fkIdUsuario: string;
  fkIdComponent: string;
}

export interface UpdatePerguntaData {
  id: string;
  pergunta: string;
}

// Busca todas as perguntas
export async function fetchPerguntas(): Promise<Pergunta[]> {
  const res = await fetch("/api/pergunta");
  if (!res.ok) {
    throw new Error("Erro ao buscar perguntas");
  }
  return res.json();
}

// Cria uma nova pergunta
export async function createPergunta(data: CreatePerguntaData): Promise<Pergunta> {
  const res = await fetch("/api/pergunta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar pergunta");
  }
  return res.json();
}

// Atualiza uma pergunta existente
export async function updatePergunta(data: UpdatePerguntaData): Promise<Pergunta> {
  const res = await fetch(`/api/pergunta/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pergunta: data.pergunta }),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar pergunta");
  }
  return res.json();
}

// Deleta uma pergunta pelo id
export async function deletePergunta(id: string): Promise<void> {
  const res = await fetch(`/api/pergunta/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Erro ao deletar pergunta");
  }
}
