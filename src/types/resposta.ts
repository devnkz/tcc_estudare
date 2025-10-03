export interface Resposta {
  id_resposta: string;
  fkId_pergunta: string;
  fkId_usuario: string;
  resposta: string;
}

export interface CreateRespostaData {
  fkId_pergunta: string;
  fkId_usuario: string;
  resposta: string;
}

export interface UpdateRespostaData {
  id_resposta: string;
  fkId_pergunta: string;
  fkId_usuario: string;
  resposta: string;
}