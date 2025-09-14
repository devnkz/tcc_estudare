import axios from "axios";

export async function LeaveGroup(grupoId: string, token: string): Promise<void> {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/grupo/${grupoId}/sair`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}