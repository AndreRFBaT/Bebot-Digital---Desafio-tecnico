import express, { type NextFunction, type Request, type Response } from "express";
import { rotasCopa } from "./rotas";

const app = express();
const PORTA = Number(process.env.PORT) || 3001;

app.use("/api/copa", rotasCopa);

// 404 para rotas de API não encontradas.
app.use("/api", (_req, res) => {
  res.status(404).json({ erro: "Recurso não encontrado." });
});

// Tratador de erros centralizado.
app.use((erro: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const mensagem = erro instanceof Error ? erro.message : "Erro interno do servidor.";
  console.error("[copa-2026] erro ao processar requisição:", mensagem);
  res.status(500).json({ erro: mensagem });
});

app.listen(PORTA, () => {
  console.log(`[copa-2026] API ouvindo em http://localhost:${PORTA}`);
});
