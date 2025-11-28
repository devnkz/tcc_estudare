export async function ocultarPergunta(id_pergunta: string, token: string): Promise<boolean>  {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pergunta/${id_pergunta}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ visibilidade_pergunta: false }),
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao atualizar visibilidade.");
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }