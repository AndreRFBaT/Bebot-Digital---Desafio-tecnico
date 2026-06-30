import { describe, expect, it } from "vitest";
import { calcularAproveitamento } from "./metricas";
import { calcularSelecoes, calcularTop5 } from "./termometro";
import type { SelecaoRaw } from "./tipos";

const dataset: SelecaoRaw[] = [
  { id: "BRA", selecao: "Brasil", bandeira: "🇧🇷", grupo: "A", jogos: 2, v: 2, e: 0, d: 0, gp: 5, gc: 1 },
  { id: "MEX", selecao: "México", bandeira: "🇲🇽", grupo: "A", jogos: 2, v: 1, e: 1, d: 0, gp: 3, gc: 2 },
  { id: "MAR", selecao: "Marrocos", bandeira: "🇲🇦", grupo: "A", jogos: 2, v: 0, e: 1, d: 1, gp: 1, gc: 3 },
  { id: "KOR", selecao: "Coreia do Sul", bandeira: "🇰🇷", grupo: "A", jogos: 2, v: 0, e: 0, d: 2, gp: 1, gc: 4 },
  { id: "ARG", selecao: "Argentina", bandeira: "🇦🇷", grupo: "B", jogos: 2, v: 2, e: 0, d: 0, gp: 4, gc: 0 },
  { id: "FRA", selecao: "França", bandeira: "🇫🇷", grupo: "B", jogos: 2, v: 1, e: 1, d: 0, gp: 4, gc: 1 },
  { id: "CIV", selecao: "Côte d'Ivoire", bandeira: "🇨🇮", grupo: "B", jogos: 2, v: 0, e: 1, d: 1, gp: 1, gc: 3 },
  { id: "AUS", selecao: "Austrália", bandeira: "🇦🇺", grupo: "B", jogos: 2, v: 0, e: 0, d: 2, gp: 0, gc: 5 },
  { id: "ESP", selecao: "Espanha", bandeira: "🇪🇸", grupo: "C", jogos: 2, v: 2, e: 0, d: 0, gp: 6, gc: 2 },
  { id: "POR", selecao: "Portugal", bandeira: "🇵🇹", grupo: "C", jogos: 2, v: 1, e: 0, d: 1, gp: 3, gc: 2 },
  { id: "URU", selecao: "Uruguai", bandeira: "🇺🇾", grupo: "C", jogos: 2, v: 1, e: 0, d: 1, gp: 2, gc: 2 },
  { id: "JPN", selecao: "Japão", bandeira: "🇯🇵", grupo: "C", jogos: 1, v: 0, e: 0, d: 1, gp: 0, gc: 5 },
  { id: "ENG", selecao: "Inglaterra", bandeira: "🏴", grupo: "D", jogos: 2, v: 1, e: 1, d: 0, gp: 3, gc: 1 },
  { id: "GER", selecao: "Alemanha", bandeira: "🇩🇪", grupo: "D", jogos: 2, v: 1, e: 1, d: 0, gp: 3, gc: 1 },
  { id: "SUI", selecao: "Suíça", bandeira: "🇨🇭", grupo: "D", jogos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0 },
  { id: "CAN", selecao: "Canadá", bandeira: "🇨🇦", grupo: "D", jogos: 2, v: 0, e: 0, d: 2, gp: 1, gc: 5 },
];

describe("aproveitamento", () => {
  it("calcula pontos / (jogos * 3)", () => {
    // 2 vitórias em 2 jogos = 6/6 = 100%
    expect(calcularAproveitamento({ v: 2, e: 0, jogos: 2 })).toBe(1);
    // 1 vitória + 1 empate em 2 jogos = 4/6
    expect(calcularAproveitamento({ v: 1, e: 1, jogos: 2 })).toBeCloseTo(0.6667, 4);
  });

  it("retorna 0 quando não há jogos (evita divisão por zero)", () => {
    expect(calcularAproveitamento({ v: 0, e: 0, jogos: 0 })).toBe(0);
  });
});

describe("ordenação / Top 5", () => {
  it("ordena por aproveitamento desc com desempates corretos", () => {
    const top5 = calcularTop5(dataset).map((s) => s.id);
    // 100%: ESP, BRA, ARG (saldo igual +4 -> desempate por gols pró: 6 > 5 > 4)
    // 66,7%: FRA (saldo +3) à frente; 5º lugar empate GER x ENG (saldo +2, gp 3)
    // -> critério final alfabético: "Alemanha" < "Inglaterra" => GER
    expect(top5).toEqual(["ESP", "BRA", "ARG", "FRA", "GER"]);
  });

  it("desempata empate triplo final pelo nome (alfabético pt-BR)", () => {
    const todas = calcularSelecoes(dataset);
    const ger = todas.findIndex((s) => s.id === "GER");
    const eng = todas.findIndex((s) => s.id === "ENG");
    expect(ger).toBeLessThan(eng);
  });
});

describe("status de classificação", () => {
  it("classifica líderes folgados e elimina lanternas sem chance", () => {
    const porId = new Map(calcularSelecoes(dataset).map((s) => [s.id, s.status]));
    expect(porId.get("BRA")).toBe("Classificada");
    expect(porId.get("ARG")).toBe("Classificada");
    expect(porId.get("AUS")).toBe("Eliminada");
    expect(porId.get("CAN")).toBe("Eliminada");
  });
});
