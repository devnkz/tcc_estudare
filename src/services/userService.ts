import { User, CreateUserData, UpdateUserData } from "../types/user";
import axios from "axios";
import { getCookie } from "cookies-next";

// Busca todos os usuários
export async function fetchUsers(): Promise<User[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`);
  return res.data;
}

// Busca usuário por id
export async function fetchUsersId(id : string | undefined): Promise<User> {
  if (!id) {
    throw new Error("fetchUsersId: id is undefined");
  }
  // Validação de formato: espera UUID (prisma usa uuid())
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error("fetchUsersId: id inválido (formato esperado: UUID)");
  }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`);
  return res.data;
} 

// Cria um novo usuário
export async function createUser(data: CreateUserData): Promise<User> {
  // Backend já usa mesmos nomes (nome_usuario, apelido_usuario, etc.)
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user`, data);
  return res.data;
}

// Cria ou atualiza a foto do usuário
export async function createFotoUser(formData: FormData, id: string): Promise<User> {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}/foto`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Remove a foto do usuário (define null no backend) - assumindo rota DELETE
export async function removeFotoUser(id: string): Promise<User> {
  const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}/foto`);
  return res.data;
}

// Atualiza um usuário existente
export async function updateUser(data: UpdateUserData): Promise<User> {
  const token = getCookie("token");
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/user/${data.id_usuario}`,
    data,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );
  return res.data;
}

// Deleta um usuário pelo id
export async function deleteUser(id: string): Promise<void> {
  const token = getCookie("token");
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    params: { id },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

// Verifica se email já está em uso
export async function checkEmail(email: string): Promise<{ exists: boolean }> {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/check-email`,
    { params: { email } }
  );
  return res.data;
}