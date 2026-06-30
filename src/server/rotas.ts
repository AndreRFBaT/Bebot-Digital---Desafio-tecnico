import { Router } from "express";
import { calcularSelecoes, calcularTop5 } from "../domain/termometro";
import { carregarDataset } from "./dataset";

export const rotasCopa = Router();

/** GET /api/copa/selecoes — lista completa, calculada e ordenada. */
rotasCopa.get("/selecoes", async (_req, res, next) => {
  try {
    const dataset = await carregarDataset();
    res.json(calcularSelecoes(dataset));
  } catch (erro) {
    next(erro);
  }
});

/** GET /api/copa/top5 — as 5 seleções com maior aproveitamento. */
rotasCopa.get("/top5", async (_req, res, next) => {
  try {
    const dataset = await carregarDataset();
    res.json(calcularTop5(dataset));
  } catch (erro) {
    next(erro);
  }
});
