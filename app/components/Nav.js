"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Ball from "./Ball";
import { NAV, reserveHref } from "../lib/site";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href) => pathname === href;

  return (
    <nav className="nav">
      <div className="wrap nav__inner">
        <Link href="/" className="nav__brand" aria-label="PICKLEBOX 홈">
          <Ball body="var(--green)" dots="#fff" />
          PICKLEBOX
        </Link>

        <div className="nav__menu">
          {NAV.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`nav__link ${isActive(m.href) ? "is-active" : ""}`}
            >
              {m.label}
            </Link>
          ))}
          <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--primary nav__cta">
            예약하기
          </a>
        </div>

        <button
          className="btn btn--ghost nav__burger"
          aria-expanded={open}
          aria-label="메뉴 열기"
          onClick={() => setOpen((v) => !v)}
        >
          메뉴
        </button>
      </div>

      {open && (
        <div className="wrap nav__mobile">
          {NAV.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`nav__link ${isActive(m.href) ? "is-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {m.label}
            </Link>
          ))}
          <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--primary" onClick={() => setOpen(false)}>
            예약하기
          </a>
        </div>
      )}
    </nav>
  );
}
