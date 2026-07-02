import Nav from "./components/Nav";
import Reveal from "./components/Reveal";
import Ball from "./components/Ball";
import Parallax from "./components/Parallax";
import { LINKS, BUSINESS, SUBBRANDS } from "./lib/site";

const Arrow = () => (
  <svg className="btn__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FEATURES = [
  { ico: "24", h: "24시간 무인 스마트 클럽", p: "언제든 문을 열고 들어와 나만의 시간에 피클볼을 즐기세요." },
  { ico: "숲", h: "서울숲 라운지", p: "갤러리아 포레의 프라이빗 코트와 라운지에서 보내는 하루." },
  { ico: "♥", h: "레슨 · 커뮤니티", p: "처음이어도 쉽게 배우고, 좋은 사람들과 자연스럽게 연결됩니다." },
  { ico: "✈", h: "여행 · 문화", p: "코트를 넘어 서울 관광과 해외 피클볼 투어까지 이어집니다." },
];

const CONFETTI = [
  { bg: "var(--lime)", size: 22, left: "8%", top: "14%" },
  { bg: "var(--tangerine)", size: 15, left: "84%", top: "10%" },
  { bg: "var(--green)", size: 12, left: "90%", top: "52%" },
  { bg: "var(--lime)", size: 16, left: "4%", top: "56%" },
  { bg: "var(--tangerine)", size: 11, left: "16%", top: "80%" },
];

export default function Home() {
  return (
    <>
      <span id="top" />
      <Nav />

      {/* ── 히어로 ── */}
      <header className="hero">
        <div className="wrap hero__grid">
          <div>
            <div className="eyebrow hero__tag">Pickleball Lifestyle Platform</div>
            <h1 className="hero__en">
              Open the Box,<br />Play the <span className="pop">Joy.</span>
            </h1>
            <p className="hero__ko">피클볼로 여는 즐거운 선물상자</p>
            <p className="hero__desc">
              PICKLEBOX는 24시간 무인 스마트 피클볼 클럽을 중심으로 코트, 레슨, 커뮤니티,
              굿즈, 여행을 연결하는 피클볼 라이프스타일 플랫폼입니다.
            </p>
            <div className="hero__actions">
              <a href={LINKS.store} target="_blank" rel="noopener" className="btn btn--primary">
                스마트스토어 <Arrow />
              </a>
              <a href="#contact" className="btn btn--ghost">클럽 방문·문의</a>
            </div>
            <div className="hero__stats">
              <div className="hero__stat"><b>24H</b><span>무인 스마트 클럽</span></div>
              <div className="hero__stat"><b>6</b><span>브랜드 라인업</span></div>
              <div className="hero__stat"><b>서울숲</b><span>갤러리아 포레</span></div>
            </div>
          </div>

          <Parallax className="box" speed={0.06} aria-hidden="true">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="box__confetti"
                style={{ background: c.bg, width: c.size, height: c.size, left: c.left, top: c.top }}
              />
            ))}
            <div className="box__ball"><Ball body="#fff" dots="var(--green)" tail={false} /></div>
            <div className="box__lid" />
            <div className="box__base" />
            <div className="box__ribbon" />
          </Parallax>
        </div>
      </header>

      <div className="wrap"><div className="ribbon" /></div>

      {/* ── 브랜드 스토리 ── */}
      <section className="section story" id="story">
        <div className="wrap story__grid">
          <Reveal className="story__mark">
            <span className="spark" style={{ width: 18, height: 18, left: "18%", top: "20%" }} />
            <span className="spark" style={{ width: 12, height: 12, right: "22%", top: "30%" }} />
            <span className="spark" style={{ width: 14, height: 14, left: "26%", bottom: "22%" }} />
            <Ball body="#fff" dots="var(--green)" />
          </Reveal>
          <Reveal className="story__body" delay={80}>
            <div className="eyebrow">Brand Story</div>
            <span className="section__num">/ 01</span>
            <h2 className="title">기대하지 못했던 선물상자를 열었을 때처럼.</h2>
            <p className="lead">
              피클볼 한 게임에는 운동의 즐거움만 있는 것이 아닙니다. 처음 만난 사람과 인사를 나누고,
              공을 주고받으며 함께 웃고, 일상의 스트레스를 잠시 내려놓는 시간이 담겨 있습니다.
            </p>
            <p style={{ color: "var(--ink-soft)", marginTop: 16 }}>
              PICKLEBOX에 들어오는 순간 설렘이 시작되고, 코트 위에서는 웃음과 에너지가 쌓이며,
              돌아갈 때는 좋은 기억과 새로운 인연을 담아갈 수 있습니다.
            </p>
            <p className="story__quote">피클볼을 치고, 웃고, 연결되며<br />일상에 즐거움을 선물하는 공간.</p>
          </Reveal>
        </div>
      </section>

      {/* ── 서브브랜드 6종 ── */}
      <section className="section" id="brands">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Our Services</div>
            <span className="section__num">/ 02</span>
            <h2 className="title">하나의 상자, 여섯 가지 즐거움</h2>
            <p className="lead">
              멤버십부터 여행까지 — PICKLEBOX의 여섯 브랜드가 피클볼을 중심으로 한 라이프스타일을 완성합니다.
            </p>
          </div>
          <div className="brands__grid">
            {SUBBRANDS.map((b, i) => (
              <Reveal key={b.key} className={`brand brand--${b.tint}`} delay={(i % 3) * 70}>
                <span className="brand__num">{String(i + 1).padStart(2, "0")}</span>
                <div className="brand__dot">
                  <Ball body="#fff" dots={b.tint === "lime" ? "var(--ink)" : "var(--green)"} tail={false} />
                </div>
                <div className="brand__key">
                  PICKLEBOX {b.key}
                  <small>{b.ko}</small>
                </div>
                <p className="brand__desc">{b.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 왜 피클박스 ── */}
      <section className="section why">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Why PICKLEBOX</div>
            <span className="section__num">/ 03</span>
            <h2 className="title">누구나 쉽게, 운동을 넘어 문화까지</h2>
          </div>
          <div className="why__grid">
            {FEATURES.map((f, i) => (
              <Reveal key={f.h} className="feat" delay={(i % 4) * 60}>
                <div className="feat__ico">{f.ico}</div>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 레슨/멤버십 CTA ── */}
      <section className="section join" id="contact">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <h2>레슨과 멤버십,<br />지금 시작해 보세요.</h2>
              <p>
                피클볼이 처음이어도 괜찮습니다. ACADEMY 레슨과 CLUB 멤버십으로
                좋은 경기와 좋은 사람들을 만나보세요. 방문·예약 문의를 남겨주시면 안내해 드립니다.
              </p>
            </div>
            <div className="join__actions">
              <a href={LINKS.instagram[0].url} target="_blank" rel="noopener" className="btn btn--lime">
                인스타 DM 문의 <Arrow />
              </a>
              <a href={LINKS.map} target="_blank" rel="noopener" className="btn btn--ghost" style={{ borderColor: "#fff", color: "#fff" }}>
                오시는 길 보기
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 스토어 ── */}
      <section className="section store">
        <div className="wrap">
          <Reveal className="store__card">
            <div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Store · Goods</div>
              <span className="section__num">/ 04</span>
              <h2>피클볼 굿즈와 용품, 스마트스토어에서</h2>
              <p>패들부터 웨어, 액세서리까지. 조민정테니스가 직접 고른 피클볼 라이프 아이템을 만나보세요.</p>
            </div>
            <a href={LINKS.store} target="_blank" rel="noopener" className="btn btn--primary">
              스토어 바로가기 <Arrow />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── 오시는 길 ── */}
      <section className="section" id="location">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Visit Us</div>
            <span className="section__num">/ 05</span>
            <h2 className="title">서울숲, 갤러리아 포레</h2>
          </div>
          <div className="loc__grid">
            <div className="loc__info">
              <div className="loc__row">
                <span className="k">주소</span>
                <span className="v">{BUSINESS.address}</span>
              </div>
              <div className="loc__row">
                <span className="k">상호</span>
                <span className="v">{BUSINESS.name} · 대표 {BUSINESS.ceo}</span>
              </div>
              <div className="loc__row">
                <span className="k">문의</span>
                <span className="v">
                  인스타그램 <a href={LINKS.instagram[0].url} target="_blank" rel="noopener" style={{ color: "var(--green-deep)", fontWeight: 600 }}>{LINKS.instagram[0].handle}</a> DM
                </span>
              </div>
              <a href={LINKS.map} target="_blank" rel="noopener" className="btn btn--primary" style={{ alignSelf: "flex-start", marginTop: 4 }}>
                네이버 지도로 열기 <Arrow />
              </a>
            </div>
            <div className="loc__map">
              <iframe
                title="피클박스 오시는 길 지도"
                src="https://www.google.com/maps?q=서울특별시 성동구 서울숲2길 32-14 갤러리아 포레&z=16&hl=ko&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer__top">
            <div>
              <div className="footer__brand">
                <Ball body="var(--green)" dots="#fff" />
                PICKLEBOX
              </div>
              <p className="footer__tagline">피클볼을 치고, 웃고, 연결되며 일상에 즐거움을 선물하는 공간. Play, Smile, Connect.</p>
            </div>

            <div>
              <h4>Follow</h4>
              <div className="footer__links">
                {LINKS.instagram.map((ig) => (
                  <a key={ig.url} href={ig.url} target="_blank" rel="noopener">
                    Instagram {ig.handle}
                  </a>
                ))}
                <a href={LINKS.youtube} target="_blank" rel="noopener">YouTube 조민정테니스TV</a>
              </div>
            </div>

            <div>
              <h4>Shop & Visit</h4>
              <div className="footer__links">
                <a href={LINKS.store} target="_blank" rel="noopener">네이버 스마트스토어</a>
                <a href={LINKS.map} target="_blank" rel="noopener">오시는 길</a>
                <a href="#contact">레슨·멤버십 문의</a>
              </div>
            </div>
          </div>

          <div className="footer__biz">
            <span>{BUSINESS.name} · 대표 {BUSINESS.ceo} · 사업자등록번호 {BUSINESS.bizNo}</span>
            <span>{BUSINESS.address}</span>
            <span>© {2026} PICKLEBOX. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
