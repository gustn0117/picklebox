import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { db } from "../lib/db";
import { getCopy, pick } from "../lib/copy";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "굿즈 — PICKLEBOX",
  description: "피클박스가 고른 피클볼 굿즈. 패들부터 웨어까지.",
};

export default async function Goods() {
  const [items, c] = await Promise.all([
    db.goods.findMany({ where: { visible: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    getCopy("goods"),
  ]);

  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Goods"
        title={pick(c, "goods.hero.title", "피클박스 굿즈.")}
        lead={pick(c, "goods.hero.lead", "코트 위에서도, 일상에서도. 피클박스가 고른 피클볼 굿즈를 만나보세요.")}
      />

      <section className="section">
        <div className="wrap">
          {items.length === 0 ? (
            <div className="shop-empty">{pick(c, "goods.empty", "준비 중입니다. 곧 새로운 굿즈로 찾아뵙겠습니다.")}</div>
          ) : (
            <div className="shop-grid">
              {items.map((g, i) => (
                <Reveal key={g.id} className="shop-card" delay={(i % 3) * 70}>
                  <div className="shop-card__thumb">
                    {g.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={g.imageUrl} alt="" loading="lazy" />
                    ) : (
                      <span className="shop-card__ph">PICKLEBOX</span>
                    )}
                    {g.soldOut && <span className="shop-card__sold">품절</span>}
                  </div>
                  <div className="shop-card__body">
                    <h3 className="shop-card__name">{g.name}</h3>
                    {g.description && <p className="shop-card__desc">{g.description}</p>}
                    <div className="shop-card__foot">
                      {typeof g.price === "number" && (
                        <span className="shop-card__price">{g.price.toLocaleString()}원</span>
                      )}
                      {g.buyUrl && !g.soldOut && (
                        <a href={g.buyUrl} target="_blank" rel="noopener" className="btn btn--primary shop-card__btn">
                          구매하기 <Arrow />
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
