import Link from "next/link";
import Ball from "./Ball";
import { LINKS, BUSINESS } from "../lib/site";

// 전 페이지 공유 푸터 — 외부 링크(스토어·인스타·유튜브·지도) 집약 + 사업자 정보.
export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <Link href="/" className="footer__brand">
              <Ball body="var(--green)" dots="#fff" />
              PICKLEBOX
            </Link>
            <p className="footer__tagline">
              피클볼을 치고, 웃고, 연결되며 일상에 즐거움을 선물하는 공간. Play, Smile, Connect.
            </p>
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
