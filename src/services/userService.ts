import { User, CreateUserData, UpdateUserData } from "../types/user";
import axios from "axios";



// Busca todos os usuários
export async function fetchUsers(): Promise<User[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`);
  return res.data;
}

// Busca usuário por id
export async function fetchUsersId(id : string): Promise<User[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`);
  return res.data;
}

// Cria um novo usuário
export async function createUser(data: CreateUserData): Promise<User> {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user`, data);
  return res.data;
}

// Atualiza um usuário existente
export async function updateUser(data: UpdateUserData): Promise<User> {
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/${data.id}`, data);
  return res.data;
}

// Deleta um usuário pelo id
export async function deleteUser(id: string): Promise<void> {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`);
}