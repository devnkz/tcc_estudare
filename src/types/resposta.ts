export interface Resposta {
  id: string;
  fkIdPergunta: string;
  fkIdUsuario: string;
  resposta: string;
}

export interface CreateRespostaData {
  perguntaId: string;
  userId: string;
  conteudo: string;
}

export interface UpdateRespostaData {
  id: string;
  fkIdPergunta: string;
  fkIdUsuario: string;
  resposta: string;
}