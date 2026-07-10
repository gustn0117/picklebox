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

const ytLink = (id) => `https://youtu.be/${id}`;
const ytThumb = (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

// 저널 아티클 — 기사/영상 링크. soon은 발행 예정.
const POSTS = [
  {
    cat: "Culture",
    title: "피클볼이 서울의 새로운 컬처가 되기까지",
    article: { url: "https://v.daum.net/v/32pHevoMy5", source: "다음 뉴스" },
  },
  {
    cat: "Guide",
    title: "처음 피클볼, 5분이면 시작하는 법",
    videos: ["5QIzcd2lmPA"],
  },
  {
    cat: "Event",
    title: "셀럽 피클볼 오픈 비하인드",
    videos: ["kXbj82FYCEg", "MmUg3iDA9gE", "iZNW57gY7PU"],
  },
  {
    cat: "Interview",
    title: "조민정 대표가 그리는 피클박스",
    videos: ["_xoRmKzH21M"],
  },
  {
    cat: "Goods",
    title: "패들 고르는 법 — 입문자를 위한 가이드",
    soon: true,
  },
];

export default function Journal() {
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Journal"
        title="피클박스 저널."
        lead="피클볼 컬처와 입문 가이드, 이벤트 비하인드까지 — 피클박스가 전하는 이야기."
      />

      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Latest</div></div>
            <div><h2 className="title">기사와 영상으로 만나는 피클박스.</h2></div>
          </div>

          <div className="journal">
            {POSTS.map((p, i) => (
              <Reveal key={p.title} className="jcard" delay={(i % 3) * 60}>
                <div className="jcard__meta">
                  <span className="jcard__cat">{p.cat}</span>
                  {p.soon && <span className="jcard__soon">준비 중</span>}
                </div>
                <h3 className="jcard__title">{p.title}</h3>

                {p.article && (
                  <a href={p.article.url} target="_blank" rel="noopener" className="jcard__go">
                    {p.article.source}에서 기사 읽기 <Arrow />
                  </a>
                )}

                {p.videos && (
                  <div className="jcard__thumbs">
                    {p.videos.map((v) => (
                      <a
                        key={v}
                        href={ytLink(v)}
                        target="_blank"
                        rel="noopener"
                        className="jthumb"
                        aria-label={`${p.title} — 유튜브에서 보기`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ytThumb(v)} alt="" loading="lazy" />
                        <span className="jthumb__play" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
              </Reveal>
            ))}
          </div>
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
