export interface Artigo {
  id: string;
  nomeArtigo: string;
  textoArtigo: string;
  fkIdComponente: string;
}

export interface CreateArtigoData {
  nomeArtigo: string;
  textoArtigo: string;
  fkIdComponente: string;
}

export interface UpdateArtigoData {
  id: string;
  nomeArtigo: string;
  textoArtigo: string;
  fkIdComponente: string;
}