## 1. Contexto

Estamos no meio da fase de grupos da Copa do Mundo 2026 (EUA / Canadá / México,
formato novo de 48 seleções).

Um analista esportivo quer abrir uma página e ver, num piscar de olhos, **as 5
seleções com maior aproveitamento (% de pontos conquistados sobre os possíveis)**
até agora, com bandeira, grupo, V-E-D, saldo de gols, pontos e um indicador de
status de classificação. Ele também quer **exportar a lista em CSV** para mandar
no grupo do WhatsApp da empresa.

É isso. O resto deste documento são apenas regras e detalhes para você executar.

---

## 2. O que você vai construir

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
**legível e correta**.

---

## 3. Regras de negócio

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

---

## 5. Caminhos possíveis (escolha 1)

### Caminho A — Dentro do Streetly (este repositório)

- Front: React 18 + TypeScript + Vite + TanStack Query + Tailwind/Radix.
- Back: Express + TypeScript.
- Crie a página numa rota nova (ex.: `/copa-2026`).
- Pelo menos **1 teste** (Vitest) cobrindo a regra de ordenação OU o cálculo de
  aproveitamento.

### Caminho B — Standalone (qualquer stack)

- Crie um repositório novo do zero.
- Use a stack que você conhece melhor: Node/Express + qualquer front, Next.js,
  Vue, etc.
- Pelo menos **1 teste** automatizado de uma regra de negócio.

**Não existe escolha "certa".** Escolha o caminho onde você produz mais e melhor
em 60 minutos. Justifique a escolha em 1 frase no `README.md`.

---

## 6. Como você deve usar o Cursor

> **Este é o ponto principal do teste.** Vamos avaliar mais o **como você
> conversou com a IA** do que o resultado final do código.

- Use o Cursor à vontade — agente, inline, autocomplete, do jeito que preferir.
- **Você pode (e deve) usar a IA pra desenvolver.** Não é teste de "decorar
  sintaxe".
- **Não use** outras IAs (ChatGPT, Claude.ai, Gemini etc.) durante o teste — só
  o Cursor. Se você usar outra ferramenta por algum motivo, registre isso no
  `PROMPTS.md`.
- **Você pode me perguntar** quantas vezes quiser sobre **regra de negócio**.
- **Não respondo dúvida técnica** — essa é com a IA e com você.

---

## 7. O que você precisa entregar

Um repositório (público no GitHub OU um `.zip`) contendo:

```
/
├── (código da feature)
├── README.md       ← do template; preencha
├── PROMPTS.md      ← do template; preencha durante o teste
└── (testes)
```

### `README.md` deve responder

1. Como rodar o projeto (passo a passo).
2. **Caminho escolhido** (A ou B) e por quê (1 frase).
3. **Decisões que você tomou** (ex.: "considerei jogos=0 como aproveitamento 0",
   "desempatei empate triplo final por ordem alfabética", etc.).
4. O que você **NÃO terminou** e o que faria se tivesse mais 1h.
5. **O que você revisou com cuidado** vs. **o que confiou na IA** sem revisar
   linha por linha. Seja honesto — isso conta a favor, não contra.

### `PROMPTS.md` deve conter

A lista cronológica dos prompts que você usou no Cursor, no formato:

```markdown
## Prompt 1 — [resumo de 1 linha]
**Por quê:** [o que você queria conseguir]

[texto do prompt — pode ser link de Share do Cursor, ou texto colado]

---

## Prompt 2 — ...
```

Você pode usar **links de Share do Cursor** (no chat, menu `⋯` → Share) **ou**
copiar/colar o texto. Ambos servem.

### Commits

- Faça commits **pequenos e descritivos** (não 1 commit gigante no final).
- Mensagens em português ou inglês, qualquer um.
