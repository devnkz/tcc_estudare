import { User, CreateUserData, UpdateUserData } from "../types/user";

// Busca todos os usuários
export async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/user");
  if (!res.ok) {
    throw new Error("Erro ao buscar usuários");
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