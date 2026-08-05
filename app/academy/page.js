import Nav from "../components/Nav";
import Sections from "../components/Sections";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { reserveHref } from "../lib/site";
import { db } from "../lib/db";
import { contentWhere, isPreview } from "../lib/publicWhere";
import { getCopy, pick, getCopyValue } from "../lib/copy";
import RichHtml from "../components/RichHtml";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: await getCopyValue("seo.academy", "아카데미 — PICKLEBOX"),
    description: "체계적인 레슨 프로그램과 검증된 코치진. 입문부터 실전까지 함께하는 PICKLEBOX 아카데미.",
  };
}

export default async function Academy({ searchParams }) {
  const preview = await isPreview(searchParams);
  const WHERE = contentWhere(preview);
  const [programs, coaches, c] = await Promise.all([
    db.academyProgram.findMany({ where: WHERE, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    db.coach.findMany({ where: WHERE, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    getCopy("academy"),
  ]);

  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Academy"
        title={pick(c, "academy.hero.title", "레슨으로 시작하는 피클볼.")}
        lead={pick(c, "academy.hero.lead", "처음이어도 괜찮습니다. 체계적인 레슨 프로그램과 검증된 코치진이 첫 랠리부터 함께합니다.")}
      />

      <Sections page="academy" position="top" preview={preview} />

      {/* ── 레슨 프로그램 ── */}
      <section className="section" id="programs">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Programs</div></div>
            <div>
              <h2 className="title title--sm">{pick(c, "academy.programs.title", "레슨 프로그램")}</h2>
              <p className="lead">{pick(c, "academy.programs.lead", "입문부터 실전까지, 목표와 수준에 맞춘 프로그램을 준비했습니다.")}</p>
            </div>
          </div>
          {programs.length === 0 ? (
            <div className="shop-empty">{pick(c, "academy.programs.empty", "레슨 프로그램을 준비 중입니다. 곧 안내해 드리겠습니다.")}</div>
          ) : (
            <div className="grid-3">
              {programs.map((a, i) => (
                <Reveal key={a.id} className="feat" delay={(i % 3) * 70}>
                  {a.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="feat__img" src={a.imageUrl} alt="" loading="lazy" />
                  )}
                  <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                  <h3>{a.titleEn ? `${a.titleEn} · ` : ""}{a.titleKo}</h3>
                  {a.description && <RichHtml text={a.description} />}
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 코치진 ── */}
      <section className="section section--alt" id="coaches">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Coaches</div></div>
            <div>
              <h2 className="title title--sm">{pick(c, "academy.coaches.title", "코치진")}</h2>
              <p className="lead">{pick(c, "academy.coaches.lead", "풍부한 경력과 노하우로 여러분의 성장을 이끄는 피클박스 코치진을 소개합니다.")}</p>
            </div>
          </div>
          {coaches.length === 0 ? (
            <div className="shop-empty">{pick(c, "academy.coaches.empty", "코치진 소개를 준비 중입니다.")}</div>
          ) : (
            <div className="coach-grid">
              {coaches.map((co, i) => (
                <Reveal key={co.id} className="coach-card" delay={(i % 3) * 70}>
                  <div className="coach-card__photo" style={co.imageUrl ? { backgroundImage: `url(${co.imageUrl})` } : undefined}>
                    {!co.imageUrl && <span className="coach-card__ph">PICKLEBOX</span>}
                  </div>
                  <div className="coach-card__body">
                    {co.role && <div className="coach-card__role">{co.role}</div>}
                    <h3 className="coach-card__name">{co.name}</h3>
                    {co.career && <RichHtml text={co.career} className="coach-card__career" />}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <Sections page="academy" position="bottom" preview={preview} />

      {/* ── CTA ── */}
      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <h2 className="join__card--en">{pick(c, "academy.cta.title", "레슨, 지금 시작하세요.")}</h2>
              <p>{pick(c, "academy.cta.desc", "수준·일정 상담과 예약을 도와드립니다. 편하게 문의해 주세요.")}</p>
            </div>
            <div className="join__actions">
              <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--lime">
                레슨 예약 · 문의 <Arrow />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
