// 웃는 피클볼 심볼 — 로고 모티프를 SVG로 재현해 자유롭게 리컬러/애니메이션한다.
// body: 공 몸통 색, dots: 구멍/표정 색, tail: 말풍선 꼬리 표시 여부
export default function Ball({ body = "#ffffff", dots = "#1FA84E", tail = true, className, ...rest }) {
  const holes = [
    [50, 15], [29, 24], [71, 24],
    [17, 47], [83, 47],
    [29, 72], [71, 72],
  ];
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="웃는 피클볼" {...rest}>
      {tail && (
        <path d="M30 78 Q20 92 15 96 Q30 94 40 84 Z" fill={body} />
      )}
      <circle cx="50" cy="49" r="39" fill={body} />
      {holes.map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="4.4" ry="5.4" fill={dots} />
      ))}
      {/* 눈 */}
      <ellipse cx="40" cy="45" rx="4.4" ry="6" fill={dots} />
      <ellipse cx="60" cy="45" rx="4.4" ry="6" fill={dots} />
      {/* 미소 */}
      <path d="M39 62 Q50 73 61 62" fill="none" stroke={dots} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
