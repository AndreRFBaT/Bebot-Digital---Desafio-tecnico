import type { SelecaoRaw } from "./tipos";

/** Vitória = 3 pts, Empate = 1 pt, Derrota = 0 pt. */
export function calcularPontos(s: Pick<SelecaoRaw, "v" | "e">): number {
  return s.v * 3 + s.e;
}

export function calcularSaldo(s: Pick<SelecaoRaw, "gp" | "gc">): number {
  return s.gp - s.gc;
}

/**
 * aproveitamento = pontos / (jogos * 3), no intervalo [0, 1].
 * Decisão: com jogos = 0 não há pontos possíveis, então retornamos 0
 * (evita divisão por zero — ver README).
 */
export function calcularAproveitamento(
  s: Pick<SelecaoRaw, "v" | "e" | "jogos">,
): number {
  if (s.jogos <= 0) return 0;
  return calcularPontos(s) / (s.jogos * 3);
}
