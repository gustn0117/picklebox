// 원근 피클볼 코트 그래픽 — 히어로 배경(사진 대체). 볼트 네트 라인이 포인트.
export default function Court() {
  return (
    <div className="court" aria-hidden="true">
      <svg viewBox="0 0 1200 720" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a2f66" stopOpacity="0.0" />
            <stop offset="1" stopColor="#0a1836" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {/* 코트 바닥 */}
        <polygon points="220,700 980,700 720,190 480,190" fill="url(#floor)" />
        {/* 사이드라인 · 베이스라인 · 키친 */}
        <g stroke="rgba(255,255,255,0.14)" strokeWidth="1.6" fill="none">
          <line x1="220" y1="700" x2="480" y2="190" />
          <line x1="980" y1="700" x2="720" y2="190" />
          <line x1="220" y1="700" x2="980" y2="700" />
          <line x1="480" y1="190" x2="720" y2="190" />
          <line x1="300" y1="510" x2="900" y2="510" />
          <line x1="392" y1="360" x2="808" y2="360" />
        </g>
        {/* 센터라인 (시안) */}
        <line x1="600" y1="700" x2="600" y2="190" stroke="var(--wire)" strokeWidth="1.4" opacity="0.35" />
        {/* 네트 (볼트) */}
        <g>
          <line x1="345" y1="445" x2="855" y2="445" stroke="var(--volt)" strokeWidth="2.6" opacity="0.9" />
          <line x1="345" y1="445" x2="345" y2="405" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <line x1="855" y1="445" x2="855" y2="405" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
