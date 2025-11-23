export interface Conquista {
  id: string;
  titulo: string;
  descricao: string;
  progressoMax: number;
  progressoAtual?: number;
}

export interface CreateConquistaData {
  titulo: string;
  descricao: string;
  progressoMax: number;
}

export interface UpdateConquistaData {
  id: string;
  titulo: string;
  descricao: string;
  progressoMax: number;
}
