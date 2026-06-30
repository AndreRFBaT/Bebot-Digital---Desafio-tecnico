import { calcularPontos } from "./metricas";
import { SelecaoRaw, StatusClassificacao, TOTAL_RODADAS, VAGAS_POR_GRUPO } from "./tipos";

interface Projecao {
  id: string;
  /** Pior cenário: perde todos os jogos restantes => pontos atuais. */
  pontosMin: number;
  /** Melhor cenário: vence todos os jogos restantes. */
  pontosMax: number;
}

function projetar(s: SelecaoRaw): Projecao {
  const jogosRestantes = Math.max(0, TOTAL_RODADAS - s.jogos);
  const pontos = calcularPontos(s);
  return {
    id: s.id,
    pontosMin: pontos,
    pontosMax: pontos + jogosRestantes * 3,
  };
}

/**
 * Calcula o status de classificação de cada seleção do grupo a partir da
 * projeção de pontos (melhor/pior caso) dos jogos restantes.
 *
 * Premissa (ver README): o dataset não traz a tabela de confrontos restantes,
 * então tratamos cada jogo restante como independente. Isso torna:
 *  - "Eliminada"  matematicamente sólido (mesmo no melhor caso fica abaixo);
 *  - "Classificada" conservador (só garante quando no pior caso ainda passa).
 *
 * Regras (grupo de 4, classificam-se os 2 primeiros):
 *  - Classificada: no máximo 1 rival consegue alcançar/ultrapassar os pontos
 *    mínimos da seleção (=> ela termina, no pior caso, em 2º).
 *  - Eliminada: ao menos 2 rivais já têm mais pontos do que o máximo possível
 *    da seleção (=> não há cenário de top-2).
 *  - Em disputa: qualquer outro caso.
 */
export function calcularStatusDoGrupo(grupo: SelecaoRaw[]): Map<string, StatusClassificacao> {
  const projecoes = grupo.map(projetar);
  const resultado = new Map<string, StatusClassificacao>();

  for (const alvo of projecoes) {
    const rivais = projecoes.filter((p) => p.id !== alvo.id);

    const podemAlcancar = rivais.filter((r) => r.pontosMax >= alvo.pontosMin).length;
    const jaAcima = rivais.filter((r) => r.pontosMin > alvo.pontosMax).length;

    let status: StatusClassificacao;
    if (podemAlcancar <= VAGAS_POR_GRUPO - 1) {
      status = "Classificada";
    } else if (jaAcima >= VAGAS_POR_GRUPO) {
      status = "Eliminada";
    } else {
      status = "Em disputa";
    }
    resultado.set(alvo.id, status);
  }

  return resultado;
}

/** Calcula o status de todas as seleções, agrupando por `grupo`. */
export function calcularStatus(selecoes: SelecaoRaw[]): Map<string, StatusClassificacao> {
  const porGrupo = new Map<string, SelecaoRaw[]>();
  for (const s of selecoes) {
    const lista = porGrupo.get(s.grupo) ?? [];
    lista.push(s);
    porGrupo.set(s.grupo, lista);
  }

  const status = new Map<string, StatusClassificacao>();
  for (const grupo of porGrupo.values()) {
    for (const [id, st] of calcularStatusDoGrupo(grupo)) {
      status.set(id, st);
    }
  }
  return status;
}
