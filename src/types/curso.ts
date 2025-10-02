export interface Curso {
  id_curso: string;
  nome_curso: string;
}

export interface CreateCursoData {
  nome: string;
}

export interface UpdateCursoData {
  id: string;
  nome: string;
}