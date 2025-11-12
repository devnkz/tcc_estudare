import words from "./badWordsPT.json";

export type ResultadoAnalise = {
  textoOriginal: string;
  textoFiltrado: string;
  contemPalavraOfensiva: boolean;
};

const palavras: string[] = [...(words as any).words];
// Pré-normaliza a lista de palavrões e usa Set para comparação rápida
const palavrasNormalizadas = palavras.map((p) => normalizarTexto(p));
const setPalavroes = new Set(palavrasNormalizadas);

function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[@4]/g, "a")
    .replace(/3/g, "e")
    .replace(/[1!]/g, "i")
    .replace(/0/g, "o")
    .replace(/\$/g, "s")
    .replace(/(\w)\1{2,}/g, "$1");
}

function tokenizar(textoNormalizado: string): string[] {
  // Depois de normalizar para ascii, usamos apenas letras/números
  return textoNormalizado.match(/[a-z0-9]+/g) || [];
}

export function filtrarTexto(texto: string): ResultadoAnalise {
  const textoNormalizado = normalizarTexto(texto || "");
  // Evita falso positivo por substring: avalia por tokens (palavras) normalizadas
  const tokens = tokenizar(textoNormalizado);
  const contemPalavraOfensiva = tokens.some((tk) => setPalavroes.has(tk));

  let textoFiltrado = texto;
  if (contemPalavraOfensiva) {
    // Substitui apenas palavras inteiras consideradas ofensivas (após normalização)
    textoFiltrado = (texto || "").replace(/\b(\w+)\b/g, (palavra) =>
      setPalavroes.has(normalizarTexto(palavra)) ? "*****" : palavra
    );
  }
  return { textoOriginal: texto, textoFiltrado, contemPalavraOfensiva };
}

export function validarTextoOuErro(texto: string): ResultadoAnalise {
  const resultado = filtrarTexto(texto);
  if (resultado.contemPalavraOfensiva) {
    throw new Error(
      "Conteúdo impróprio detectado. Remova palavras ofensivas antes de enviar."
    );
  }
  return resultado;
}
