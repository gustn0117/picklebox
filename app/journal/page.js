import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import { LINKS } from "../lib/site";

export const metadata = {
  title: "Journal — PICKLEBOX",
  description: "피클볼 컬처, 가이드, 이벤트 비하인드. 피클박스가 전하는 이야기.",
};

// 저널 아티클 — [준비 중] 실제 발행 시 교체.
const POSTS = [
  { cat: "Culture", title: "피클볼이 서울의 새로운 컬처가 되기까지", date: "[준비 중]" },
  { cat: "Guide", title: "처음 피클볼, 5분이면 시작하는 법", date: "[준비 중]" },
  { cat: "Event", title: "셀럽 피클볼 오픈 비하인드", date: "[준비 중]" },
  { cat: "Interview", title: "조민정 대표가 그리는 피클박스", date: "[준비 중]" },
  { cat: "Goods", title: "패들 고르는 법 — 입문자를 위한 가이드", date: "[준비 중]" },
];

export default function Journal() {
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Journal"
        title="피클박스 저널."
        lead="피클볼 컬처와 입문 가이드, 이벤트 비하인드까지 — 피클박스가 전하는 이야기를 곧 만나보세요."
      />

      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Latest</div></div>
            <div><h2 className="title">곧 발행됩니다.</h2></div>
          </div>
          <ul className="timeline">
            {POSTS.map((p) => (
              <li key={p.title}>
                <span className="yr">{p.cat}</span>
                <span className="ev"><b>{p.title}</b><span>{p.date}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Stay tuned</div>
              <h2 className="join__card--en">Follow the story.</h2>
              <p>새 소식은 인스타그램과 유튜브에서 가장 먼저 전해드립니다.</p>
            </div>
            <div className="join__actions">
              <a href={LINKS.instagram[0].url} target="_blank" rel="noopener" className="btn btn--lime">
                인스타 팔로우 <Arrow />
              </a>
              <a href={LINKS.youtube} target="_blank" rel="noopener" className="btn btn--ghost">유튜브 쫌치는언니</a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
