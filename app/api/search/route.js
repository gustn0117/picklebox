import { NextResponse } from "next/server";
import { db } from "../../lib/db";
import { publishedWhere } from "../../lib/publicWhere";

// 사이트 콘텐츠 통합 검색(공개). 제목·설명 등에서 키워드를 찾아 그룹별로 반환.
export const dynamic = "force-dynamic";

const firstVideo = (raw) => { try { const v = JSON.parse(raw || "[]"); return v[0]; } catch { return null; } };
const strip = (html) => String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export async function GET(req) {
  const q = (new URL(req.url).searchParams.get("q") || "").trim();
  if (q.length < 1) return NextResponse.json({ groups: [] });

  const like = { contains: q };
  const pub = publishedWhere();
  const take = 6;

  try {
    const [events, goods, tours, journal, academy, partners] = await Promise.all([
      db.event.findMany({ where: { ...pub, OR: [{ titleKo: like }, { titleEn: like }, { description: like }] }, take }),
      db.goods.findMany({ where: { ...pub, OR: [{ name: like }, { description: like }] }, take }),
      db.tour.findMany({ where: { ...pub, OR: [{ title: like }, { description: like }, { schedule: like }] }, take }),
      db.journalPost.findMany({ where: { ...pub, OR: [{ title: like }, { category: like }] }, take }),
      db.academyProgram.findMany({ where: { ...pub, OR: [{ titleKo: like }, { titleEn: like }, { description: like }] }, take }),
      db.partner.findMany({ where: { ...pub, OR: [{ name: like }, { description: like }] }, take }),
    ]);

    const groups = [];
    const add = (label, items) => { if (items.length) groups.push({ label, items }); };

    add("이벤트", events.map((e) => ({ title: `${e.titleEn ? e.titleEn + " · " : ""}${e.titleKo}`, sub: strip(e.description).slice(0, 60), href: "/events" })));
    add("굿즈", goods.map((g) => ({ title: g.name, sub: strip(g.description).slice(0, 60), href: g.buyUrl || "/goods", external: !!g.buyUrl })));
    add("투어", tours.map((t) => ({ title: t.title, sub: strip(t.description).slice(0, 60), href: "/tours" })));
    add("저널", journal.map((p) => {
      const vid = firstVideo(p.videoIds);
      return { title: p.title, sub: p.category, href: p.articleUrl || (vid ? `https://youtu.be/${vid}` : "/journal"), external: !!(p.articleUrl || vid) };
    }));
    add("아카데미", academy.map((a) => ({ title: a.titleKo, sub: strip(a.description).slice(0, 60), href: "/about" })));
    add("파트너", partners.map((p) => ({ title: p.name, sub: strip(p.description).slice(0, 60), href: p.linkUrl || "/partners", external: !!p.linkUrl })));

    return NextResponse.json({ groups });
  } catch {
    return NextResponse.json({ groups: [] });
  }
}
