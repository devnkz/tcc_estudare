export interface Pergunta {
  id_pergunta: string;
  foto_pergunta?: string
  pergunta: string;
  fkId_usuario?: string;
  fkId_componente?: string;
  visibilidade_pergunta: boolean;
  dataCriacao_pergunta?: Date | string;
  dataAtualizacao_pergunta?: Date | string;
  usuario:{
    id_usuario: string;
    nome_usuario: string;
    apelido_usuario: string;
    foto_perfil: string;
  }
  componente: {
    nome_componente: string;
  };
  curso: {
    nome_curso: string;
  }
}

export interface CreatePerguntaData {
  pergunta: string;
  fkId_usuario: string;
  fkId_componente: string;
  fkId_curso: string;
  foto_pergunta?: string
}

export interface UpdatePerguntaData {
  id_pergunta: string;
  pergunta: string;
}