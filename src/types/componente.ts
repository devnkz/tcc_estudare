export interface Componente {
  id: string;
  nomeComponente: string;
  fkIdCurso: string;
}

export interface CreateComponenteData {
  nomeComponente: string;
  fkIdCurso: string;
}

export interface UpdateComponenteData {
  id: string;
  nomeComponente: string;
  fkIdCurso?: string;
}

export interface UpdateComponenteOrdemData {
  id: string;
  ordem: number;
}