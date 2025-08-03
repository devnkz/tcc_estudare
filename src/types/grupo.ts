export interface Grupo {
  id: string;
  nomeGrupo: string;
}

export interface CreateGrupoData {
  nomeGrupo: string;
}

export interface UpdateGrupoData {
  id: string;
  nomeGrupo: string;
}