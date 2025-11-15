export interface User {
  id_usuario: string;
  nome_usuario: string;
  email_usuario: string;
  senha_usuario: string;
  apelido_usuario: string;
  foto_perfil?: string;
  fkIdTipoUsuario: string;
  dataCriacao_usuario: string;
  credibilidade_usuario: number;

  tipoUsuario?: {
    id_tipousuario: string;
    nome_tipousuario: string;
  };

  ultimaAlteracao_apelido?: string;

  Penalidades: {
    id_penalidade: string;
    dataInicio_penalidade: string;
    dataFim_penalidade: string;
    descricao: string;
    perder_credibilidade: number;
    ativa: boolean;
    denuncia: {
      id_denuncia: string;
      fkId_conteudo_denunciado: string;
      tipo_conteudo: string;
    };
  }[];
}

export interface CreateUserData {
  nome_usuario: string;
  email_usuario: string;
  senha_usuario: string;
  apelido_usuario: string;
  foto_perfil?: string;
  fkIdTipoUsuario: string;
}

export interface UpdateUserData {
  id_usuario: string;
  nome_usuario: string;
  email_usuario: string;
  senha_usuario: string;
  apelido_usuario: string;
  foto_perfil?: string;
  fkIdTipoUsuario: string;
}