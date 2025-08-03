export interface Curso {
  id: string;
  nomeCurso: string;
}

export interface CreateCursoData {
  nomeCurso: string;
}

export interface UpdateCursoData {
  id: string;
  nomeCurso: string;
}