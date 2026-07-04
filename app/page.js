import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";
import Court from "./components/Court";
import Arrow from "./components/Arrow";
import { LINKS, reserveHref } from "./lib/site";

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
          <span className="hud__c hud__tl">37.5443°N<br />127.0374°E</span>
          <span className="hud__c hud__tr">REC ●</span>
          <span className="hud__c hud__bl">EST. 2026</span>
          <span className="hud__c hud__br">SEOUL · KR</span>
        </div>
        <div className="wrap hero__inner">
          <div className="eyebrow hero__eyebrow">Premium Pickleball Club · Seoul</div>
          <h1 className="hero__title">PICKLEBOX</h1>
          <div className="hero__accent">Play the Joy.</div>
          <p className="hero__ko">피클볼로 여는 즐거운 선물상자</p>
          <p className="hero__desc">
            셀럽·커뮤니티·컬처가 함께하는 서울숲의 프리미엄 피클볼 클럽.
            24시간 무인 스마트 코트부터 레슨·굿즈·투어까지 하나로.
          </p>
          <div className="hero__actions">
            <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--primary">
              예약하기 <Arrow />
            </a>
            <Link href="/about" className="btn btn--ghost">클럽 안내</Link>
            <a href={LINKS.store} target="_blank" rel="noopener" className="btn btn--ghost">스마트스토어</a>
          </div>
          <div className="hero__stats">
            <div className="hero__stat"><b>24H</b><span>무인 스마트 클럽</span></div>
            <div className="hero__stat"><b>6</b><span>브랜드 라인업</span></div>
            <div className="hero__stat"><b>서울숲</b><span>갤러리아 포레</span></div>
          </div>
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
          <div className="section__head section__head--split">
            <div>
              <div className="eyebrow">Explore</div>
              <span className="section__num">/ 01</span>
            </div>
            <h2 className="title title--ko">피클박스,<br />어디부터 볼까요?</h2>
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
              <p className="bento__desc">브랜드 스토리와 사업 소개, 피클볼을 중심으로 한 여섯 가지 서비스 라인업.</p>
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
