export interface User {
  id: string;
  name: string;
  email: string;
  senha: string;
  apelido: string;
  fotoPerfil?: string;
  fkIdTipoUsuario: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  senha: string;
  apelido: string;
  fotoPerfil?: string;
  fkIdTipoUsuario: string;
}

export interface UpdateUserData {
  id: string;
  name: string;
  email: string;
  senha: string;
  apelido: string;
  fotoPerfil?: string;
  fkIdTipoUsuario: string;
}