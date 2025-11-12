import axios from "axios";
import { Grupo, UpdateGrupoData } from "@/types/grupo";

export async function updateGrupo(data: UpdateGrupoData, token: string): Promise<Grupo> {
  const id = (data as any).id ?? (data as any).id_grupo;
  const body: any = {
    nome_grupo: (data as any).nome_grupo,
    novosMembrosIds:
      (data as any).novosMembrosIds ?? (data as any).membrosIds ?? undefined,
  };
  try {
    console.log("Enviando payload:", { id, ...body });
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/grupo/${id}`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    try {
      console.error("Erro ao atualizar grupo:", {
        message: error?.message,
        responseData: error?.response?.data,
        status: error?.response?.status,
        payloadEnviado: body,
      });
    } catch {
      console.error("Erro ao atualizar grupo (fallback):", String(error));
    }
    throw error;
  }
}

