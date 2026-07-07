import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { reserveHref } from "../lib/site";

export const metadata = {
  title: "Events — PICKLEBOX",
  description: "셀럽·커뮤니티·컬처가 만나는 피클박스 이벤트. 셀럽 매치, 오픈 토너먼트, 피클 파티까지.",
};

const LINEUP = [
  { k: "Celebrity Match", ko: "셀럽 매치", p: "방송인·인플루언서와 함께하는 이벤트 매치. 관전과 참여를 동시에." },
  { k: "Open Tournament", ko: "오픈 토너먼트", p: "레벨별로 겨루는 정식 토너먼트. 초보부터 상급까지 누구나." },
  { k: "PICKLEBOX Party", ko: "피클박스 파티", p: "경기 후 이어지는 브랜드 파티. 음악·굿즈·네트워킹까지." },
];

const SCHEDULE = [
  { yr: "[상반기]", h: "Seoul Celebrity Open", p: "광나루 · 셀럽 초청 오픈 매치 · [일정·라인업 공개 예정]" },
  { yr: "[매월]", h: "Monthly Open Match", p: "정기 오픈 매치 · 레벨별 참가 · 커뮤니티 랭킹" },
  { yr: "[수시]", h: "Pickle Party Night", p: "브랜드 파티 · 음악 · 네트워킹" },
];

export default function Events() {
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Events"
        title="코트 위의 축제, 피클박스 이벤트."
        lead="셀럽·커뮤니티·컬처가 한 코트에서 만납니다. 셀럽 매치부터 오픈 토너먼트, 피클볼까지 — 서울의 새로운 스포츠 엔터테인먼트."
      />

      {/* ── NEXT UP 피처 ── */}
      <section className="section">
        <div className="wrap">
          <Reveal
            className="feature-card"
            style={{ backgroundImage: "url(/assets/join-lounge-court.webp)" }}
          >
            <span className="feature-card__tag">// Next Up</span>
            <h2 className="feature-card__title">Seoul Celebrity<br />Pickleball Open</h2>
            <p className="feature-card__meta">광나루 · 서울 &nbsp;/&nbsp; [2026 상반기]</p>
            <p className="feature-card__desc">
              셀럽과 동호인이 한 코트에서 만나는 서울 최대 규모의 셀럽 피클볼 오픈.
              참가 신청과 일정은 순차 공개됩니다.
            </p>
            <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--primary">
              참가·문의하기 <Arrow />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── 라인업 ── */}
      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Lineup</div></div>
            <div><h2 className="title">세 가지 방식으로 즐기는 이벤트.</h2></div>
          </div>
          <div className="grid-2">
            {LINEUP.map((e, i) => (
              <Reveal key={e.k} className="feat" delay={(i % 2) * 80}>
                <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                <h3>{e.k} · {e.ko}</h3>
                <p>{e.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 일정 ── */}
      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Schedule</div></div>
            <div><h2 className="title">다가오는 일정.</h2></div>
          </div>
          <ul className="timeline">
            {SCHEDULE.map((t) => (
              <li key={t.h}>
                <span className="yr">{t.yr}</span>
                <span className="ev"><b>{t.h}</b><span>{t.p}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Join the Game</div>
              <h2 className="join__card--en">Play the Culture.</h2>
              <p>이벤트 참가·초청·제휴 문의를 남겨주시면 순차 안내해 드립니다.</p>
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
