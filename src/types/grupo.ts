export interface Grupo {
  id: string;
  nomeGrupo: string;
  fkIdComponente?: string;
  membrosIds?: string[];
}

export interface CreateGrupoData {
  nomeGrupo: string;
  fkIdComponente?: string;
  membrosIds?: string[];
}

export interface UpdateGrupoData {
  id: string;
  nomeGrupo: string;
  fkIdComponente?: string;
  membrosIds?: string[];
}