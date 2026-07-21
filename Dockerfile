# PICKLEBOX — Next.js standalone + Prisma(SQLite) + 관리자 CMS
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# 빌드용 seed DB 생성: 정적 페이지가 빌드 시 콘텐츠(굿즈 등)를 읽을 수 있게 하고,
# 런타임 볼륨 초기화에도 재사용한다. (런타임에 prisma CLI 불필요)
ENV DATABASE_URL="file:/app/seed/picklebox.db"
RUN mkdir -p /app/seed \
 && npx prisma generate \
 && npx prisma db push --skip-generate \
 && node prisma/seed.js \
 && npx next build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# 스키마·초기데이터가 담긴 seed DB(최초 실행 시 볼륨으로 복사)
COPY --from=builder /app/seed/picklebox.db ./seed-picklebox.db
# 기존 운영 DB 스키마 반영(migrate) + 문구 upsert(seed) 스크립트. @prisma/client 는 standalone 에 포함됨.
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
