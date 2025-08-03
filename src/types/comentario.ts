export interface Comentario {
  id: string;
  comentario: string;
  fkIdUsuario: string;
  fkIdResposta: string;
}

export interface CreateComentarioData {
  comentario: string;
  fkIdUsuario: string;
  fkIdResposta: string;
}

export interface UpdateComentarioData {
  id: string;
  comentario: string;
}