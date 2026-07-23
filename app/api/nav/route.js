import { NextResponse } from "next/server";
import { db } from "../../lib/db";
import { publishedWhere } from "../../lib/publicWhere";

// 상단 메뉴 드롭다운용 — 각 콘텐츠의 최근 노출 항목을 반환(공개).
export const dynamic = "force-dynamic";

const take = 6;
const firstVideo = (raw) => { try { const v = JSON.parse(raw || "[]"); return v[0]; } catch { return null; } };

export async function GET() {
  try {
    const where = publishedWhere();
    const order = [{ sortOrder: "asc" }, { id: "asc" }];
    const [events, goods, tours, journal, navCopy] = await Promise.all([
      db.event.findMany({ where, orderBy: order, take }),
      db.goods.findMany({ where, orderBy: order, take }),
      db.tour.findMany({ where, orderBy: order, take }),
      db.journalPost.findMany({ where, orderBy: order, take }),
      db.siteCopy.findMany({ where: { group: "nav" } }),
    ]);
    const labels = {};
    for (const r of navCopy) if (r.value && r.value.trim()) labels[r.key] = r.value;
    return NextResponse.json({
      labels,
      events: events.map((e) => ({ label: e.titleKo, href: "/events" })),
      goods: goods.map((g) => ({ label: g.name, href: g.buyUrl || "/goods", external: !!g.buyUrl })),
      tours: tours.map((t) => ({ label: t.title, href: "/tours" })),
      journal: journal.map((p) => {
        const vid = firstVideo(p.videoIds);
        const href = p.articleUrl || (vid ? `https://youtu.be/${vid}` : "/journal");
        return { label: p.title, href, external: !!(p.articleUrl || vid) };
      }),
    });
  } catch {
    return NextResponse.json({ labels: {}, events: [], goods: [], tours: [], journal: [] });
  }
}
