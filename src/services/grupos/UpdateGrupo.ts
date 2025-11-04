import axios from "axios";
import { Grupo, UpdateGrupoData } from "@/types/grupo";

export async function updateGrupo(data: UpdateGrupoData, token: string): Promise<Grupo> {
  try {
    console.log("Enviando payload:", data);
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/grupo/${data.id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    console.error("Erro ao atualizar grupo:", {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status,
      payloadEnviado: data,
    });
    throw error;
  }
}

