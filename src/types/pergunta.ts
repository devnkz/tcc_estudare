export interface Pergunta {
  id_pergunta: string;
  pergunta: string;
  fkId_usuario?: string;
  fkId_componente?: string;
  dataCriacao_pergunta?: Date;
  usuario:{
    id_usuario: string;
    nome_usuario: string;
    apelido_usuario: string;
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
}

export interface UpdatePerguntaData {
  id_pergunta: string;
  pergunta: string;
}