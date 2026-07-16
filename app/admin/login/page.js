"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (r.ok) {
      window.location.href = "/admin";
    } else {
      const d = await r.json().catch(() => ({}));
      setErr(d.error || "로그인에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <div style={S.wrap}>
      <form onSubmit={submit} style={S.card}>
        <div style={S.brand}>PICKLEBOX</div>
        <div style={S.title}>관리자 로그인</div>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="비밀번호"
          autoFocus
          style={S.input}
        />
        {err && <div style={S.err}>{err}</div>}
        <button type="submit" disabled={loading} style={S.btn}>
          {loading ? "확인 중…" : "로그인"}
        </button>
      </form>
    </div>
  );
}

const S = {
  wrap: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4f4f7", fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif", padding: 20 },
  card: { width: "100%", maxWidth: 360, background: "#fff", borderRadius: 14, padding: "36px 30px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: 14 },
  brand: { fontWeight: 800, letterSpacing: "0.04em", color: "#ff7a2f", fontSize: 20 },
  title: { fontWeight: 700, fontSize: 22, color: "#1a1420", marginBottom: 4 },
  input: { padding: "13px 15px", borderRadius: 10, border: "1px solid #dcdce3", fontSize: 16, outline: "none" },
  err: { color: "#d33", fontSize: 13 },
  btn: { padding: "13px 15px", borderRadius: 10, border: "none", background: "#009eae", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" },
};
