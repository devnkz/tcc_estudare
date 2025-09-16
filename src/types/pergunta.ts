export interface Pergunta {
  id: string;
  pergunta: string;
  fkIdUsuario?: string;
  fkIdComponente?: string;
  createdAt?: string;
}

export interface CreatePerguntaData {
  conteudo: string;
  userId: string;
  fkIdComponente: string;
}

export interface UpdatePerguntaData {
  id: string;
  conteudo: string;
  fkIdComponente: string;
}