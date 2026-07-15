import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { getModel, coerceValue } from "../../../../lib/adminModels";
import { revalidateFor } from "../../../../lib/revalidate";

export async function PATCH(req, { params }) {
  const { model, id } = await params;
  const cfg = getModel(model);
  if (!cfg) return NextResponse.json({ error: "unknown model" }, { status: 404 });
  const rid = parseInt(id, 10);
  const body = await req.json().catch(() => ({}));
  const delegate = db[cfg.prisma];

  // 노출 토글
  if (body.action === "toggle" && cfg.hasVisible) {
    const cur = await delegate.findUnique({ where: { id: rid } });
    if (!cur) return NextResponse.json({ error: "not found" }, { status: 404 });
    const row = await delegate.update({ where: { id: rid }, data: { visible: !cur.visible } });
    revalidateFor(cfg.slug);
    return NextResponse.json({ row });
  }

  // 순서 이동(인접 항목과 sortOrder 교환)
  if (body.action === "move" && cfg.ordered) {
    const cur = await delegate.findUnique({ where: { id: rid } });
    if (!cur) return NextResponse.json({ error: "not found" }, { status: 404 });
    const up = body.dir === "up";
    const neighbor = await delegate.findFirst({
      where: up ? { sortOrder: { lt: cur.sortOrder } } : { sortOrder: { gt: cur.sortOrder } },
      orderBy: { sortOrder: up ? "desc" : "asc" },
    });
    if (neighbor) {
      await db.$transaction([
        delegate.update({ where: { id: cur.id }, data: { sortOrder: neighbor.sortOrder } }),
        delegate.update({ where: { id: neighbor.id }, data: { sortOrder: cur.sortOrder } }),
      ]);
      revalidateFor(cfg.slug);
    }
    return NextResponse.json({ ok: true });
  }

  // 필드 수정
  const data = {};
  for (const f of cfg.fields) {
    if (f.readOnly) continue;
    if (f.key in body) data[f.key] = coerceValue(f, body[f.key]);
  }
  const row = await delegate.update({ where: { id: rid }, data });
  revalidateFor(cfg.slug);
  return NextResponse.json({ row });
}

export async function DELETE(_req, { params }) {
  const { model, id } = await params;
  const cfg = getModel(model);
  if (!cfg) return NextResponse.json({ error: "unknown model" }, { status: 404 });
  if (!cfg.canDelete) return NextResponse.json({ error: "삭제할 수 없는 항목입니다." }, { status: 400 });
  await db[cfg.prisma].delete({ where: { id: parseInt(id, 10) } });
  revalidateFor(cfg.slug);
  return NextResponse.json({ ok: true });
}
