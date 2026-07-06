"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, reserveHref } from "../lib/site";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav className="nav">
      <div className="wrap nav__inner">
        <Link href="/" className="nav__brand" aria-label="PICKLEBOX 홈">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="nav__logo" src="/pb-logo.png" alt="PICKLEBOX" />
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
        </div>

        <div className="nav__cta-group">
          <a href={reserveHref} target="_blank" rel="noopener" className="btn btn--primary nav__cta">
            Join the Game
          </a>
          <Link href="/partners" className="btn btn--ghost nav__cta">
            Partner with Us
          </Link>
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
            Join the Game
          </a>
          <Link href="/partners" className="btn btn--ghost" onClick={() => setOpen(false)}>
            Partner with Us
          </Link>
        </div>
      )}
    </nav>
  );
}
