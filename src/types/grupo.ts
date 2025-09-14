import { User } from "./user";
import { Componente } from "./componente";

interface Membro {
  id: string;
  grupoId: string;
  userId: string;
  user: User;
}

export interface Grupo {
  id: string;
  nomeGrupo: string;
  fkIdComponente?: string;
  membros?: Membro[];
  componente?: Componente;
  createdBy: {
    name: string;
  }
  createdById: string;
}

export interface CreateGrupoData {
  nomeGrupo: string;
  fkIdComponente?: string;
  membrosIds?: string[];
  createdById: string;
}

export interface UpdateGrupoData {
  id: string;
  nomeGrupo?: string;
  fkIdComponente?: string;
  membrosIds?: string[];
}