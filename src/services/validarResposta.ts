export async function validarResposta(
  token: string,
  id_usuario_validador: string,
  id_resposta: string,
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/validar-resposta/${id_resposta}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({id_usuario_validador}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || "Erro ao validar resposta.");
    }

    return {
      sucesso: true,
      data,
    };

  } catch (error: any) {
    console.error("Erro ao validar resposta:", error.message);

    return {
      sucesso: false,
      erro: error.message,
    };
  }
}
