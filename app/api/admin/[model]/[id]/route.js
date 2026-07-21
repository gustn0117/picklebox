import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { getModel, coerceValue } from "../../../../lib/adminModels";
import { revalidateFor } from "../../../../lib/revalidate";
import { saveRevision, listRevisions, restorableData } from "../../../../lib/revision";

export async function GET(req, { params }) {
  const { model, id } = await params;
  const cfg = getModel(model);
  if (!cfg) return NextResponse.json({ error: "unknown model" }, { status: 404 });
  // 수정 이력 조회
  if (new URL(req.url).searchParams.get("revisions") === "1") {
    return NextResponse.json({ revisions: await listRevisions(cfg.slug, parseInt(id, 10)) });
  }
  const row = await db[cfg.prisma].findUnique({ where: { id: parseInt(id, 10) } });
  return NextResponse.json({ row });
}

export async function PATCH(req, { params }) {
  const { model, id } = await params;
  const cfg = getModel(model);
  if (!cfg) return NextResponse.json({ error: "unknown model" }, { status: 404 });
  const rid = parseInt(id, 10);
  const body = await req.json().catch(() => ({}));
  const delegate = db[cfg.prisma];
  const current = await delegate.findUnique({ where: { id: rid } });
  if (!current) return NextResponse.json({ error: "not found" }, { status: 404 });

  // 노출 토글
  if (body.action === "toggle" && cfg.hasVisible) {
    await saveRevision(cfg.slug, current);
    const row = await delegate.update({ where: { id: rid }, data: { visible: !current.visible } });
    revalidateFor(cfg.slug);
    return NextResponse.json({ row });
  }

  // 휴지통에서 복구
  if (body.action === "restore" && cfg.canDelete) {
    const row = await delegate.update({ where: { id: rid }, data: { deletedAt: null } });
    revalidateFor(cfg.slug);
    return NextResponse.json({ row });
  }

  // 이력으로 되돌리기
  if (body.action === "revert") {
    const revs = await listRevisions(cfg.slug, rid);
    const rev = revs.find((r) => r.id === parseInt(body.revisionId, 10));
    if (!rev) return NextResponse.json({ error: "이력을 찾을 수 없습니다." }, { status: 404 });
    const data = restorableData(rev.snapshot, cfg.fields);
    if (!data) return NextResponse.json({ error: "이력을 읽을 수 없습니다." }, { status: 400 });
    await saveRevision(cfg.slug, current);
    const row = await delegate.update({ where: { id: rid }, data });
    revalidateFor(cfg.slug);
    return NextResponse.json({ row });
  }

  // 순서 이동(인접 항목과 sortOrder 교환)
  if (body.action === "move" && cfg.ordered) {
    const up = body.dir === "up";
    const neighbor = await delegate.findFirst({
      where: {
        deletedAt: null,
        sortOrder: up ? { lt: current.sortOrder } : { gt: current.sortOrder },
      },
      orderBy: { sortOrder: up ? "desc" : "asc" },
    });
    if (neighbor) {
      await db.$transaction([
        delegate.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
        delegate.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
      ]);
      revalidateFor(cfg.slug);
    }
    return NextResponse.json({ ok: true });
  }

  // 필드 수정 (직전 상태를 이력으로 남김)
  const data = {};
  for (const f of cfg.fields) {
    if (f.readOnly) continue;
    if (f.key in body) data[f.key] = coerceValue(f, body[f.key]);
  }
  if ("visible" in body && cfg.hasVisible) data.visible = !!body.visible;
  if ("publishAt" in body && cfg.hasVisible) {
    const v = String(body.publishAt || "").trim();
    data.publishAt = v ? new Date(v) : null;
  }
  await saveRevision(cfg.slug, current);
  const row = await delegate.update({ where: { id: rid }, data });
  revalidateFor(cfg.slug);
  return NextResponse.json({ row });
}

export async function DELETE(req, { params }) {
  const { model, id } = await params;
  const cfg = getModel(model);
  if (!cfg) return NextResponse.json({ error: "unknown model" }, { status: 404 });
  if (!cfg.canDelete) return NextResponse.json({ error: "삭제할 수 없는 항목입니다." }, { status: 400 });
  const rid = parseInt(id, 10);
  const purge = new URL(req.url).searchParams.get("purge") === "1";

  if (purge) {
    // 휴지통에서 영구 삭제
    await db[cfg.prisma].delete({ where: { id: rid } });
    await db.revision.deleteMany({ where: { model: cfg.slug, recordId: rid } }).catch(() => {});
  } else {
    // 기본: 휴지통으로 이동(복구 가능)
    const current = await db[cfg.prisma].findUnique({ where: { id: rid } });
    await saveRevision(cfg.slug, current, "delete");
    await db[cfg.prisma].update({ where: { id: rid }, data: { deletedAt: new Date() } });
  }
  revalidateFor(cfg.slug);
  return NextResponse.json({ ok: true });
}
