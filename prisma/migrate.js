// 기존 운영 DB에 스키마 변경분(테이블·컬럼 추가)을 반영한다. 데이터는 보존된다.
// prisma CLI 없이 @prisma/client 만으로 동작하도록 SQLite DDL을 직접 실행한다(멱등).
// 새 컬럼/테이블이 생기면 아래 정의에 한 줄만 추가하면 된다.
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

// 없으면 만들 테이블
const TABLES = {
  Revision: `CREATE TABLE IF NOT EXISTS "Revision" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,
    "snapshot" TEXT NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'update',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  Partner: `CREATE TABLE IF NOT EXISTS "Partner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "linkUrl" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
};

// 없으면 추가할 컬럼 (테이블 → 컬럼 → 타입/기본값)
const SCHEDULE_COLS = { publishAt: "DATETIME", deletedAt: "DATETIME" };

const COLUMNS = {
  Banner: { ...SCHEDULE_COLS },
  Event: { ...SCHEDULE_COLS },
  AcademyProgram: { ...SCHEDULE_COLS },
  Partner: { ...SCHEDULE_COLS },
  JournalPost: { ...SCHEDULE_COLS },
  Photo: { ...SCHEDULE_COLS },
  SiteCopy: {
    group: "TEXT NOT NULL DEFAULT 'site'",
    kind: "TEXT NOT NULL DEFAULT 'text'",
    sortOrder: "INTEGER NOT NULL DEFAULT 0",
  },
  Goods: {
    price: "INTEGER",
    soldOut: "BOOLEAN NOT NULL DEFAULT 0",
    ...SCHEDULE_COLS,
  },
  Tour: {
    price: "INTEGER",
    schedule: "TEXT NOT NULL DEFAULT ''",
    bookingUrl: "TEXT",
    ...SCHEDULE_COLS,
  },
};

async function main() {
  let changes = 0;

  for (const [table, sql] of Object.entries(TABLES)) {
    await db.$executeRawUnsafe(sql);
  }
  await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Revision_model_recordId_idx" ON "Revision"("model", "recordId")`);

  for (const [table, cols] of Object.entries(COLUMNS)) {
    let info;
    try {
      info = await db.$queryRawUnsafe(`PRAGMA table_info("${table}")`);
    } catch {
      continue; // 테이블 자체가 없으면 건너뜀(첫 배포는 seed DB가 이미 최신)
    }
    const have = new Set(info.map((r) => r.name));
    for (const [col, type] of Object.entries(cols)) {
      if (!have.has(col)) {
        await db.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "${col}" ${type}`);
        console.log(`  + ${table}.${col} 컬럼 추가`);
        changes++;
      }
    }
  }

  console.log(changes ? `  스키마 반영 완료(${changes}건)` : "  스키마 변경 없음");
}

main()
  .catch((e) => { console.error("[migrate] 실패:", e.message); process.exit(1); })
  .finally(() => db.$disconnect());
