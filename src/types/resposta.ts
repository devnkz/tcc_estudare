export interface Resposta {
  id: string;
  fkIdPergunta: string;
  fkIdUsuario: string;
  resposta: string;
}

export interface CreateRespostaData {
  fkIdPergunta: string;
  fkIdUsuario: string;
  resposta: string;
}

export interface UpdateRespostaData {
  id: string;
  fkIdPergunta: string;
  fkIdUsuario: string;
  resposta: string;
}