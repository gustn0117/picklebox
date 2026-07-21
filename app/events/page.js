import Link from "next/link";
import Nav from "../components/Nav";
import Sections from "../components/Sections";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { reserveHref } from "../lib/site";
import { db } from "../lib/db";
import { contentWhere, isPreview } from "../lib/publicWhere";
import { getCopy, pick } from "../lib/copy";
import Multiline from "../components/Multiline";
import RichHtml from "../components/RichHtml";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events — PICKLEBOX",
  description: "셀럽·커뮤니티·컬처가 만나는 피클박스 이벤트. 셀럽 매치, 오픈 토너먼트, 피클 파티까지.",
};

export default async function Events({ searchParams }) {
  const preview = await isPreview(searchParams);
  const WHERE = contentWhere(preview);
  const [events, c] = await Promise.all([
    db.event.findMany({ where: WHERE, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    getCopy("events"),
  ]);
  const lineup = events.filter((e) => e.kind === "lineup");
  const schedule = events.filter((e) => e.kind === "schedule");

  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Events"
        title={pick(c, "events.hero.title", "코트 위의 축제, 피클박스 이벤트.")}
        lead={pick(c, "events.hero.lead", "셀럽·커뮤니티·컬처가 한 코트에서 만납니다. 셀럽 매치부터 오픈 토너먼트, 피클볼까지 — 서울의 새로운 스포츠 엔터테인먼트.")}
      />

      <Sections page="events" position="top" preview={preview} />

      {/* ── NEXT UP 피처 ── */}
      <section className="section">
        <div className="wrap">
          <Reveal
            className="feature-card"
            style={{ backgroundImage: "url(/assets/join-lounge-court.webp)" }}
          >
            <span className="feature-card__tag">// Next Up</span>
            <h2 className="feature-card__title"><Multiline text={pick(c, "events.next.title", "Seoul Celebrity\nPickleball Open")} /></h2>
            <p className="feature-card__meta">{pick(c, "events.next.meta", "광나루 · 서울 / [2026 상반기]")}</p>
<p className="feature-card__desc">{pick(c, "events.next.desc", "셀럽과 동호인이 한 코트에서 만나는 서울 최대 규모의 셀럽 피클볼 오픈. 참가 신청과 일정은 순차 공개됩니다.")}</p>
            <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--primary">
              참가·문의하기 <Arrow />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── 라인업 ── */}
      {lineup.length > 0 && (
        <section className="section section--alt">
          <div className="wrap">
            <div className="section__head section__head--split">
              <div><div className="eyebrow">Lineup</div></div>
              <div><h2 className="title">{pick(c, "events.lineup.title", "이렇게 즐기는 이벤트.")}</h2></div>
            </div>
            <div className="grid-2">
              {lineup.map((e, i) => (
                <Reveal key={e.id} className="feat" delay={(i % 2) * 80}>
                  <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                  <h3>{e.titleEn ? `${e.titleEn} · ` : ""}{e.titleKo}</h3>
                  <RichHtml text={e.description} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 일정 ── */}
      {schedule.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section__head section__head--split">
              <div><div className="eyebrow">Schedule</div></div>
              <div><h2 className="title">{pick(c, "events.schedule.title", "다가오는 일정.")}</h2></div>
            </div>
            <ul className="timeline">
              {schedule.map((t) => (
                <li key={t.id}>
                  <span className="yr">{t.period ? `[${t.period}]` : ""}</span>
                  <span className="ev"><b>{t.titleKo}</b><span>{t.description}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Sections page="events" position="bottom" preview={preview} />

      {/* ── CTA ── */}
      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Join the Game</div>
              <h2 className="join__card--en">{pick(c, "events.cta.title", "Play the Culture.")}</h2>
              <p>{pick(c, "events.cta.desc", "이벤트 참가·초청·제휴 문의를 남겨주시면 순차 안내해 드립니다.")}</p>
            </div>
            <div className="join__actions">
              <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--lime">
                참가·문의하기 <Arrow />
              </a>
              <Link href="/partners" className="btn btn--ghost">파트너 제안</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
