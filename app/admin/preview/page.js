"use client";
import { useState } from "react";
import AdminTopbar from "../components/AdminTopbar";

const PAGES = [
  { path: "/", label: "홈" },
  { path: "/about", label: "소개" },
  { path: "/founder", label: "대표" },
  { path: "/community", label: "커뮤니티" },
  { path: "/partners", label: "파트너" },
  { path: "/events", label: "이벤트" },
  { path: "/goods", label: "굿즈" },
  { path: "/tours", label: "투어" },
  { path: "/journal", label: "저널" },
  { path: "/visit", label: "오시는 길" },
];

export default function Preview() {
  const [path, setPath] = useState("/");
  const [device, setDevice] = useState("pc");
  const [nonce, setNonce] = useState(0); // 새로고침용

  const src = `${path}${path.includes("?") ? "&" : "?"}preview=1&r=${nonce}`;

  return (
    <>
      <AdminTopbar back="/admin" />
      <div className="admin-wrap admin-wrap--wide">
        <div className="a-head">
          <h1>미리보기</h1>
          <button className="a-btn" onClick={() => setNonce((n) => n + 1)}>새로고침</button>
        </div>
        <p className="a-hintline">
          공개 전 확인용 화면입니다. <b>비공개·예약 항목도 함께 보입니다</b> — 실제 방문자에게는 보이지 않습니다.
        </p>

        <div className="a-tabs">
          {PAGES.map((p) => (
            <button key={p.path} className={`a-tab${p.path === path ? " a-tab--on" : ""}`} onClick={() => setPath(p.path)}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="pv-bar">
          <div className="pv-devices">
            <button className={`a-btn${device === "pc" ? " a-btn--primary" : ""}`} onClick={() => setDevice("pc")}>PC</button>
            <button className={`a-btn${device === "mobile" ? " a-btn--primary" : ""}`} onClick={() => setDevice("mobile")}>모바일</button>
          </div>
          <a className="a-btn" href={src} target="_blank" rel="noopener">새 창에서 보기 ↗</a>
        </div>

        <div className={`pv-stage pv-stage--${device}`}>
          <iframe key={`${path}-${device}-${nonce}`} src={src} title="미리보기" className="pv-frame" />
        </div>
      </div>
    </>
  );
}
