import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { reserveHref } from "../lib/site";

export const metadata = {
  title: "피클볼이란? — PICKLEBOX",
  description: "테니스·배드민턴·탁구를 합친 라켓 스포츠, 피클볼. 규칙과 장비, 매력까지 쉽게 알아봅니다.",
};

const BASICS = [
  { ico: "01", h: "패들과 플라스틱 공", p: "구멍 뚫린 가벼운 플라스틱 공과 나무·카본 패들로 즐깁니다. 공이 천천히 날아 초보도 쉽게 랠리를 이어갈 수 있어요." },
  { ico: "02", h: "배드민턴 크기 코트", p: "테니스보다 훨씬 작은 배드민턴 규격 코트에서 단식·복식으로 진행합니다. 넓게 뛰지 않아 체력 부담이 적습니다." },
  { ico: "03", h: "쉬운 규칙", p: "서브는 아래에서 위로, 네트 앞 '키친' 구역만 기억하면 끝. 5분이면 규칙을 익히고 바로 경기를 시작할 수 있습니다." },
];

const START = [
  { s: "STEP 01", h: "코트 예약", p: "피클박스 코트를 예약하세요. 패들과 공은 준비되어 있어 몸만 오시면 됩니다." },
  { s: "STEP 02", h: "규칙 익히기", p: "서브·키친·점수만 알면 끝. 레슨과 함께라면 5분이면 경기를 시작할 수 있습니다." },
  { s: "STEP 03", h: "첫 랠리", p: "복식으로 함께 치면 더 재밌습니다. 웃고 떠들다 보면 어느새 한 게임이 끝나 있어요." },
];

const FAQ = [
  { q: "운동을 안 해도 할 수 있나요?", a: "네. 격한 움직임이 적어 체력 부담이 적습니다. 남녀노소 누구나 가볍게 시작하기 좋은 생활 스포츠예요." },
  { q: "테니스랑 뭐가 다른가요?", a: "코트가 훨씬 작고 공이 느리게 날아 진입이 쉽습니다. 넓게 뛰지 않아도 랠리가 오래 이어져 초보도 금방 재미를 느껴요." },
  { q: "장비를 꼭 사야 하나요?", a: "처음엔 클럽에 비치된 장비로 충분합니다. 재미가 붙으면 스마트스토어에서 나만의 패들을 골라보세요." },
  { q: "혼자 가도 즐길 수 있나요?", a: "네. 레슨과 커뮤니티를 통해 함께 칠 사람을 자연스럽게 만날 수 있습니다. 복식은 넷이 함께 즐기기 좋아요." },
];

export default function Pickleball() {
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="What is Pickleball"
        num="02"
        title="테니스 · 배드민턴 · 탁구를 하나로, 피클볼."
        lead="작은 코트에서 가벼운 공과 패들로 즐기는 라켓 스포츠. 규칙이 쉽고 부담이 적어 누구나 첫날부터 랠리를 이어갈 수 있습니다."
      />

      {/* ── 기본 ── */}
      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Basics</div></div>
            <div><h2 className="title">이렇게 즐깁니다</h2></div>
          </div>
          <div className="grid-3">
            {BASICS.map((b, i) => (
              <Reveal key={b.h} className="feat" delay={(i % 3) * 70}>
                <div className="feat__ico">{b.ico}</div>
                <h3>{b.h}</h3>
                <p>{b.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 시작하기 ── */}
      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">How to start</div></div>
            <div><h2 className="title">오늘 처음이어도, 3단계면 충분해요.</h2></div>
          </div>
          <div className="grid-3">
            {START.map((s, i) => (
              <Reveal key={s.h} className="feat" delay={(i % 3) * 70}>
                <div className="feat__ico feat__ico--step">{s.s}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section section--alt">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">FAQ</div></div>
            <div><h2 className="title">자주 묻는 질문</h2></div>
          </div>
          <div className="faq">
            {FAQ.map((f, i) => (
              <div key={f.q} className="faq__item">
                <div className="faq__n">// {String(i + 1).padStart(2, "0")}</div>
                <div className="faq__q">{f.q}</div>
                <div className="faq__a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <h2>처음이신가요?<br />피클박스에서 시작하세요.</h2>
              <p>패들과 공은 준비되어 있습니다. 레슨과 함께라면 오늘 처음이어도 바로 경기를 즐길 수 있어요.</p>
            </div>
            <div className="join__actions">
              <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--lime">
                레슨 · 예약하기 <Arrow />
              </a>
              <Link href="/about" className="btn btn--ghost" style={{ borderColor: "#fff", color: "#fff" }}>
                피클박스 안내
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
