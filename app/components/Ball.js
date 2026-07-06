// 웃는 피클볼 심볼 — 로고 모티프를 SVG로 재현해 자유롭게 리컬러/애니메이션한다.
// body: 공 몸통 색, dots: 구멍/표정 색, tail: 말풍선 꼬리 표시 여부
export default function Ball({ body = "#ffffff", dots = "#009eae", tail = true, className, ...rest }) {
  // 로고와 동일하게 가로로 긴 타원 구멍. 모두 공 안쪽에 위치(맨 위 구멍 삐짐 방지).
  const holes = [
    [50, 18],
    [29, 31], [71, 31],
    [20, 51], [80, 51],
    [32, 71], [68, 71],
  ];
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="웃는 피클볼" {...rest}>
      {tail && (
        <path d="M30 78 Q20 92 15 96 Q30 94 40 84 Z" fill={body} />
      )}
      <circle cx="50" cy="49" r="39" fill={body} />
      {holes.map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="5.6" ry="4.2" fill={dots} />
      ))}
      {/* 눈 */}
      <ellipse cx="40" cy="45" rx="4.4" ry="6" fill={dots} />
      <ellipse cx="60" cy="45" rx="4.4" ry="6" fill={dots} />
      {/* 미소 */}
      <path d="M39 62 Q50 73 61 62" fill="none" stroke={dots} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
