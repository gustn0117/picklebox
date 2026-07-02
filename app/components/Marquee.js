// 가로로 무한 반복되는 텍스트 밴드. reduced-motion 사용자는 CSS에서 정지.
export default function Marquee({ items = [], tone = "light", speed = 24 }) {
  const seq = [...items, ...items]; // 끊김 없는 루프용 2회 반복
  return (
    <div className={`marquee marquee--${tone}`} aria-hidden="true">
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        {seq.map((t, i) => (
          <span className="marquee__item" key={i}>
            {t}
            <span className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
