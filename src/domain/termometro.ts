import { calcularAproveitamento, calcularPontos, calcularSaldo } from "./metricas";
import { ordenarSelecoes } from "./ordenacao";
import { calcularStatus } from "./status";
import type { SelecaoCalculada, SelecaoRaw } from "./tipos";

/**
 * Aplica todas as regras de negócio sobre o dataset bruto e devolve a lista
 * completa, já ordenada por aproveitamento (com desempates) e com posição,
 * pontos, saldo, aproveitamento e status preenchidos.
 */
export function calcularSelecoes(dataset: SelecaoRaw[]): SelecaoCalculada[] {
  const status = calcularStatus(dataset);
  const ordenadas = ordenarSelecoes(dataset);

  return ordenadas.map((s, indice) => ({
    ...s,
    posicao: indice + 1,
    pontos: calcularPontos(s),
    saldo: calcularSaldo(s),
    aproveitamento: calcularAproveitamento(s),
    status: status.get(s.id) ?? "Em disputa",
  }));
}

/** Top 5 seleções por aproveitamento. */
export function calcularTop5(dataset: SelecaoRaw[]): SelecaoCalculada[] {
  return calcularSelecoes(dataset).slice(0, 5);
}
