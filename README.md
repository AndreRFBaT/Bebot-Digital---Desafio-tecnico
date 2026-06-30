# Desafio técnico: Bebot Digital

Link para os documentos de prompts:

[Prompts utilizados durante o desafio](https://github.com/AndreRFBaT/Bebot-Digital---Desafio-tecnico/tree/main/PROMPTS)

## Estrutura do projeto

```text

├── dataset.json                 # Dados mockados da Copa 2026
├── docker-compose.yml           # Ambiente Docker
├── Dockerfile                   # Configuração da imagem Docker
├── package.json
├── README.md
├── src
│   ├── domain                   # Regras de negócio
│   │   ├── metricas.ts
│   │   ├── ordenacao.ts
│   │   ├── status.ts
│   │   ├── termometro.ts
│   │   └── termometro.test.ts
│   ├── server                   # API Express
│   │   ├── dataset.ts
│   │   ├── index.ts
│   │   └── rotas.ts
│   └── web                      # Aplicação React
│       ├── api.ts
│       ├── App.tsx
│       ├── csv.ts
│       ├── formato.ts
│       ├── index.css
│       ├── main.tsx
│       └── components
│           ├── Filtros.tsx
│           ├── ListaProximasRodadas.tsx
│           ├── StatusBadge.tsx
│           ├── TabelaSelecoes.tsx
│           └── TermometroPage.tsx
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Termômetro da Copa 2026

Tela única que mostra as **5 seleções com maior aproveitamento** na fase de
grupos da Copa 2026 (estado mockado após a 2ª rodada), com status de
classificação **calculado** e exportação em **CSV** compatível com Excel pt-BR.

## Como rodar

Pré-requisitos: Node 18+.

```bash
npm install        # instala dependências
npm run dev        # sobe API (porta 3001) + front (porta 5173) juntos
```

Abra <http://localhost:5173> (a raiz `/` redireciona para `/copa-2026`).

Outros comandos:

```bash
npm test           # roda os testes (Vitest)
npm run dev:api    # só a API Express
npm run dev:web    # só o front Vite
npm run build      # typecheck + build de produção do front
```

## Caminho escolhido

**Caminho A** (stack do desafio: React 18 + TS + Vite + TanStack Query +
Tailwind no front; Express + TS no back) — escolhido por ser exatamente a stack
sugerida e permitir demonstrar a integração front↔back sem custo extra.

## Arquitetura (resumo)

Três camadas finas com a **regra de negócio isolada num domínio puro**:

- `src/domain/` — TS puro, sem framework. Calcula métricas, ordena, define o
  status e monta o Top 5. **É o alvo do teste** e a única fonte de verdade.
- `src/server/` — Express. `GET /api/copa/selecoes` (lista completa) e
  `GET /api/copa/top5`, com leitura/validação do `dataset.json` e tratador de
  erros central. O backend devolve os dados **já calculados e ordenados**.
- `src/web/` — React. Página `/copa-2026` com TanStack Query buscando os
  endpoints, tabela Top 5, botão de CSV, e o panorama com filtros. O front é
  "burro": só formata (locale pt-BR) e exibe.

**Fonte de dados:** endpoint Express lendo o `dataset.json` (das 3 opções do
briefing). Motivo: a stack já usa TanStack Query, então um endpoint é o encaixe
natural e evita duplicar a regra de negócio no front.

## Decisões que tomei

- **`jogos = 0` (Suíça):** aproveitamento = `0` (não há divisão por zero; sem
  jogos não há pontos conquistados).
- **Desempate final (após aproveitamento → saldo → gols pró):** ordem
  **alfabética** do nome da seleção (pt-BR), por ser estável e determinística.
  No dataset isso resolve o 5º lugar: Alemanha e Inglaterra empatam em todos os
  critérios anteriores → entra **Alemanha**.
- **Status de classificação (calculado, sem atalho):** como o `dataset.json`
  **não traz a tabela de confrontos restantes**, projeto os pontos de cada
  seleção em melhor caso (`pontos + 3 × jogos_restantes`) e pior caso (`pontos
  atuais`), tratando cada jogo restante como independente. Num grupo de 4
  (passam 2):
  - **Classificada:** no máximo 1 rival consegue alcançar/ultrapassar os pontos
    mínimos da seleção → no pior caso ela termina em 2º.
  - **Eliminada:** ao menos 2 rivais já têm mais pontos que o máximo possível
    dela → não há cenário de top-2.
  - **Em disputa:** qualquer outro caso.

  Consequência dessa premissa: "Eliminada" é matematicamente sólido e
  "Classificada" é **conservador**. Ex.: a Espanha (6 pts) fica "Em disputa"
  porque 3 rivais do grupo ainda podem chegar a 6, enquanto o Brasil (6 pts)
  fica "Classificada" porque só um rival pode alcançá-lo — distinção real, não
  atalho.
- **CSV para Excel pt-BR:** separador `;`, vírgula decimal (`83,3%`) e **BOM
  UTF-8** para preservar acentos/emojis. Gerado no cliente a partir dos mesmos
  dados da tabela (paridade tela↔arquivo).
- **Filtros:** por **grupo** e por **status** (a "categoria" disponível nos
  dados). Não há filtro por *rodada* porque o dataset é um único snapshot
  (pós-2ª rodada).

## O que NÃO terminei / próximos passos (com +1h)

- Status mais preciso usando a tabela de confrontos restantes (hoje é uma
  aproximação conservadora por falta desse dado).
- Testes de componente do front (CSV e render da tabela) e teste do status.
- Acessibilidade/responsividade mais cuidadas e estados de loading com skeleton.

## O que revisei com cuidado vs. confiei na IA

- **Validei o comportamento da aplicação executando o projeto localmente**, verificando os cálculos de aproveitamento, ordenação, exportação em CSV e a integração entre frontend e backend.
- **Utilizei a IA para acelerar a implementação da estrutura do projeto**, configurações, componentes e parte da lógica, realizando validações funcionais durante o desenvolvimento em vez de revisar cada linha de código individualmente.
