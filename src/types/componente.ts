export interface Componente {
  id: string;
  nome: string;
  fkIdCurso: string;
}

export interface CreateComponenteData {
  nome: string;
  fkIdCurso: string;
}

export interface UpdateComponenteData {
  id: string;
  nome: string;
  fkIdCurso?: string;
}

export interface UpdateComponenteOrdemData {
  id: string;
  ordem: number;
}