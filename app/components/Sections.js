import { db } from "../lib/db";
import { contentWhere } from "../lib/publicWhere";
import Reveal from "./Reveal";
import Arrow from "./Arrow";
import RichHtml from "./RichHtml";

// 관리자가 추가한 섹션을 페이지의 지정 위치에 렌더한다.
// 사이트 기존 CSS 클래스를 그대로 써서 디자인 일관성을 유지한다.
function parseCards(raw) {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default async function Sections({ page, position = "bottom", preview = false }) {
  let rows = [];
  try {
    rows = await db.section.findMany({
      where: { page, position, ...contentWhere(preview) },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
  } catch {
    return null;
  }
  if (!rows.length) return null;

  return (
    <>
      {rows.map((s) => {
        const alt = s.altBg ? " section--alt" : "";
        const head = (s.eyebrow || s.title) && (
          <div className="section__head section__head--split">
            <div>{s.eyebrow ? <div className="eyebrow">{s.eyebrow}</div> : null}</div>
            <div>{s.title ? <h2 className="title title--sm">{s.title}</h2> : null}</div>
          </div>
        );

        // ── 이미지 배너
        if (s.type === "image") {
          if (!s.imageUrl) return null;
          const Inner = (
            <div className="promo__body">
              {s.title && <h2 className="promo__title">{s.title}</h2>}
              {s.body && <RichHtml text={s.body} className="promo__sub" />}
              {s.linkUrl && <span className="promo__go">{s.linkLabel || "자세히 보기"} <Arrow /></span>}
            </div>
          );
          return (
            <section className={`section${alt}`} key={s.id}>
              <div className="wrap">
                {s.linkUrl ? (
                  <a className="promo" href={s.linkUrl} target="_blank" rel="noopener" style={{ backgroundImage: `url(${s.imageUrl})` }}>{Inner}</a>
                ) : (
                  <div className="promo" style={{ backgroundImage: `url(${s.imageUrl})` }}>{Inner}</div>
                )}
              </div>
            </section>
          );
        }

        // ── 안내 배너(CTA)
        if (s.type === "cta") {
          return (
            <section className="section join" key={s.id}>
              <div className="wrap">
                <Reveal className="join__card">
                  <div>
                    {s.eyebrow && <div className="eyebrow" style={{ marginBottom: 20 }}>{s.eyebrow}</div>}
                    {s.title && <h2>{s.title}</h2>}
                    {s.body && <RichHtml text={s.body} />}
                  </div>
                  {s.linkUrl && (
                    <div className="join__actions">
                      <a href={s.linkUrl} target="_blank" rel="noopener" className="btn btn--lime">
                        {s.linkLabel || "자세히 보기"} <Arrow />
                      </a>
                    </div>
                  )}
                </Reveal>
              </div>
            </section>
          );
        }

        // ── 카드 목록
        if (s.type === "cards") {
          const cards = parseCards(s.cards);
          if (!cards.length) return null;
          const cols = cards.length <= 2 ? "grid-2" : "grid-3";
          return (
            <section className={`section${alt}`} key={s.id}>
              <div className="wrap">
                {head}
                <div className={cols}>
                  {cards.map((c, i) => {
                    const inner = (
                      <>
                        {c.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img className="feat__img" src={c.imageUrl} alt="" loading="lazy" />
                        )}
                        <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                        {c.title && <h3>{c.title}</h3>}
                        {c.description && <RichHtml text={c.description} />}
                        {c.linkUrl && <span className="bento__go">자세히 보기 <Arrow /></span>}
                      </>
                    );
                    return c.linkUrl ? (
                      <Reveal as="a" href={c.linkUrl} target="_blank" rel="noopener" key={i} className="feat" delay={(i % 3) * 70}>{inner}</Reveal>
                    ) : (
                      <Reveal key={i} className="feat" delay={(i % 3) * 70}>{inner}</Reveal>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }

        // ── 글(기본)
        return (
          <section className={`section${alt}`} key={s.id}>
            <div className="wrap">
              {head}
              <div className="section__text">
                <RichHtml text={s.body} />
                {s.linkUrl && (
                  <a href={s.linkUrl} target="_blank" rel="noopener" className="btn btn--ghost" style={{ marginTop: 18 }}>
                    {s.linkLabel || "자세히 보기"} <Arrow />
                  </a>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
