#!/bin/sh
set -e

# 업로드·DB 디렉토리 보장(볼륨 /app/data)
mkdir -p /app/data /app/data/uploads

if [ ! -f /app/data/picklebox.db ]; then
  # 최초 실행: 스키마 + 초기 콘텐츠가 담긴 seed DB 복사
  echo "[entrypoint] 초기 DB를 seed로 생성합니다."
  cp /app/seed-picklebox.db /app/data/picklebox.db
else
  # 기존 DB 유지 + 스키마 변경분만 반영(컬럼·테이블 추가). 데이터는 보존된다.
  echo "[entrypoint] 기존 DB 사용 — 스키마 변경분을 반영합니다."
  node prisma/migrate.js || echo "[entrypoint] ⚠ 스키마 반영 실패 — 기존 스키마로 계속 진행합니다."
fi

# 새로 추가된 문구 항목 보장(기존에 수정한 문구 값은 덮어쓰지 않음)
node prisma/seed.js || echo "[entrypoint] ⚠ seed 건너뜀"

exec node server.js
