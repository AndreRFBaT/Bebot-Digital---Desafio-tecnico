# Termômetro da Copa 2026 — Guia de execução (Local e Docker)

Este guia cobre as duas formas de rodar o projeto: **localmente** (Node na
máquina) e via **Docker / Docker Compose** (ambiente de desenvolvimento
containerizado, com hot reload).

## Visão geral da aplicação

- **Linguagem:** TypeScript (Node.js, ESM).
- **Front:** React 18 + Vite (porta `5173`).
- **Back:** Express (porta `3001`).
- **Banco de dados:** _não há_. A fonte de dados é o arquivo `dataset.json`,
  lido pela API. Por isso **não existe serviço de banco nem volume de
  persistência** — não haveria estado a persistir.
- **Variáveis de ambiente:**
  - `PORT` — porta da API (default `3001`).
  - `API_PROXY_TARGET` — alvo do proxy `/api` do Vite (default
    `http://localhost:3001`; no Docker é `http://api:3001`).

---

## 1. Execução local (sem Docker)

Pré-requisito: Node 18+.

```bash
npm install        # instala dependências
npm run dev        # sobe API (3001) + front (5173) juntos (concurrently)
```

Acesse <http://localhost:5173> (a raiz `/` redireciona para `/copa-2026`).

Comandos úteis:

```bash
npm test           # testes (Vitest)
npm run dev:api    # só a API
npm run dev:web    # só o front
npm run build      # typecheck + build de produção do front
```

---

## 2. Execução com Docker

Pré-requisitos: Docker e Docker Compose v2 (`docker compose`).

### Subir o ambiente

```bash
docker compose up
```

Isso constrói a imagem (uma única imagem `termometro-copa:dev` compartilhada
pelos dois serviços) e sobe:

- **api** → <http://localhost:3001> (ex.: `http://localhost:3001/api/copa/top5`)
- **web** → <http://localhost:5173>

Para rodar em segundo plano (modo "detached"):

```bash
docker compose up -d
```

Acompanhar os logs:

```bash
docker compose logs -f          # todos os serviços
docker compose logs -f web      # só o front
docker compose logs -f api      # só a API
```

### Hot reload

O código é montado nos containers via bind mount (`./:/app`), então editar
arquivos na máquina recarrega automaticamente o front (Vite HMR) e reinicia a
API (`tsx watch`). O `node_modules` fica num volume anônimo, preservando as
dependências instaladas na imagem.

### Reconstruir os containers

Sempre que mudar dependências (`package.json` / `package-lock.json`) ou o
`Dockerfile`:

```bash
docker compose up --build              # reconstrói e sobe
# ou, forçando do zero (ignorando cache de camadas):
docker compose build --no-cache
docker compose up
```

Se um volume anônimo de `node_modules` ficar desatualizado após mudar deps,
recrie os containers:

```bash
docker compose up --build --force-recreate
```

### Parar o ambiente

```bash
# Se estiver em foreground: Ctrl+C

# Parar containers (mantém imagens/volumes):
docker compose stop

# Parar e remover containers + rede:
docker compose down

# Remover também os volumes anônimos (ex.: node_modules do container):
docker compose down -v
```

### Rodar os testes dentro do container

```bash
docker compose run --rm api npm test
```

---

## 3. Detalhes da configuração Docker

- **Imagem base `node:20-alpine`:** oficial, LTS e leve (Alpine).
- **Imagem única para `api` e `web`:** mesmo código-fonte; cada serviço só muda
  o `command`. Compose constrói uma vez e reaproveita (`image: termometro-copa:dev`).
- **Cache de dependências:** o `Dockerfile` copia `package*.json` e roda
  `npm ci` **antes** de copiar o código. Enquanto os manifests não mudam, a
  camada de `node_modules` vem do cache.
- **Usuário não-root:** roda como o usuário `node` (já presente na imagem
  oficial), inclusive no `npm ci`.
- **Rede dedicada `copa-net` (bridge):** isola a comunicação entre containers;
  o front alcança a API pelo nome de serviço `api` (`http://api:3001`).
- **Restart policy `unless-stopped`:** os serviços voltam sozinhos após falha
  ou reboot, exceto se parados manualmente.
- **Healthcheck na API:** consulta `GET /api/copa/top5` periodicamente.
- **Sem volume de persistência:** não há banco/estado; o `dataset.json` é
  estático e versionado no repositório.

> Observação: estes arquivos configuram o ambiente de **desenvolvimento**
> (hot reload). Para produção, o próximo passo seria um `Dockerfile`
> multi-stage que faz `npm run build` e serve os arquivos estáticos do front
> junto da API (ou via Nginx), com `NODE_ENV=production`.
