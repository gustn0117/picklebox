"use client";
import Link from "next/link";

export default function AdminTopbar({ back }) {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }
  return (
    <div className="a-top">
      <div className="a-top__right" style={{ gap: 12 }}>
        <Link href="/admin" className="a-top__brand">PICKLEBOX 관리자</Link>
        {back && <Link href={back} className="a-btn">← 목록</Link>}
      </div>
      <div className="a-top__right">
        <a href="/" target="_blank" rel="noopener" className="a-btn">사이트 보기 ↗</a>
        <button className="a-btn" onClick={logout}>로그아웃</button>
      </div>
    </div>
  );
}
