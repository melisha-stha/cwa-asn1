FROM node:20 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM node:20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY next.config.ts ./
COPY package.json ./
COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:20 AS runner
WORKDIR /app
ENV NODE_ENV production
ENV PORT 3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY prisma/dev.db ./
COPY .env* ./

EXPOSE 3000
CMD ["node", "server.js"]