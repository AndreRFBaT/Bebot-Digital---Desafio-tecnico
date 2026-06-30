export type StatusClassificacao = "Classificada" | "Em disputa" | "Eliminada";

/** Seleção como vem no dataset.json (dados brutos). */
export interface SelecaoRaw {
  id: string;
  selecao: string;
  bandeira: string;
  grupo: string;
  jogos: number;
  v: number;
  e: number;
  d: number;
  gp: number;
  gc: number;
}

/** Seleção após aplicar as regras de negócio. */
export interface SelecaoCalculada extends SelecaoRaw {
  /** Posição no ranking global por aproveitamento (1 = melhor). */
  posicao: number;
  pontos: number;
  /** Saldo de gols (gp - gc). */
  saldo: number;
  /** Aproveitamento entre 0 e 1 (pontos / jogos*3). */
  aproveitamento: number;
  status: StatusClassificacao;
}

export const TOTAL_RODADAS = 3;
export const VAGAS_POR_GRUPO = 2;
