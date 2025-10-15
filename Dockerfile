FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=dev

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner

ENV NODE_ENV production
ENV PORT 3000

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY dev.db ./
COPY .env ./

EXPOSE 3000

CMD ["node", "server.js"]