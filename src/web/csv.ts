import type { SelecaoCalculada } from "../domain/tipos";
import { formatarAproveitamento, formatarSaldo } from "./formato";

const CABECALHOS = [
  "Posição",
  "Bandeira",
  "Seleção",
  "Grupo",
  "Jogos",
  "Vitórias",
  "Empates",
  "Derrotas",
  "Saldo de gols",
  "Pontos",
  "Aproveitamento",
  "Status",
];

const SEPARADOR = ";";

function celula(valor: string | number): string {
  const texto = String(valor);
  // Protege valores que contenham o separador, aspas ou quebra de linha.
  if (/[";\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

/**
 * Gera o conteúdo CSV das seleções.
 * Decisões para abrir corretamente no Excel pt-BR (ver README):
 *  - separador ";" (Excel pt-BR usa vírgula como separador decimal);
 *  - aproveitamento com vírgula decimal ("83,3%");
 *  - BOM UTF-8 no início para preservar acentos e emojis.
 */
export function gerarCsv(selecoes: SelecaoCalculada[]): string {
  const linhas = selecoes.map((s) =>
    [
      s.posicao,
      s.bandeira,
      s.selecao,
      s.grupo,
      s.jogos,
      s.v,
      s.e,
      s.d,
      formatarSaldo(s.saldo),
      s.pontos,
      formatarAproveitamento(s.aproveitamento),
      s.status,
    ]
      .map(celula)
      .join(SEPARADOR),
  );

  const conteudo = [CABECALHOS.join(SEPARADOR), ...linhas].join("\r\n");
  return `\uFEFF${conteudo}`;
}

/** Dispara o download do CSV no navegador. */
export function baixarCsv(selecoes: SelecaoCalculada[], nomeArquivo = "termometro-copa-2026.csv"): void {
  const blob = new Blob([gerarCsv(selecoes)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
