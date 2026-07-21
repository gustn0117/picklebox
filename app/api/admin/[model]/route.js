import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { getModel, coerceValue } from "../../../lib/adminModels";
import { revalidateFor } from "../../../lib/revalidate";

export async function GET(_req, { params }) {
  const { model } = await params;
  const cfg = getModel(model);
  if (!cfg) return NextResponse.json({ error: "unknown model" }, { status: 404 });
  const orderBy = cfg.ordered ? [{ sortOrder: "asc" }, { id: "asc" }] : [{ id: "asc" }];
  const rows = await db[cfg.prisma].findMany({ orderBy });
  return NextResponse.json({ rows });
}

// 드래그로 바뀐 순서를 한 번에 저장
export async function PATCH(req, { params }) {
  const { model } = await params;
  const cfg = getModel(model);
  if (!cfg) return NextResponse.json({ error: "unknown model" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  if (body.action !== "reorder" || !Array.isArray(body.ids) || !cfg.ordered) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const ids = body.ids.map((n) => parseInt(n, 10)).filter(Number.isFinite);
  await db.$transaction(
    ids.map((id, i) => db[cfg.prisma].update({ where: { id }, data: { sortOrder: i } }))
  );
  revalidateFor(cfg.slug);
  return NextResponse.json({ ok: true });
}

export async function POST(req, { params }) {
  const { model } = await params;
  const cfg = getModel(model);
  if (!cfg) return NextResponse.json({ error: "unknown model" }, { status: 404 });
  if (!cfg.canCreate) return NextResponse.json({ error: "생성할 수 없는 항목입니다." }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  const data = {};
  for (const f of cfg.fields) {
    if (f.readOnly) continue;
    if (f.key in body) data[f.key] = coerceValue(f, body[f.key]);
  }
  if (cfg.ordered) {
    const max = await db[cfg.prisma].aggregate({ _max: { sortOrder: true } });
    data.sortOrder = (max._max.sortOrder ?? -1) + 1;
  }
  const row = await db[cfg.prisma].create({ data });
  revalidateFor(cfg.slug);
  return NextResponse.json({ row });
}
