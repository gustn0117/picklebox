import { db } from "./db";

const KEEP = 20; // 항목당 보관할 이력 수

// 수정·삭제 "직전" 상태를 스냅샷으로 남긴다.
export async function saveRevision(modelSlug, record, action = "update") {
  if (!record) return;
  try {
    await db.revision.create({
      data: {
        model: modelSlug,
        recordId: record.id,
        action,
        snapshot: JSON.stringify(record),
      },
    });
    // 오래된 이력 정리
    const old = await db.revision.findMany({
      where: { model: modelSlug, recordId: record.id },
      orderBy: { createdAt: "desc" },
      skip: KEEP,
      select: { id: true },
    });
    if (old.length) {
      await db.revision.deleteMany({ where: { id: { in: old.map((r) => r.id) } } });
    }
  } catch {
    // 이력 저장 실패가 본 작업을 막지 않도록 무시
  }
}

export async function listRevisions(modelSlug, recordId) {
  try {
    return await db.revision.findMany({
      where: { model: modelSlug, recordId },
      orderBy: { createdAt: "desc" },
      take: KEEP,
    });
  } catch {
    return [];
  }
}

// 스냅샷에서 되돌릴 수 있는 필드만 뽑는다(id·시각 등 제외).
export function restorableData(snapshotJson, fields) {
  let snap;
  try { snap = JSON.parse(snapshotJson); } catch { return null; }
  const data = {};
  for (const f of fields) {
    if (f.readOnly) continue;
    if (f.key in snap) data[f.key] = snap[f.key];
  }
  return data;
}
