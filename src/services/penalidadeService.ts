import { CreatePenalidadeData } from "@/types/penalidade";
import axios from "axios";
import { Penalidade } from "../types/penalidade";


export async function createPenalidade(data: CreatePenalidadeData): Promise<Penalidade> {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/penalidade`, data);
  return res.data;
}