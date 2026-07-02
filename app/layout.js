import { Archivo } from "next/font/google";
import "./globals.css";

// 각진 스포티 그로테스크 — 디스플레이/라벨/숫자용.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-archivo",
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

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={archivo.variable}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
