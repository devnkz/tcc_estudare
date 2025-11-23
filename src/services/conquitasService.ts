import axios from "axios";
import { Conquista } from "../types/conquista";

export async function fetchConquistasByUsuario({userId} : {userId: string}): Promise<Conquista[]> {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/conquista/user/${userId}`
  );

  return res.data;
}
