import { User } from "./user";
import { Componente } from "./componente";

export interface Membro {
  id_membro: string;
  grupoId: string;
  userId: string;
  usuario: User;
}

export interface Grupo {
  id_grupo: string;
  nome_grupo: string;
  membros?: Membro[];
  usuario: {
    nome_usuario: string;
  }
  fkId_usuario: string;
  dataCriacao_grupo?: string; // opcional 
}

export interface CreateGrupoData {
  nome_grupo: string;
  membrosIds?: string[];
  createdById: string;
}

export interface UpdateGrupoData {
  id: string;
  nome_grupo?: string;
  fkIdComponente?: string;
  membrosIds?: string[];
  novosMembrosIds?: string[]; // compat com backend
}