// 관리자에서 입력한 줄바꿈(\n)을 실제 줄바꿈으로 렌더한다.
export default function Multiline({ text }) {
  const lines = String(text ?? "").split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}
