#!/bin/sh
set -e

# 업로드·DB 디렉토리 보장(볼륨 /app/data)
mkdir -p /app/data /app/data/uploads

# 최초 실행: 볼륨에 DB가 없으면 seed DB 복사(스키마+초기 콘텐츠).
# 이미 있으면 그대로 사용 → 관리자에서 수정한 내용이 재배포에도 보존됨.
if [ ! -f /app/data/picklebox.db ]; then
  echo "[entrypoint] 초기 DB를 seed로 생성합니다."
  cp /app/seed-picklebox.db /app/data/picklebox.db
else
  echo "[entrypoint] 기존 DB를 사용합니다(콘텐츠 보존)."
fi

exec node server.js
