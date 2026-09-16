FROM node:24-alpine AS dependencies
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci

FROM dependencies AS builder
WORKDIR /app
COPY apps/api ./apps/api
RUN npm run build --workspace @creative-thoughts/api

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 4000
CMD ["npm", "run", "start", "--workspace", "@creative-thoughts/api"]
