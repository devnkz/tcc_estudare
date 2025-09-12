export interface Curso {
  id: string;
  nome: string;
}

export interface CreateCursoData {
  nome: string;
}

export interface UpdateCursoData {
  id: string;
  nome: string;
}