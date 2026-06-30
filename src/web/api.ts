import type { SelecaoCalculada } from "../domain/tipos";

async function buscarJson<T>(url: string): Promise<T> {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    throw new Error(corpo?.erro ?? `Falha ao buscar ${url} (HTTP ${resposta.status}).`);
  }
  return resposta.json() as Promise<T>;
}

export function buscarSelecoes(): Promise<SelecaoCalculada[]> {
  return buscarJson<SelecaoCalculada[]>("/api/copa/selecoes");
}

export function buscarTop5(): Promise<SelecaoCalculada[]> {
  return buscarJson<SelecaoCalculada[]>("/api/copa/top5");
}
