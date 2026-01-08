FROM node:alpine AS builder
WORKDIR /app

# Install Go and build timescaledb-tune from source
RUN apk add --no-cache go git && \
    go install github.com/timescale/timescaledb-tune/cmd/timescaledb-tune@latest && \
    mv /root/go/bin/timescaledb-tune /usr/local/bin/ && \
    apk del go git && \
    rm -rf /root/go

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /usr/local/bin/timescaledb-tune /usr/local/bin/timescaledb-tune
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]