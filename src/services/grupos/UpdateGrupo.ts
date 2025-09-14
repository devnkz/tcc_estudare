// Atualiza um grupo existente

import { Grupo, UpdateGrupoData } from "../../types/grupo";
import axios from "axios";

export async function updateGrupo(data: UpdateGrupoData, token : string): Promise<Grupo> {
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/grupo/${data.id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}