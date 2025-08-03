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