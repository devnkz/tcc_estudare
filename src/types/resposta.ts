export interface Resposta {
  id_resposta: string;
  fkId_pergunta: string;
  fkId_usuario: string;
  resposta: string;
  dataCriacao_resposta?: Date | string;
  dataAtualizacao_resposta?: Date | string;
  usuario?: {
    id_usuario: string;
    nome_usuario: string;
    apelido_usuario: string;
    foto_perfil?: string;
  };
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