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