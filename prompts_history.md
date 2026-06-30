# Copa do Mundo 2026 dashboard
_Exported on 30/06/2026 at 13:03:45 BRT from Cursor (3.9.16)_

---

**User**

você é um arquiteto de software e   experiente

analise o contexto abaixo:

"Estamos no meio da fase de grupos da Copa do Mundo 2026 (EUA / Canadá / México,
formato novo de 48 seleções).

Um analista esportivo quer abrir uma página e ver, num piscar de olhos, **as 5
seleções com maior aproveitamento (% de pontos conquistados sobre os possíveis)**
até agora, com bandeira, grupo, V-E-D, saldo de gols, pontos e um indicador de
status de classificação. Ele também quer **exportar a lista em CSV** para mandar
no grupo do WhatsApp da empresa.

É isso. O resto deste documento são apenas regras e detalhes para você executar."

Baseado nesse contexto o desafio pede:

"## 2. O que você vai construir

Uma única tela ("Termômetro da Copa") contendo:

1. Uma **tabela com 5 linhas** — as Top 5 seleções por aproveitamento.
2. Cada linha mostra, nesta ordem:
   - Posição (1 a 5)
   - Bandeira (emoji do dataset)
   - Seleção
   - Grupo
   - Jogos disputados
   - Vitórias / Empates / Derrotas (pode ser uma coluna `V-E-D` ou três colunas)
   - Saldo de gols (com sinal: `+4`, `-2`, `0`)
   - Pontos
   - Aproveitamento (%, 1 casa decimal — ex.: `83,3%`)
   - Status: ✅ Classificada · ⚠️ Em disputa · ❌ Eliminada
3. Um botão **"Exportar CSV"** que baixa o mesmo conteúdo, com cabeçalhos em
   português, abrindo corretamente no Excel em pt-BR.

UI simples e limpa basta. Não precisa ser bonita "de design" — precisa ser
**legível e correta**."

seguindo ainda nesse contexto: observe as regras de nogócio:

"## 3. Regras de negócio

### Aproveitamento

```
aproveitamento = pontos / (jogos × 3)
```

Expresso em % com **1 casa decimal**.

### Ordenação

Ordene por **aproveitamento desc**. Em caso de empate:
1º critério de desempate: **saldo de gols** (maior primeiro)
2º critério de desempate: **gols pró** (maior primeiro)

Se ainda assim houver empate, **você decide o critério final** — só **documente
sua escolha** no `README.md`.

### Status de classificação

Cada grupo tem **4 seleções**, classifica-se quem ficar em **1º ou 2º** do grupo
ao fim das 3 rodadas.

- ✅ **Classificada**: já garantiu top-2 do grupo matematicamente (mesmo no pior
  cenário das partidas restantes).
- ❌ **Eliminada**: não há mais cenário matemático que coloque a seleção no
  top-2 do grupo.
- ⚠️ **Em disputa**: qualquer outra situação.

> O status deve ser **calculado** a partir dos dados — não use atalhos.

### Pontuação (caso precise)

Vitória = 3 pts · Empate = 1 pt · Derrota = 0 pt.

---

## 4. Dados

Use o arquivo `dataset.json` que veio junto com este briefing como fonte de dados
mockada. Estado simulado em **24/jun/2026, após a 2ª rodada da fase de grupos**.

Você decide se serve esses dados via:
- Endpoint Express (`GET /api/copa/selecoes`),
- Arquivo estático servido pelo seu front,
- Ou import direto.

Qualquer uma das três é aceitável — só justifique brevemente no `README.md`.

---"
 

fornceça:
objetivos principal
requisitos funcionas
requisitos não funcionais
ambiguidades
possíveis riscos
critérios de sucesso

não gere código


---

**Cursor**

Vou dar uma olhada rápida no workspace para fundamentar a análise no dataset real antes de responder.

Deixa eu ler o dataset e o briefing para ancorar a análise nos dados reais.

Analisei o briefing (`BRIEFING.md`), o `dataset.json` e o `PROMPTS.md`. Aqui está minha leitura como arquiteto, já ancorada nos dados reais (que escondem várias armadilhas relevantes).

---

## Objetivo principal

Entregar uma **única tela "Termômetro da Copa"** que mostre, de forma legível e **correta**, o **ranking das 5 seleções com maior aproveitamento** na fase de grupos da Copa 2026 (estado mockado em 24/jun, pós-2ª rodada), com indicador de status de classificação **calculado**, e permitir **exportar esse mesmo conteúdo em CSV** que abra corretamente no Excel pt-BR.

Vale destacar o subtexto do briefing (seções 6): o **objetivo real avaliado é o processo de uso do Cursor/IA** (registrado em `PROMPTS.md`) e a **honestidade nas decisões** (`README.md`), mais do que a sofisticação do código. Isso muda prioridades: correção + rastreabilidade das decisões > features extras.

---

## Requisitos funcionais

1. **Carregar dados** do `dataset.json` (16 seleções, 4 grupos).
2. **Calcular, por seleção:** pontos (`3V+E`), saldo de gols (`gp-gc`), aproveitamento (`pontos / (jogos×3)`).
3. **Ordenar** por aproveitamento desc → saldo desc → gols pró desc → critério final próprio (documentado).
4. **Recortar Top 5** (ranking global, atravessando grupos).
5. **Renderizar tabela** com colunas na ordem exata do briefing: Posição, Bandeira, Seleção, Grupo, Jogos, V-E-D, Saldo (com sinal `+4`/`-2`/`0`), Pontos, Aproveitamento (`83,3%`, 1 casa, vírgula decimal), Status.
6. **Calcular status** (✅ Classificada / ⚠️ Em disputa / ❌ Eliminada) matematicamente por seleção, considerando os jogos restantes do grupo — não por atalho/hardcode.
7. **Exportar CSV** com o mesmo conteúdo do Top 5, cabeçalhos em português, compatível com Excel pt-BR.
8. **Disponibilizar os dados** por uma das três vias (endpoint Express / estático / import) — escolha documentada.
9. **≥ 1 teste automatizado** cobrindo ordenação OU aproveitamento.

---

## Requisitos não funcionais

- **Correção numérica** acima de tudo (aproveitamento, saldo, status). É o critério explícito de avaliação.
- **Localização pt-BR**: formatação decimal com vírgula; CSV com **separador `;`** e **BOM UTF-8** para o Excel pt-BR não quebrar acentos nem juntar colunas.
- **Legibilidade da UI** (não precisa ser bonita); renderização correta de emojis de bandeira (atenção ao 🏴 da Inglaterra, que não é um flag-emoji regional comum).
- **Escopo de tempo**: ~60 min → favorecer simplicidade e stack dominada.
- **Rastreabilidade**: commits pequenos/descritivos, `PROMPTS.md` cronológico, `README.md` com decisões e separação "revisei vs. confiei na IA".
- **Manutenibilidade**: separar regra de negócio (cálculo/ordenação/status) da apresentação, para ser testável isoladamente.
- **Determinismo**: mesma entrada → mesma saída (sem ordenação instável em empates).

---

## Ambiguidades (as mais críticas vêm dos dados, não do texto)

1. **Divisão por zero — Suíça (`SUI`) tem `jogos: 0`.** `pontos/(0×3)` é indefinido. O próprio README-template sugere tratar como aproveitamento 0 — precisa ser decidido e documentado. (Não entra no Top 5, mas afeta a função.)
2. **Rodadas desiguais — Japão (`JPN`) tem `jogos: 1`**, enquanto o resto do Grupo C tem 2. O briefing diz "após a 2ª rodada", mas o dataset não é uniforme. Isso afeta **quantos jogos restam** para cada seleção e, logo, o cálculo de status.
3. **Calendário dos jogos restantes não existe no dataset.** O status "Classificada/Eliminada" pede simulação do **pior/melhor cenário matemático**, mas não há o chaveamento da 3ª rodada (quem enfrenta quem). Sem isso, o cálculo exato é impossível — é preciso **assumir** (ex.: cada time joga os adversários ainda não enfrentados do grupo, ou modelar de forma conservadora). **Essa é a maior ambiguidade do desafio** e é regra de negócio → vale perguntar ao avaliador.
4. **Critérios de desempate *dentro do grupo* para o status** não estão definidos (o briefing só define desempate para o ranking do Top 5). A FIFA usa confronto direto etc.; aqui não temos esses dados. Precisa de uma regra assumida.
5. **Empate triplo no Top 5 é real:** Espanha/Brasil/Argentina empatam em 100% (todos saldo +4 → desempate por gols pró: ESP 6 > BRA 5 > ARG 4). E há **empate no 5º lugar**: Alemanha e Inglaterra têm 66,7%, saldo +2 e gols pró 3 idênticos → cai exatamente no "critério final que você decide". Tem que ser documentado (ex.: ordem alfabética / por `id`).
6. **Significado de "Em disputa"** para quem já jogou tudo mas o grupo ainda não fechou (caso JPN com 1 jogo a menos): borda a tratar.
7. **CSV "mesmo conteúdo":** inclui a coluna Status com emoji? Emojis em CSV podem confundir o Excel — decidir se exporta o texto ("Classificada") ou texto+emoji.

---

## Possíveis riscos

- **Status calculado errado** por causa da ausência do calendário (item 3/4). É o ponto mais provável de erro e o de maior peso ("não use atalhos"). Risco de overengineering tentando ser exato, ou de simplificar demais e errar.
- **CSV quebrando no Excel pt-BR**: sem BOM ou com separador `,`, acentos viram lixo e tudo cai numa coluna só. Falha silenciosa e muito visível para o usuário final (WhatsApp da empresa).
- **NaN/Infinity** vazando do caso `jogos: 0` para a UI/ordenação.
- **Ordenação instável** fazendo o 5º lugar (GER vs ENG) variar entre execuções → resultado não determinístico e teste flaky.
- **Formatação numérica**: usar `toFixed` (ponto) em vez de locale pt-BR (vírgula), ou erro de arredondamento em `66,7%`.
- **Renderização de bandeira** 🏴 (Inglaterra) divergente entre SO/navegadores.
- **Estouro de tempo** investindo na UI em vez da correção das regras (que é o que será avaliado).
- **Acoplar regra de negócio à camada de view**, dificultando o teste exigido.

---

## Critérios de sucesso

1. **Top 5 correto e determinístico**, respeitando a cadeia de desempate (incl. o critério final documentado para o empate GER/ENG).
2. **Aproveitamento exibido com 1 casa decimal e vírgula** (`83,3%`), saldo com sinal explícito.
3. **Status calculado a partir dos dados** com a premissa de cenários restantes claramente documentada — não hardcoded.
4. **Caso `jogos: 0` (Suíça) tratado sem crash** e com regra explicitada.
5. **CSV abre no Excel pt-BR** com acentos corretos e colunas separadas, cabeçalhos em português, conteúdo idêntico à tabela.
6. **≥ 1 teste passando** sobre ordenação ou aproveitamento (idealmente cobrindo os empates).
7. **`README.md`** respondendo: como rodar, caminho A/B + porquê, decisões (jogos=0, desempate final, premissa de status), o que não terminou, e o honesto "revisei vs. confiei na IA".
8. **`PROMPTS.md`** com histórico cronológico real e **commits pequenos/descritivos**.

---

**Recomendação de arquiteto:** trate o desafio como "correção + transparência", não "features". Isole a lógica de domínio (cálculo, ordenação, status) em um módulo puro e testável, deixando UI e CSV como camadas finas em cima. E **antes de codar o status, pergunte ao avaliador** como modelar os jogos restantes (item 3) — é regra de negócio, é permitido perguntar, e é o maior risco de errar.

Quer que eu transforme isso num plano de implementação (escolha de caminho A vs. B, modelagem do status e estrutura de testes)?

---

**User**

baseado no contexto anterior, projeto um solução simples para este desafio técnico:

forneça arquitetura
estrutura dos diretórios 
componentes necessários
fluxo de dados 
justificativa das decisões

Contexto:

"### Caminho A — Dentro do Streetly (este repositório)

- Front: React 18 + TypeScript + Vite + TanStack Query + Tailwind/Radix.
- Back: Express + TypeScript.
- Crie a página numa rota nova (ex.: `/copa-2026`).
- Pelo menos **1 teste** (Vitest) cobrindo a regra de ordenação OU o cálculo de
  aproveitamento."

Restrições:

evitar overengineering 
priorizar simplicidade
não utilizar bibliotecas desnecessárias

não implementar código

---

**Cursor**

Vou confirmar o que já existe no workspace para ancorar a proposta de diretórios (o briefing fala em "dentro do Streetly", mas preciso ver se o scaffolding está presente).

Confirmado: o workspace só tem os 3 arquivos do desafio — o repositório "Streetly" em si não está aqui. Então a proposta abaixo é o **Caminho A na prática**: scaffold mínimo com a stack exigida (React 18 + Vite + TS + TanStack Query + Tailwind no front, Express + TS no back), mantendo tudo enxuto. Sem código.

---

## 1. Arquitetura (visão geral)

Arquitetura em **3 camadas finas**, com a regra de negócio isolada num **módulo de domínio puro** que é a única coisa "inteligente" do sistema:

```
┌─────────────────────────────────────────────────────────┐
│  FRONT (React + Vite)                                     │
│  Rota /copa-2026                                          │
│   • TanStack Query → GET /api/copa/selecoes               │
│   • Renderiza tabela Top 5 (dados já calculados)          │
│   • Exporta CSV no cliente (Blob)                         │
└───────────────────────────┬───────────────────────────────┘
                            │ HTTP (JSON já calculado e ordenado)
┌───────────────────────────▼───────────────────────────────┐
│  BACK (Express)                                            │
│  GET /api/copa/selecoes                                   │
│   • lê dataset.json                                       │
│   • chama domínio → calcula + ordena + status             │
│   • responde Top 5 (JSON)                                 │
└───────────────────────────┬───────────────────────────────┘
                            │ import (função pura)
┌───────────────────────────▼───────────────────────────────┐
│  DOMÍNIO (TS puro, sem framework)  ← onde mora a verdade   │
│   • calcularMetricas (pontos, saldo, aproveitamento)      │
│   • ordenarSelecoes (desempates)                          │
│   • calcularStatus (cenários do grupo)                    │
│   • ALVO DO TESTE (Vitest)                                │
└─────────────────────────────────────────────────────────┘
```

**Princípio central:** o domínio é uma função pura `dataset → Top 5 calculado`. O Express só expõe; o React só desenha. Assim o teste do Vitest bate direto na regra de negócio, sem subir servidor nem navegador.

**Decisão "onde calcular": no backend.** O endpoint retorna os dados **já calculados, ordenados e com status**. O front fica burro (só formatação/locale). Isso evita duplicar regra nos dois lados e mantém o front trivial.

---

## 2. Estrutura de diretórios

```
copa-2026/
├── package.json                  # scripts: dev (front+api), test, build
├── tsconfig.json
├── vite.config.ts                # inclui proxy /api → Express
├── README.md                     # template preenchido
├── PROMPTS.md                    # já existe
├── dataset.json                  # fonte mockada (na raiz, lida pelo back)
│
├── src/
│   ├── domain/                   # ← CORAÇÃO (TS puro, testável)
│   │   ├── tipos.ts              # Selecao (raw) e SelecaoCalculada
│   │   ├── metricas.ts           # pontos, saldo, aproveitamento
│   │   ├── ordenacao.ts          # ordenarSelecoes (cadeia de desempate)
│   │   ├── status.ts             # calcularStatus (top-2 matemático)
│   │   ├── termometro.ts         # orquestra: dataset → Top 5
│   │   └── termometro.test.ts    # ← TESTE Vitest (ordenação/aproveitamento)
│   │
│   ├── server/                   # ← BACK (Express)
│   │   ├── index.ts              # sobe Express
│   │   └── rotas.ts              # GET /api/copa/selecoes
│   │
│   └── web/                      # ← FRONT (React)
│       ├── main.tsx              # bootstrap + QueryClientProvider
│       ├── App.tsx               # rota /copa-2026
│       ├── api.ts                # fetch tipado do endpoint
│       ├── csv.ts                # gera CSV pt-BR (Blob + BOM)
│       ├── formato.ts            # locale pt-BR (vírgula, sinal +/-)
│       └── components/
│           ├── TermometroPage.tsx   # useQuery + layout + botão CSV
│           ├── TabelaSelecoes.tsx   # a tabela (5 linhas)
│           └── StatusBadge.tsx      # ✅ / ⚠️ / ❌
│
└── index.html
```

Não há pasta `shared/` separada nem monorepo com workspaces: o domínio em `src/domain/` é importado tanto pelo `server/` quanto pelo teste — **um único projeto, sem cerimônia**.

---

## 3. Componentes necessários

### Domínio (puro, sem React/Express)
- **`tipos.ts`** — `Selecao` (raw do dataset) e `SelecaoCalculada` (com pontos, saldo, aproveitamento, posição, status).
- **`metricas.ts`** — calcula `pontos = 3v+e`, `saldo = gp-gc`, `aproveitamento`. Trata `jogos=0` → aproveitamento `0` (sem divisão por zero).
- **`ordenacao.ts`** — comparador: aproveitamento ↓ → saldo ↓ → gols pró ↓ → **critério final documentado** (ex.: ordem alfabética). Garante determinismo (resolve o empate real Alemanha × Inglaterra no 5º lugar).
- **`status.ts`** — calcula ✅/⚠️/❌ por grupo, modelando os jogos restantes (premissa documentada no README).
- **`termometro.ts`** — orquestra tudo e devolve o **Top 5**.

### Back (Express)
- **`rotas.ts`** — `GET /api/copa/selecoes`: lê `dataset.json`, chama `termometro`, responde JSON.
- **`index.ts`** — sobe o servidor.

### Front (React)
- **`TermometroPage.tsx`** — `useQuery` p/ buscar dados; estados de loading/erro; botão "Exportar CSV".
- **`TabelaSelecoes.tsx`** — tabela de 5 linhas, colunas na ordem do briefing.
- **`StatusBadge.tsx`** — mapeia status → emoji + rótulo.
- **`csv.ts`** — monta CSV (cabeçalhos pt-BR, separador `;`, BOM UTF-8) e dispara download via Blob.
- **`formato.ts`** — formatação pt-BR (`83,3%`, saldo com sinal).

### Teste
- **`termometro.test.ts`** — Vitest cobrindo **ordenação** (incl. desempates) e/ou **aproveitamento** (incl. `jogos=0`). Satisfaz o "≥1 teste".

---

## 4. Fluxo de dados

**Leitura (render da tela):**
```
dataset.json
   → [Express] GET /api/copa/selecoes
       → domain.termometro(dataset)
           → metricas() em cada seleção
           → status() por grupo
           → ordenacao() + slice(0,5)
       ← Top 5 calculado (JSON)
   → [TanStack Query] cache + estados (loading/error/success)
   → TabelaSelecoes renderiza (formato.ts aplica locale)
```

**Exportação (clique no botão):**
```
dados do useQuery (já em memória, mesmos do Top 5)
   → csv.ts: cabeçalhos PT + linhas (; , vírgula decimal) + BOM
   → Blob → URL → <a download> → arquivo .csv
```
O CSV usa **exatamente os dados já carregados** (não refaz fetch), garantindo paridade tela↔arquivo.

---

## 5. Justificativa das decisões

- **Domínio puro isolado** — torna a regra testável sem subir servidor/browser, atende o requisito do Vitest com o mínimo de fricção e evita lógica espalhada. É o ativo mais valioso do desafio (correção é o que será avaliado).
- **Cálculo no backend, front "burro"** — uma única fonte de verdade; o front só formata. Evita duplicar/divergir regras entre camadas.
- **Endpoint Express (das 3 opções do briefing)** — é o que a stack do Caminho A já pede (TanStack Query precisa de algo p/ buscar) e demonstra a integração front↔back sem custo extra.
- **CSV gerado no cliente, sem biblioteca** — `Blob` + `;` + **BOM UTF-8** resolve o "abrir certo no Excel pt-BR" em poucas linhas. Trazer `papaparse`/`json2csv` seria overengineering para 10 colunas.
- **Sem state manager extra (Redux/Zustand)** — TanStack Query já cobre fetch/cache/estados; não há estado global de UI relevante.
- **Tailwind para a tabela, Radix só se necessário** — o briefing pede "legível, não bonito". Uma `<table>` semântica com classes utilitárias basta; não vejo necessidade de componentes Radix aqui (evita dependência sem uso).
- **Projeto único (sem monorepo/workspaces)** — `src/domain | server | web` num só `package.json` reduz cerimônia de build para um escopo de ~60 min.
- **Critério final de desempate documentado** — o dataset tem empate real no 5º lugar (Alemanha × Inglaterra, mesmos aproveitamento/saldo/gols pró); definir e registrar a regra garante saída **determinística** e teste estável.

---

### ⚠️ Único ponto que ainda depende de decisão de negócio

O **`status.ts`** é o componente de maior risco: o `dataset.json` **não traz o calendário da 3ª rodada** (quem joga contra quem), então o cálculo "matemático" de classificação exige uma **premissa de modelagem**. A proposta mantém isso isolado num único módulo para que, definida a regra, a mudança seja local. Recomendo **confirmar essa premissa com o avaliador** (é regra de negócio, e o briefing permite perguntar) antes de implementar.

Quer que eu detalhe a modelagem do `status.ts` (as premissas possíveis para os jogos restantes) ou já parto para um plano de implementação passo a passo?

---

**User**

seguindo o contexto e informções anteriores, cada grupo de passar para a próxima rodada conforme vitória, empadate ou perda. 

Impletemente a funcionalidade principal da aplicação:

Requisitos:
"- Front: React 18 + TypeScript + Vite + TanStack Query + Tailwind/Radix.
- Back: Express + TypeScript.
- Crie a página numa rota nova (ex.: `/copa-2026`).
- Pelo menos **1 teste** (Vitest) cobrindo a regra de ordenação OU o cálculo de
  aproveitamento.

Backend:  
criar endpoints Get
tratar erros
fornecer dados

Front:
Buscar dados no backend
exibir os dados 
exibir lista de países para as próximas rodadas
implementar filtros por categoria/ rodada

restrições:
código limpo e simples
componentização adequada
fácil manutenção 

forneça arquivos criados
código
explicação da solução

---

**Cursor**

Boa — agora vou implementar a funcionalidade completa do Caminho A. Vou montar o scaffold (front React+Vite+TS+TanStack Query+Tailwind, back Express+TS), o módulo de domínio puro (cálculo/ordenação/status), o teste Vitest, e a página `/copa-2026` com a tabela Top 5, exportação CSV, lista de classificação e filtros.

Vou registrar o plano e já começar a criar os arquivos.

Começando pelo scaffold:

Scaffold pronto. Agora o domínio puro (o coração testável):

Agora o teste Vitest, cobrindo aproveitamento e ordenação (incluindo os empates reais do dataset):

Agora o backend Express com endpoints GET e tratamento de erro:

Agora o frontend. Começando pelos utilitários (formatação pt-BR, CSV, API) e o bootstrap:

Agora os componentes. StatusBadge:

Agora a página principal e o `App`:

Estrutura completa. Agora vou instalar as dependências e rodar os testes.

Os 5 testes passaram (exit code 0), mas o pool de workers do Vitest gera ruído de teardown no sandbox. Vou configurar o pool para `forks` em fork único, que é mais robusto nesse ambiente.

É um artefato do sandbox (o teardown do worker não consegue terminar o processo filho). Os testes passam. Vou confirmar rodando fora do sandbox:

Limpo: 5/5 testes passam. Agora verifico a tipagem TypeScript e faço um smoke test do endpoint:

Tipagem limpa. Agora o smoke test do backend — subo a API e consulto os dois endpoints:

Tudo funciona: o Top 5 sai `ESP, BRA, ARG, FRA, GER` (desempates corretos) e o 404 responde. Agora finalizo com o README documentando as decisões.

Vou adicionar um `.gitignore` e validar o build de produção do front:

Implementação completa e validada: **5/5 testes passam**, **typecheck limpo**, **build de produção OK** e os **endpoints respondem corretamente** (Top 5 = `ESP, BRA, ARG, FRA, GER`; 404 tratado).

## Arquivos criados

```
desafio_bobot/
├── package.json · tsconfig.json · vite.config.ts        # scaffold + config Vitest
├── tailwind.config.js · postcss.config.js · index.html
├── .gitignore · README.md                                # decisões documentadas
├── dataset.json                                          # (já existia) fonte mockada
└── src/
    ├── domain/                 ← regra de negócio (TS puro, testável)
    │   ├── tipos.ts            # SelecaoRaw / SelecaoCalculada / constantes
    │   ├── metricas.ts         # pontos, saldo, aproveitamento
    │   ├── ordenacao.ts        # comparador com cadeia de desempate
    │   ├── status.ts           # ✅/⚠️/❌ calculado por projeção de pontos
    │   ├── termometro.ts       # orquestra: dataset → calculadas / Top 5
    │   └── termometro.test.ts  # ← teste Vitest (aproveitamento + ordenação)
    ├── server/                 ← Express + TS
    │   ├── dataset.ts          # lê e valida dataset.json
    │   ├── rotas.ts            # GET /selecoes e GET /top5
    │   └── index.ts            # app + 404 + tratador de erros central
    └── web/                    ← React + Vite + TanStack Query
        ├── main.tsx            # QueryClient + rota /copa-2026
        ├── App.tsx · index.css
        ├── api.ts · formato.ts · csv.ts
        └── components/
            ├── TermometroPage.tsx       # página, useQuery, botão CSV
            ├── TabelaSelecoes.tsx       # tabela reaproveitável
            ├── StatusBadge.tsx          # selo de status
            ├── Filtros.tsx              # filtros grupo + status
            └── ListaProximasRodadas.tsx # panorama filtrável
```

## Explicação da solução

**Núcleo isolado (domínio puro).** Toda regra vive em `src/domain/`, sem React nem Express, então o teste do Vitest bate direto na lógica. O cálculo de aproveitamento trata o `jogos = 0` da Suíça sem divisão por zero:

```19:27:src/domain/metricas.ts
export function calcularAproveitamento(
  s: Pick<SelecaoRaw, "v" | "e" | "jogos">,
): number {
  if (s.jogos <= 0) return 0;
  return calcularPontos(s) / (s.jogos * 3);
}
```

A ordenação implementa a cadeia exigida (aproveitamento → saldo → gols pró) com critério final documentado (alfabético), o que resolve de forma determinística o empate real entre Alemanha e Inglaterra no 5º lugar.

**Status calculado, sem atalho.** Como o dataset não traz os confrontos restantes, projeto pontos em melhor/pior caso e comparo dentro do grupo. Isso torna "Eliminada" matematicamente sólido e "Classificada" conservador — por isso Brasil (6 pts) aparece como Classificada e Espanha (6 pts) como Em disputa (no grupo dela 3 rivais ainda podem chegar a 6). Tudo explicado no README.

**Backend fino.** Dois endpoints GET retornam os dados **já calculados e ordenados**; o front só formata. Há validação do dataset e um tratador de erros central que devolve `{ erro }` com status 500, além de 404 para rotas de API inexistentes.

**Front legível e componentizado.** A `TabelaSelecoes` é reaproveitada tanto no Top 5 quanto no panorama filtrável (filtros por **grupo** e **status**). O CSV é gerado no cliente a partir dos mesmos dados da tela, com separador `;`, vírgula decimal e BOM UTF-8 para abrir certo no Excel pt-BR.

**Como rodar:** `npm install` e `npm run dev` (sobe API na 3001 + front na 5173; `/` redireciona para `/copa-2026`). `npm test` roda a suíte.

Uma observação honesta: o `status` é hoje uma aproximação conservadora por falta da tabela de jogos restantes no dataset — isso é exatamente o ponto de regra de negócio que vale confirmar com o avaliador (e está registrado no README como "o que faria com +1h").

Quer que eu rode o Bugbot nas mudanças ou faça commits pequenos e descritivos do que foi criado?

---

**User**

Atue como um desenvolvedor sênior realizando code review.

Analise o código gerado.

Procure:

Bugs
Problemas de performance
Problemas de manutenção
Problemas de legibilidade
Melhorias possíveis

Para cada item informe:

Problema
Impacto
Sugestão de correção

Caso não encontre problemas relevantes, explique o motivo.

---

**Cursor**

Fiz o review como dev sênior, lendo o código que foi gerado. Resumo honesto: **o núcleo de domínio está sólido e bem isolado** (e os testes cobrem o que importa), então não há bugs graves. O que encontrei são majoritariamente itens de robustez, performance marginal e manutenção. Listo por severidade.

---

## Bugs / correção

### 1. Comparação de aproveitamento usa igualdade de ponto flutuante
**Problema:** o desempate depende de detectar empate exato de aproveitamento com `!==` entre `number`:

```10:13:src/domain/ordenacao.ts
  const aprovA = calcularAproveitamento(a);
  const aprovB = calcularAproveitamento(b);
  if (aprovA !== aprovB) return aprovB - aprovA;
```
`aproveitamento = pontos / (jogos*3)` produz floats. Dois valores matematicamente iguais com `jogos` diferentes podem divergir por epsilon (ou o contrário), fazendo a lógica "achar" um empate inexistente ou ignorar um empate real — e aí o critério de saldo não é aplicado.
**Impacto:** baixo no dataset atual (denominadores múltiplos de 3 coincidem), mas é uma fragilidade silenciosa que pode trocar a ordem em outros dados. Como ordenação é o ponto avaliado, vale blindar.
**Sugestão:** comparar por multiplicação cruzada inteira (`a.pontos * (b.jogos*3)` vs `b.pontos * (a.jogos*3)`) ou comparar `pontos` e `jogos` diretamente; alternativamente arredondar para a casa exibida antes de comparar.

### 2. `React.ReactNode` usado sem importar `React`
**Problema:** em `TermometroPage.tsx` o componente `Aviso` tipa `children: React.ReactNode`, mas o arquivo não importa `React` (usa só o JSX runtime automático). Compila hoje porque `@types/react` expõe o namespace global, mas é um acoplamento implícito.
**Impacto:** baixo; pode quebrar se a config de tipos mudar, e confunde quem lê.
**Sugestão:** `import type { ReactNode } from "react"` e usar `ReactNode`.

### 3. Refresh em `/copa-2026` quebra fora do dev
**Problema:** `createBrowserRouter` com rota real, mas nem o `vite preview` nem o Express servem `index.html` como fallback de SPA. Em dev o Vite resolve; em produção, recarregar `/copa-2026` dá 404.
**Impacto:** só afeta deploy/preview (não o fluxo `npm run dev` do desafio).
**Sugestão:** servir o `dist` pelo Express com fallback para `index.html`, ou documentar que o build precisa de fallback SPA.

---

## Performance

### 4. Dois endpoints/queries quando o Top 5 é derivável da lista
**Problema:** o front faz duas requisições (`/top5` e `/selecoes`) e o servidor recalcula tudo duas vezes; `top5` é literalmente `selecoes.slice(0,5)`.
**Impacto:** baixo (dataset minúsculo), mas é trabalho e rede redundantes e duas fontes para manter em sincronia.
**Sugestão:** manter uma única query `selecoes` e derivar `top5` no cliente com `useMemo(() => data.slice(0,5))`. Mantém o endpoint `/top5` se a API pública o exigir, mas o front consome um só.

### 5. `dataset.json` é lido, parseado e validado a cada request
**Problema:** `carregarDataset` faz `readFile` + `JSON.parse` + validação em toda chamada.
**Impacto:** desprezível no mock; viraria gargalo se o arquivo crescesse.
**Sugestão:** cachear em memória (ler uma vez no boot) — está até comentado no código que é proposital, então é só uma evolução.

### 6. Comparador recalcula campos derivados
**Problema:** `compararSelecoes` recomputa aproveitamento/saldo a cada comparação (`O(n log n)` recomputações), e `calcularSelecoes` ordena os dados brutos e só depois enriquece.
**Impacto:** irrelevante para 16 itens; é mais um cheiro de design.
**Sugestão:** enriquecer primeiro (calcular campos) e ordenar pelos valores já calculados — elimina recomputação e a leve duplicação de lógica.

---

## Manutenção

### 7. Tipo `FiltroGrupo = "Todos" | string` colapsa para `string`
**Problema:** a união com `string` absorve o literal `"Todos"`, então o tipo não documenta nada e não dá segurança.
**Impacto:** baixo; perde-se a intenção e o autocomplete.
**Sugestão:** modelar como `type FiltroGrupo = "Todos" | (string & {})` se quiser preservar a dica, ou aceitar `string` e tratar `"Todos"` como constante nomeada.

### 8. Dependências possivelmente dispensáveis (vs. a restrição do desafio)
**Problema:** `react-router-dom` para **uma** rota + redirect, e `concurrently` para subir dois processos — a restrição pedia "não usar bibliotecas desnecessárias".
**Impacto:** baixo, mas um avaliador pode cobrar coerência com a própria restrição.
**Sugestão:** documentei o porquê no README (rota explícita), o que mitiga; se quiser purismo, dá para renderizar a página direto e usar dois terminais. É um trade-off consciente, não um erro.

---

## Legibilidade

### 9. Coluna "#" tem significado diferente no panorama
**Problema:** `TabelaSelecoes` é reusada no Top 5 e no panorama filtrado, mas a coluna `posicao` é sempre o **rank global**. Ao filtrar o Grupo D, aparecem posições como 5, 12, 14 — o "#" deixa de ser "1 a N da lista".
**Impacto:** confusão de UX no panorama (parece numeração quebrada).
**Sugestão:** ou rotular como "Rank" e explicar que é o aproveitamento global, ou tornar a coluna de posição opcional via prop (`mostrarPosicao`) e ocultá-la no panorama.

### 10. Cabeçalhos de tabela vazios e `key` por índice
**Problema:** `<th>` vazio para bandeira e `key={i}` nas colunas; leitores de tela não anunciam a coluna de bandeira.
**Impacto:** acessibilidade marginal.
**Sugestão:** usar `scope="col"`, um header textual com `sr-only` (ex.: "Bandeira") e chaves estáveis.

---

## Melhorias possíveis (não são problemas)

- **Dados estáticos → `staleTime: Infinity`** no QueryClient: o mock não muda, evita refetches.
- **Mais um teste no domínio:** um caso de `status` (ex.: `CAN`/`AUS` eliminadas, Suíça com `jogos=0`) e um de ordenação com o `jogos=0` participando — barato e protege a regra mais frágil.
- **Extrair os cabeçalhos do CSV e da tabela de uma fonte só** (hoje a ordem das colunas é definida em dois lugares: `TabelaSelecoes` e `csv.ts`), garantindo paridade tela↔arquivo por construção.

---

## Por que não há achados graves

O ponto de maior risco do desafio — a corretude das regras — está **isolado em `src/domain/` como funções puras**, sem dependência de framework, o que torna o comportamento determinístico e testável. Verifiquei manualmente contra o dataset: aproveitamento, cadeia de desempate (incl. o empate real Alemanha×Inglaterra) e o status batem. Em particular, o modelo de status é **seguro na direção certa**: como projeta o melhor caso dos rivais de forma independente, ele só marca "Classificada"/"Eliminada" quando é matematicamente garantido, nunca gerando falso positivo de classificação. Os itens acima são refinamentos de robustez/manutenção, não defeitos funcionais.

Quer que eu aplique as correções de maior valor (itens 1, 2 e 4) e adicione os testes extras?

---

**User**

Analise todo o meu projeto antes de responder.

Quero dockerizar esta aplicação utilizando Docker e Docker Compose.

Sua tarefa é:

 Analisar a estrutura completa do projeto.
 Identificar automaticamente:

linguagem utilizada;
framework;
banco de dados;
dependências;
portas utilizadas;
variáveis de ambiente.

Criar os arquivos necessários:
Dockerfile
docker-compose.yml (ou compose.yml)
   - .dockerignore

Configurar o ambiente para desenvolvimento.

Caso exista banco de dados, criar um serviço separado para ele.

Criar volumes para persistência de dados quando necessário.

Configurar restart policy.

Criar uma rede dedicada entre os containers.

Utilizar boas práticas de Docker:
imagens oficiais;
imagens leves (Alpine quando fizer sentido);
cache de dependências;
usuário não-root quando possível.

Não invente configurações. Caso alguma informação esteja faltando, procure no projeto antes de decidir.

Depois disso, explique detalhadamente:

por que cada configuração foi escolhida;
como executar o projeto;
quais comandos utilizar;
como reconstruir os containers;
como parar o ambiente.

No final, gere também um README_DOCKER contendo todas as instruções de uso mantendo o uso local e o docker

---

**Cursor**

Vou analisar a estrutura completa do projeto antes de criar qualquer arquivo Docker. Deixa eu revisar os pontos-chave de configuração.

Deixa eu confirmar o restante: variáveis de ambiente usadas, presença de banco, e a árvore do projeto.

Análise concluída. Aqui está o que detectei automaticamente no projeto (sem inventar nada):

| Item | Detectado |
|---|---|
| **Linguagem** | TypeScript (Node.js), `"type": "module"` (ESM) |
| **Framework** | Front: React 18 + Vite; Back: Express |
| **Banco de dados** | **Nenhum** — a fonte de dados é o arquivo `dataset.json` lido pelo Express (`src/server/dataset.ts`). Nenhuma referência a Postgres/Mongo/MySQL/ORM. |
| **Dependências** | runtime: `express`, `react`, `react-dom`, `react-router-dom`, `@tanstack/react-query`; dev: `vite`, `tsx`, `typescript`, `tailwindcss`, `vitest`, `concurrently`… |
| **Portas** | API `3001` (`process.env.PORT \|\| 3001`); Vite dev `5173` (com proxy `/api` → `localhost:3001`) |
| **Variáveis de ambiente** | apenas `PORT` (API). O front não usa env em runtime (usa o proxy do Vite). |

**Decisão importante e honesta:** **não existe banco de dados**, então **não vou criar um serviço de DB nem volume de persistência** — seria inventar configuração. Os dados são estáticos (`dataset.json`). Vou montar **2 serviços** (`api` e `web`) numa rede dedicada, focados em **desenvolvimento** (hot reload), como pedido.

Há uma mudança mínima e necessária no `vite.config.ts`: dentro do Docker o front precisa fazer proxy para o serviço `api` (não `localhost`) e o Vite precisa escutar em `0.0.0.0`. Faço isso de forma retrocompatível (o `npm run dev` local continua igual).

Agora o `.dockerignore`:

Agora o `Dockerfile` (imagem única de desenvolvimento, oficial + Alpine, cache de deps, usuário não-root):

Vou validar a sintaxe do compose e verificar se o Docker está disponível no ambiente para testar o build.

Docker não está instalado neste ambiente, então não consigo executar o build aqui — mas o `Dockerfile` e o `docker-compose.yml` estão prontos e a sintaxe está correta. Agora crio o `README_DOCKER.md` com as instruções completas (local + Docker).

Vou confirmar que a alteração no `vite.config.ts` não quebrou nada (os testes usam esse mesmo arquivo):

Tudo continua passando (5/5). Dockerização concluída.

## Arquivos criados / alterados

- **`Dockerfile`** (novo) — imagem de dev única e leve.
- **`docker-compose.yml`** (novo) — serviços `api` + `web`, rede dedicada.
- **`.dockerignore`** (novo) — evita copiar `node_modules`, `dist`, `.git` etc. para o contexto de build.
- **`README_DOCKER.md`** (novo) — instruções completas (local + Docker).
- **`vite.config.ts`** (alterado, mínimo e retrocompatível) — proxy configurável + `host: true`.

## Por que cada configuração foi escolhida

**Sem serviço de banco / sem volume de dados.** A análise confirmou que não há banco algum — a fonte é o `dataset.json` lido pela API (`src/server/dataset.ts`). Como o desafio dizia "*caso exista banco*" e "*não invente configurações*", **não criei DB nem volume de persistência**: não há estado a persistir.

**Imagem `node:20-alpine`.** Oficial, LTS e leve (Alpine), atendendo as boas práticas pedidas.

**Imagem única compartilhada pelos dois serviços.** O front e o back saem do mesmo código; só muda o `command` (`dev:api` vs `dev:web`). Ambos usam `image: termometro-copa:dev` com `build: .`, então o Compose **constrói uma vez** e reutiliza.

**Cache de dependências.** O `Dockerfile` copia só `package*.json`, roda `npm ci`, e **depois** copia o código. Enquanto os manifests não mudam, a camada pesada de `node_modules` vem do cache.

**Usuário não-root.** Roda como o usuário `node` (já existente na imagem oficial), inclusive no `npm ci`, com `COPY --chown=node:node`.

**Rede dedicada `copa-net` (bridge).** Isola os containers; o front alcança a API pelo nome do serviço (`http://api:3001`). Por isso o `vite.config.ts` precisou de `API_PROXY_TARGET` — em Docker o proxy não pode apontar para `localhost`. A mudança mantém `localhost:3001` como default, então o `npm run dev` local segue idêntico.

**`host: true` no Vite.** Sem isso o dev server escuta só em `127.0.0.1` dentro do container e fica inacessível pela porta publicada.

**Bind mount + volume anônimo de `node_modules`.** O `./:/app` dá hot reload (Vite HMR e `tsx watch`); o `

