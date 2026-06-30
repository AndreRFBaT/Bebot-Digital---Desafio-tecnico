# Imagem de desenvolvimento compartilhada pelos serviços "api" e "web".
# Node 20 LTS em Alpine: imagem oficial e leve.
FROM node:20-alpine

ENV NODE_ENV=development
WORKDIR /app

# Cache de dependências: copia só os manifests primeiro.
# Enquanto package*.json não mudar, o npm ci é reaproveitado do cache.
COPY --chown=node:node package.json package-lock.json ./

# Roda como usuário não-root (o "node" já existe na imagem oficial).
USER node
RUN npm ci

# Código-fonte (em dev é sobrescrito pelo bind mount do compose).
COPY --chown=node:node . .

# 3001 = API Express | 5173 = Vite dev server
EXPOSE 3001 5173

# Default sobrescrito por cada serviço no docker-compose.yml.
CMD ["npm", "run", "dev:api"]
