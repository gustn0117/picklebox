import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";
import Court from "./components/Court";
import Arrow from "./components/Arrow";
import CountUp from "./components/CountUp";
import { reserveHref } from "./lib/site";

const STATS = [
  { n: 45, pad: 0, u: "MIN", l: "한 게임의 온도" },
  { n: 6, pad: 2, u: "", l: "서비스 브랜드" },
  { n: 24, pad: 0, u: "H", l: "무인 스마트 운영" },
  { n: 100, pad: 0, u: "%", l: "초보 환영" },
];

const WHY = [
  { h: "24시간 무인 스마트 클럽", p: "언제든 문을 열고 들어와 나만의 시간에 피클볼을 즐기세요. 예약부터 입장까지 스마트하게." },
  { h: "서울숲 라운지", p: "갤러리아 포레의 프라이빗 코트와 라운지에서 보내는 하루. 도심 속 프리미엄 컬처 공간." },
  { h: "레슨 · 커뮤니티", p: "처음이어도 쉽게 배우고, 좋은 사람들과 자연스럽게 연결됩니다. 코치와 동호인이 함께." },
  { h: "여행 · 컬처", p: "코트를 넘어 서울 관광과 해외 피클볼 투어까지. 피클볼로 여는 새로운 라이프스타일." },
];

const STEPS = [
  { s: "STEP 01", h: "예약", p: "네이버 예약으로 원하는 시간을 선택하세요. 몇 번의 터치면 코트가 준비됩니다." },
  { s: "STEP 02", h: "입장", p: "무인 스마트 출입으로 24시간 언제든. 기다림 없이 바로 나만의 코트로." },
  { s: "STEP 03", h: "플레이", p: "패들과 공은 준비되어 있습니다. 처음이라면 레슨과 함께 첫날부터 랠리를." },
];

export default function Home() {
  return (
    <>
      <span id="top" />
      <Nav />

      {/* ── 히어로 ── */}
      <header className="hero">
        <div className="hero__bg"><Court /></div>
        <div className="hero__scan" aria-hidden="true" />
        <div className="hud" aria-hidden="true">
          <span className="hud__c hud__tl hud__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pb-icon-orange.png" alt="" className="hud__brand-ico" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pb-wordmark-orange.png" alt="" className="hud__brand-txt" />
          </span>
          <span className="hud__c hud__tr">REC ●</span>
          <span className="hud__c hud__bl">EST. 2026</span>
          <span className="hud__c hud__br">SEOUL · KR</span>
        </div>
        <div className="wrap hero__inner">
          <div className="eyebrow hero__eyebrow">Premium Pickleball Club · Seoul</div>
          <h1 className="hero__title">PICKLEBOX</h1>
          <div className="hero__accent">Play the Joy.</div>
          <p className="hero__ko">피클박스는 즐거움을 여는 선물상자입니다.<br />피클볼을 통해 운동, 만남, 휴식, 콘텐츠, 여행까지 이어지는 새로운 스포츠 라이프를 만듭니다.</p>
        </div>
        <div className="ticker">
          <div className="wrap ticker__inner">
            <span className="ticker__hot">Now Open</span>
            <span className="ticker__sep">/</span>
            <span className="ticker__item">서울숲 · 갤러리아 포레</span>
            <span className="ticker__sep">/</span>
            <span className="ticker__item">24시간 무인 스마트 클럽</span>
            <span className="ticker__sep">/</span>
            <span className="ticker__hot">예약 오픈</span>
          </div>
        </div>
      </header>

      {/* ── 둘러보기(벤토) ── */}
      <section className="section" id="explore">
        <div className="wrap">
          <div className="section__head">
            <div className="eyebrow">Explore</div>
            <span className="section__num">/ 01</span>
          </div>
          <div className="bento">
            <Reveal
              as={Link}
              href="/about"
              className="bento__card bento__card--feat bento__card--img"
              style={{ backgroundImage: "url(/assets/story-picklebox-still.webp)" }}
            >
              <span className="bento__num">// 01</span>
              <div className="bento__key bento__key--feat">About<br />PICKLEBOX</div>
              <p className="bento__desc">피클박스는 즐거움을 여는 선물상자입니다.</p>
              <span className="bento__go">바로가기 <Arrow /></span>
            </Reveal>

            <Reveal as={Link} href="/pickleball" className="bento__card bento__card--half" delay={70}>
              <span className="bento__num">// 02</span>
              <div className="bento__key">What is<br />Pickleball</div>
              <p className="bento__desc">누구나 5분이면 배우는, 요즘 가장 빠르게 크는 라켓 스포츠.</p>
              <span className="bento__go">바로가기 <Arrow /></span>
            </Reveal>

            <Reveal as={Link} href="/founder" className="bento__card bento__card--half" delay={140}>
              <span className="bento__num">// 03</span>
              <div className="bento__key">The<br />Founder</div>
              <p className="bento__desc">테니스에서 피클볼로 — 조민정 대표가 그리는 이야기.</p>
              <span className="bento__go">바로가기 <Arrow /></span>
            </Reveal>

            <Reveal
              as={Link}
              href="/visit"
              className="bento__card bento__card--wide bento__card--img"
              style={{ backgroundImage: "url(/assets/join-lounge-court.webp)" }}
              delay={90}
            >
              <span className="bento__num">// 04</span>
              <div className="bento__key">Visit Us</div>
              <p className="bento__desc">서울숲 갤러리아 포레 · 예약·지도·문의를 한 번에. 24시간 언제든 문을 여는 스마트 클럽.</p>
              <span className="bento__go">오시는 길 <Arrow /></span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 매니페스토 + 스탯 ── */}
      <section className="section section--alt">
        <div className="wrap">
          <div className="eyebrow">Manifesto</div>
          <div className="manifesto" style={{ marginTop: 26, marginBottom: "clamp(48px, 7vw, 84px)" }}>
            <p>
              <span className="hl">운동을 넘어,<br />사람을 잇다.</span> 서울숲에서 시작하는
              새로운 <span className="hl--volt">피클볼 컬처</span>.
            </p>
          </div>
          <div className="statband">
            {STATS.map((s) => (
              <div className="statband__cell" key={s.l}>
                <div className="statband__n"><CountUp to={s.n} pad={s.pad} /><em>{s.u}</em></div>
                <div className="statband__l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 왜 피클박스 ── */}
      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div>
              <div className="eyebrow">Why PICKLEBOX</div>
              <span className="section__num">/ 02</span>
            </div>
            <h2 className="title title--ko">누구나 쉽게,<br />운동을 넘어 컬처까지.</h2>
          </div>
          <div className="why__grid">
            {WHY.map((f, i) => (
              <Reveal key={f.h} className="feat" delay={(i % 4) * 60}>
                <div className="feat__ico">{String(i + 1).padStart(2, "0")}</div>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 이용 방법 ── */}
      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div>
              <div className="eyebrow">How it works</div>
              <span className="section__num">/ 03</span>
            </div>
            <h2 className="title title--ko">예약하고, 들어와,<br />바로 플레이.</h2>
          </div>
          <div className="grid-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.h} className="feat" delay={(i % 3) * 70}>
                <div className="feat__ico feat__ico--step">{s.s}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA 밴드 ── */}
      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Join the Club</div>
              <h2 className="join__card--en">Play the Culture.</h2>
              <p>
                피클볼이 처음이어도 괜찮습니다. 방문·예약 문의를 남겨주시면
                코트와 레슨, 멤버십까지 편하게 안내해 드립니다.
              </p>
            </div>
            <div className="join__actions">
              <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--lime">
                예약하기 <Arrow />
              </a>
              <Link href="/visit" className="btn btn--ghost">오시는 길</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
