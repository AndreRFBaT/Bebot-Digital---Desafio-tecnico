import type { SelecaoRaw } from "../domain/tipos";

/** 0.8333 -> "83,3%" (1 casa decimal, vírgula decimal pt-BR). */
export function formatarAproveitamento(valor: number): string {
  return `${(valor * 100).toFixed(1).replace(".", ",")}%`;
}

/** 4 -> "+4", -2 -> "-2", 0 -> "0". */
export function formatarSaldo(saldo: number): string {
  return saldo > 0 ? `+${saldo}` : String(saldo);
}

/** "2-0-0" no formato V-E-D. */
export function formatarVED(s: Pick<SelecaoRaw, "v" | "e" | "d">): string {
  return `${s.v}-${s.e}-${s.d}`;
}
