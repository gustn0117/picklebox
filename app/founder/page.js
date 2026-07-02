import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { LINKS, reserveHref } from "../lib/site";

export const metadata = {
  title: "대표 소개 — PICKLEBOX",
  description: "테니스에서 피클볼로 — 조민정 대표가 그리는 피클박스 이야기.",
};

// 대표 약력 — [대괄호] = 확정 후 교체.
const CAREER = [
  "조민정테니스TV 운영 · 테니스/피클볼 코치",
  "[테니스 선수·지도자 경력 연도]",
  "[피클볼 지도자 자격 / 대회 이력]",
  "PICKLEBOX(테니스포레) 대표",
];

export default function Founder() {
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Founder"
        num="03"
        title="테니스에서 피클볼로, 즐거움을 잇다."
        lead="라켓 하나로 사람과 사람을 연결해 온 조민정 대표가 피클박스를 시작한 이유."
      />

      {/* ── 프로필 ── */}
      <section className="section story">
        <div className="wrap story__grid">
          <Reveal className="story__mark photo-slot" style={{ aspectRatio: "4 / 5" }} />
          <Reveal className="story__body" delay={80}>
            <div className="eyebrow">조민정 · 대표</div>
            <h2 className="title">코트 위의 즐거움을, 더 많은 사람에게.</h2>
            <p className="lead">
              오랜 시간 라켓 스포츠와 함께해 온 조민정 대표는, 피클볼이 가진
              &lsquo;쉽게 배우고 함께 웃는&rsquo; 힘에 매료되어 피클박스를 시작했습니다.
            </p>
            <p style={{ color: "var(--ink-soft)", marginTop: 16 }}>
              [대표 개인 스토리 — 테니스 경력, 피클볼을 만나게 된 계기, 피클박스를 통해
              이루고 싶은 것 등을 이곳에 채웁니다.]
            </p>
            <ul className="career">
              {CAREER.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── 철학 ── */}
      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Philosophy</div>
            <h2 className="title">운동을 넘어, 사람을 연결합니다.</h2>
          </div>
          <p className="lead" style={{ maxWidth: 720 }}>
            피클박스가 만들고 싶은 것은 단순한 운동 공간이 아닙니다. 처음 온 사람도 편하게 어울리고,
            좋은 사람들과 다시 만나고 싶어지는 곳 — 코트 위의 작은 즐거움이 일상의 활력이 되는 문화를
            만들어 갑니다.
          </p>
        </div>
      </section>

      {/* ── 채널 ── */}
      <section className="section story">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Channels</div>
            <h2 className="title">대표의 이야기, 더 가까이</h2>
          </div>
          <div className="channels">
            <a href={LINKS.youtube} target="_blank" rel="noopener" className="channels__card">
              <span className="channels__tag">YouTube</span>
              <b>조민정테니스TV</b>
              <span className="channels__go">채널 보기 <Arrow /></span>
            </a>
            {LINKS.instagram.map((ig) => (
              <a key={ig.url} href={ig.url} target="_blank" rel="noopener" className="channels__card">
                <span className="channels__tag">Instagram</span>
                <b>{ig.handle}</b>
                <span className="channels__go">팔로우 <Arrow /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <h2>대표에게 직접<br />물어보고 싶다면.</h2>
              <p>레슨·멤버십·방문 문의를 남겨주시면 편하게 안내해 드립니다.</p>
            </div>
            <div className="join__actions">
              <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--lime">
                예약 · 문의하기 <Arrow />
              </a>
              <a href={LINKS.instagram[0].url} target="_blank" rel="noopener" className="btn btn--ghost" style={{ borderColor: "#fff", color: "#fff" }}>
                인스타 DM
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
