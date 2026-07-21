import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Arrow from "../components/Arrow";
import YtThumb from "../components/YtThumb";
import { LINKS } from "../lib/site";
import { db } from "../lib/db";
import { getCopy, pick } from "../lib/copy";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Journal — PICKLEBOX",
  description: "피클볼 컬처, 가이드, 이벤트 비하인드. 피클박스가 전하는 이야기.",
};

const ytLink = (id) => `https://youtu.be/${id}`;

function parseVideos(raw) {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export default async function Journal() {
  const [posts, c] = await Promise.all([
    db.journalPost.findMany({ where: { visible: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    getCopy("journal"),
  ]);

  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Journal"
        title={pick(c, "journal.hero.title", "피클박스 저널.")}
        lead={pick(c, "journal.hero.lead", "피클볼 컬처와 입문 가이드, 이벤트 비하인드까지 — 피클박스가 전하는 이야기.")}
      />

      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--split">
            <div><div className="eyebrow">Latest</div></div>
            <div><h2 className="title">{pick(c, "journal.latest.title", "기사와 영상으로 만나는 피클박스.")}</h2></div>
          </div>

          <div className="journal">
            {posts.map((p, i) => {
              const videos = p.type === "video" ? parseVideos(p.videoIds) : [];
              const isSoon = p.soon || p.type === "soon";
              return (
                <Reveal key={p.id} className="jcard" delay={(i % 3) * 60}>
                  <div className="jcard__meta">
                    <span className="jcard__cat">{p.category}</span>
                    {isSoon && <span className="jcard__soon">준비 중</span>}
                  </div>
                  <h3 className="jcard__title">{p.title}</h3>

                  {p.type === "article" && p.articleUrl && (
                    <a href={p.articleUrl} target="_blank" rel="noopener" className="jcard__go">
                      기사 원문 보기 <Arrow />
                    </a>
                  )}

                  {videos.length > 0 && (
                    <div className="jcard__thumbs">
                      {videos.map((v) => (
                        <a
                          key={v}
                          href={ytLink(v)}
                          target="_blank"
                          rel="noopener"
                          className="jthumb"
                          aria-label={`${p.title} — 유튜브에서 보기`}
                        >
                          <YtThumb id={v} />
                          <span className="jthumb__play" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section join">
        <div className="wrap">
          <Reveal className="join__card">
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Stay tuned</div>
              <h2 className="join__card--en">{pick(c, "journal.cta.title", "Follow the story.")}</h2>
              <p>{pick(c, "journal.cta.desc", "새 소식은 인스타그램과 유튜브에서 가장 먼저 전해드립니다.")}</p>
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
