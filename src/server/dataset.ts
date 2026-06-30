import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { SelecaoRaw } from "../domain/tipos";

const CAMINHO_DATASET = resolve(process.cwd(), "dataset.json");

const CAMPOS_ESPERADOS = ["id", "selecao", "bandeira", "grupo", "jogos", "v", "e", "d", "gp", "gc"];

/** Lê e valida o dataset.json a cada requisição (arquivo pequeno e mockado). */
export async function carregarDataset(): Promise<SelecaoRaw[]> {
  const conteudo = await readFile(CAMINHO_DATASET, "utf-8");
  const dados = JSON.parse(conteudo);

  if (!Array.isArray(dados)) {
    throw new Error("dataset.json inválido: esperado um array de seleções.");
  }
  for (const item of dados) {
    for (const campo of CAMPOS_ESPERADOS) {
      if (!(campo in item)) {
        throw new Error(`dataset.json inválido: campo "${campo}" ausente em ${JSON.stringify(item)}.`);
      }
    }
  }
  return dados as SelecaoRaw[];
}
