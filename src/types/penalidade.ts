export interface CreatePenalidadeData {
  fkId_usuario: string;
  fkId_denuncia: string;
  fkId_usuario_conteudo: string;
  dataInicio_penalidade: Date | string;
  dataFim_penalidade: Date | string;
  perder_credibilidade: number;
  descricao: string;
}

export interface Penalidade extends CreatePenalidadeData {
  id_penalidade: string;
}