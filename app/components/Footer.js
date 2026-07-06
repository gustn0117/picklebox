import Link from "next/link";
import { LINKS, BUSINESS, SHOPS } from "../lib/site";

function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YtIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="4.5" fill="currentColor" />
      <path d="M10 8.6 L16.2 12 L10 15.4 Z" fill="var(--bg)" />
    </svg>
  );
}

// 전 페이지 공유 푸터 — 외부 링크(스토어·인스타·유튜브·지도) 집약 + 사업자 정보.
export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <Link href="/" className="footer__brand">PICKLEBOX</Link>
            <p className="footer__tagline">
              피클볼을 치고, 웃고, 연결되며 일상에 즐거움을 선물하는 공간. Play, Smile, Connect.
            </p>
          </div>

          <div>
            <h4>Follow</h4>
            <div className="footer__links">
              {LINKS.instagram.map((ig) => (
                <a key={ig.url} href={ig.url} target="_blank" rel="noopener" className="footer__soc">
                  <IgIcon /><span>Instagram {ig.handle}</span>
                </a>
              ))}
              <a href={LINKS.youtube} target="_blank" rel="noopener" className="footer__soc">
                <YtIcon /><span>YouTube 쫌치는언니</span>
              </a>
            </div>
          </div>

          <div>
            <h4>Shop & Visit</h4>
            <div className="footer__links">
              {SHOPS.map((s) => (
                <a key={s.name} href={s.url || "#"} target="_blank" rel="noopener">{s.name}</a>
              ))}
              <Link href="/visit">오시는 길</Link>
              <Link href="/visit">예약 · 문의</Link>
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <div className="footer__links">
              <Link href="/about">피클박스 안내</Link>
              <Link href="/pickleball">피클볼이란?</Link>
              <Link href="/founder">대표 소개</Link>
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
  );
}
