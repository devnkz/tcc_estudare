// src/services/userService.ts

export interface User {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  fotoPerfil?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserData {
  nome: string;
  email: string;
  senha: string;
  fotoPerfil?: string;
  bio?: string;
}

export interface UpdateUserData {
  id: string;
  nome?: string;
  email?: string;
  senha?: string;
  fotoPerfil?: string;
  bio?: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

// Busca todos os usuários
export async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/user");
  if (!res.ok) {
    throw new Error("Erro ao buscar usuários");
  }
  return res.json();
}

// Busca um usuário pelo id
export async function fetchUserById(id: string): Promise<User> {
  const res = await fetch(`/api/user/${id}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar usuário");
  }
  return res.json();
}

// Cria um novo usuário
export async function createUser(data: CreateUserData): Promise<User> {
  const res = await fetch("/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar usuário");
  }
  return res.json();
}

// Atualiza um usuário existente
export async function updateUser(data: UpdateUserData): Promise<User> {
  const res = await fetch(`/api/user/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar usuário");
  }
  return res.json();
}

// Deleta um usuário pelo id
export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`/api/user/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Erro ao deletar usuário");
  }
}

// Login de usuário
export async function loginUser(data: LoginData): Promise<{ user: User; token: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erro ao fazer login");
  }
  return res.json();
}

// Logout de usuário
export async function logoutUser(): Promise<void> {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Erro ao fazer logout");
  }
}