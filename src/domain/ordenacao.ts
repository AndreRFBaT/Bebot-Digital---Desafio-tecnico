import { calcularAproveitamento, calcularSaldo } from "./metricas";
import type { SelecaoRaw } from "./tipos";

/**
 * Ordena por aproveitamento desc. Critérios de desempate, em ordem:
 *   1) saldo de gols (maior primeiro)
 *   2) gols pró (maior primeiro)
 *   3) critério final próprio: nome da seleção em ordem alfabética pt-BR
 *      (ascendente) — escolhido por ser estável e determinístico (ver README).
 */
export function compararSelecoes(a: SelecaoRaw, b: SelecaoRaw): number {
  const aprovA = calcularAproveitamento(a);
  const aprovB = calcularAproveitamento(b);
  if (aprovA !== aprovB) return aprovB - aprovA;

  const saldoA = calcularSaldo(a);
  const saldoB = calcularSaldo(b);
  if (saldoA !== saldoB) return saldoB - saldoA;

  if (a.gp !== b.gp) return b.gp - a.gp;

  return a.selecao.localeCompare(b.selecao, "pt-BR");
}

export function ordenarSelecoes<T extends SelecaoRaw>(selecoes: T[]): T[] {
  return [...selecoes].sort(compararSelecoes);
}
