import Nav from "../components/Nav";
import Sections from "../components/Sections";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { db } from "../lib/db";
import { contentWhere, isPreview } from "../lib/publicWhere";
import { getCopy, pick } from "../lib/copy";
import RichHtml from "../components/RichHtml";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "투어 — PICKLEBOX",
  description: "코트를 넘어 떠나는 피클볼 투어. 일정과 가격, 예약 안내.",
};

export default async function Tours({ searchParams }) {
  const preview = await isPreview(searchParams);
  const WHERE = contentWhere(preview);
  const [items, c] = await Promise.all([
    db.tour.findMany({ where: WHERE, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    getCopy("tours"),
  ]);

  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Tour"
        title={pick(c, "tours.hero.title", "피클볼 투어.")}
        lead={pick(c, "tours.hero.lead", "코트를 넘어 떠나는 여행. 피클볼과 함께하는 특별한 일정으로 안내합니다.")}
      />

      <Sections page="tours" position="top" preview={preview} />

      <section className="section">
        <div className="wrap">
          {items.length === 0 ? (
            <div className="shop-empty">{pick(c, "tours.empty", "준비 중입니다. 곧 새로운 투어로 찾아뵙겠습니다.")}</div>
          ) : (
            <div className="tour-list">
              {items.map((t, i) => {
                const days = String(t.schedule || "").split("\n").map((s) => s.trim()).filter(Boolean);
                return (
                  <Reveal key={t.id} className="tour-card" delay={(i % 2) * 80}>
                    <div className="tour-card__media">
                      {t.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.imageUrl} alt="" loading="lazy" />
                      ) : (
                        <span className="shop-card__ph">PICKLEBOX TOUR</span>
                      )}
                    </div>
                    <div className="tour-card__body">
                      <h3 className="tour-card__title">{t.title}</h3>
                      <div className="tour-card__meta">
                        {t.period && <span className="tour-card__period">{t.period}</span>}
                        {typeof t.price === "number" && (
                          <span className="tour-card__price">{t.price.toLocaleString()}원</span>
                        )}
                      </div>
                      {t.description && <RichHtml text={t.description} className="tour-card__desc" />}
                      {days.length > 0 && (
                        <ul className="tour-card__days">
                          {days.map((d, k) => (
                            <li key={k}><span className="tour-card__daynum">{String(k + 1).padStart(2, "0")}</span>{d}</li>
                          ))}
                        </ul>
                      )}
                      <div className="tour-card__actions">
                        {t.bookingUrl && (
                          <a href={t.bookingUrl} target="_blank" rel="noopener" className="btn btn--primary">
                            예약하기 <Arrow />
                          </a>
                        )}
                        {t.linkUrl && (
                          <a href={t.linkUrl} target="_blank" rel="noopener" className="btn btn--ghost">자세히 보기</a>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Sections page="tours" position="bottom" preview={preview} />

      <Footer />
    </>
  );
}
