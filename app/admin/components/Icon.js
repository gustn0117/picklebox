// 관리자 UI 아이콘 세트 — 이모지 대신 인라인 SVG(라인 아이콘, currentColor).
// 서버·클라이언트 컴포넌트 양쪽에서 사용 가능(훅 없음).
const PATHS = {
  banner: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M4 17l4.5-4.5 3 3L15 12l5 5" />
    </>
  ),
  events: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M8 3v4M16 3v4" />
      <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  academy: (
    <>
      <path d="M2 9l10-4 10 4-10 4-10-4z" />
      <path d="M6 11v4.5c0 1.2 3 2.5 6 2.5s6-1.3 6-2.5V11" />
      <path d="M22 9v5" />
    </>
  ),
  tours: (
    <>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </>
  ),
  goods: (
    <>
      <path d="M6.5 7h11l1 13h-13l1-13z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </>
  ),
  journal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8.5h6M7 12h10M7 15.5h10" />
    </>
  ),
  photos: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8.5 7l1.3-2h4.4L15.5 7" />
      <circle cx="12" cy="13.5" r="3.2" />
    </>
  ),
  copy: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </>
  ),
  partners: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M9.9 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a15.8 15.8 0 0 1-3.3 4M6.1 6.1C3.6 7.7 2 12 2 12s3.5 7 10 7a9.5 9.5 0 0 0 4-.9" />
      <path d="M3 3l18 18" />
    </>
  ),
  up: <path d="M6 15l6-6 6 6" />,
  down: <path d="M6 9l6 6 6-6" />,
  back: <path d="M19 12H5M12 19l-7-7 7-7" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5.5" />,
};

export default function Icon({ name, size = 22, className, style }) {
  const p = PATHS[name];
  if (!p) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {p}
    </svg>
  );
}
