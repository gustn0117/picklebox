import { getCopy, pick, handleFromUrl } from "../lib/copy";

// 고객에게 보이는 "준비중(공사중)" 화면. 관리자(로그인)는 이 화면을 건너뛰고 실제 사이트를 본다.
export default async function Maintenance() {
  const c = await getCopy("site");
  const title = pick(c, "site.maintenanceTitle", "홈페이지 준비중입니다");
  const msg = pick(c, "site.maintenanceMsg", "더 좋은 모습으로 곧 찾아뵙겠습니다.\n조금만 기다려 주세요.");
  const insta = pick(c, "site.instagram1", "https://instagram.com/picklebox.official");

  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
        background:
          "radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--volt) 12%, transparent), transparent 60%), var(--bg)",
        color: "var(--ink)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pb-logomark2.png"
        alt="PICKLEBOX"
        style={{ width: "min(220px, 60vw)", height: "auto", marginBottom: 34 }}
      />

      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: "0.72rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--volt)",
          marginBottom: 18,
        }}
      >
        [ Coming Soon ]
      </div>

      <h1
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 800,
          fontSize: "clamp(1.9rem, 5vw, 3rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          margin: 0,
        }}
      >
        {title}
      </h1>

      <p
        style={{
          marginTop: 20,
          maxWidth: "40ch",
          color: "var(--ink-soft)",
          fontSize: "clamp(1rem, 2vw, 1.15rem)",
          lineHeight: 1.7,
          whiteSpace: "pre-line",
        }}
      >
        {msg}
      </p>

      {insta && (
        <a
          href={insta}
          target="_blank"
          rel="noopener"
          style={{
            marginTop: 34,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 26px",
            borderRadius: 999,
            background: "var(--volt)",
            color: "var(--volt-ink)",
            fontFamily: "var(--font-label)",
            fontWeight: 800,
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          {handleFromUrl(insta, "@picklebox.official")} · 소식 받기
        </a>
      )}
    </main>
  );
}
