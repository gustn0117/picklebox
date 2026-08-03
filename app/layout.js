import { Anton, Archivo, Space_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import "./globals.css";
import Fx from "./components/Fx";
import Maintenance from "./components/Maintenance";
import { getCopyValue } from "./lib/copy";
import { verifyToken, COOKIE_NAME } from "./lib/auth";

export const dynamic = "force-dynamic";

// 헤비 콘덴스드 대문자 디스플레이 — 히어로/워드마크/큰 제목.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

// 라벨·버튼·숫자용 그로테스크(라틴).
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

// 테크/데이터 라벨용 모노스페이스 (좌표·상태·넘버링).
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://picklebox.example"),
  title: "PICKLEBOX — 피클볼로 여는 즐거운 선물상자",
  description:
    "PICKLEBOX는 24시간 무인 스마트 피클볼 클럽을 중심으로 코트 대관, 레슨, 커뮤니티, 굿즈, 여행을 연결하는 피클볼 라이프스타일 플랫폼입니다. Open the Box, Play the Joy.",
  openGraph: {
    title: "PICKLEBOX — 피클볼로 여는 즐거운 선물상자",
    description: "피클볼을 치고, 웃고, 연결되며 일상에 즐거움을 선물하는 공간, PICKLEBOX",
    images: ["/logo.png"],
    type: "website",
  },
  icons: { icon: "/logo.png" },
};

export default async function RootLayout({ children }) {
  // 관리자 색상 설정을 CSS 디자인 토큰에 연결한다. 잘못된 값은 안전하게 기본값으로 처리한다.
  const [bg, textMain, textSoft, textAccent, textGreen, textOnImage] = await Promise.all([
    getCopyValue("site.bgColor", ""),
    getCopyValue("site.textMainColor", "#173328"),
    getCopyValue("site.textSoftColor", "#4e6458"),
    getCopyValue("site.textAccentColor", "#ff7a2f"),
    getCopyValue("site.textGreenColor", "#1cad5e"),
    getCopyValue("site.textOnImageColor", "#ffffff"),
  ]);
  const color = (value, fallback) => /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
  const themeStyle = {
    "--text-main": color(textMain, "#173328"),
    "--text-soft": color(textSoft, "#4e6458"),
    "--text-accent": color(textAccent, "#ff7a2f"),
    "--text-green": color(textGreen, "#1cad5e"),
    "--text-on-image": color(textOnImage, "#ffffff"),
  };
  if (/^#[0-9a-fA-F]{6}$/.test(bg)) {
    themeStyle["--bg"] = bg;
    themeStyle["--bg-2"] = `color-mix(in srgb, ${bg}, #000 7%)`;
  }

  // 준비중(공사중) 게이트 — ON이고, 관리자 페이지가 아니고, 로그인한 관리자가 아니면 준비중 화면을 보여준다.
  const h = await headers();
  const pathname = h.get("x-pathname") || "";
  const qs = h.get("x-qs") || "";
  const isAdminArea = pathname.startsWith("/admin");
  const maintOn = !!(await getCopyValue("site.maintenance", ""));
  let gated = false;
  if (maintOn && !isAdminArea) {
    const authed = await verifyToken((await cookies()).get(COOKIE_NAME)?.value);
    // 관리자는 통과(실제 사이트 열람). 단 ?asguest=1 이면 관리자도 고객 화면 미리보기.
    gated = !authed || /(?:^|[?&])asguest=1(?:&|$)/.test(qs);
  }

  return (
    <html lang="ko" className={`${anton.variable} ${archivo.variable} ${spaceMono.variable}`} style={themeStyle}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{gated ? <Maintenance /> : <><Fx />{children}</>}</body>
    </html>
  );
}
