# PICKLEBOX 홈페이지

피클볼 라이프스타일 플랫폼 **PICKLEBOX**의 브랜드 원페이지 (Next.js).

## 실행

```bash
npm install       # 최초 1회
npm run dev        # 개발 서버 → http://localhost:3000
npm run build && npm run start   # 프로덕션
```

> 주의: `npm run dev`가 켜진 상태로 `npm run build`를 돌리면 `.next` 산출물이 꼬입니다.
> 빌드 전에는 dev 서버를 끄거나, 문제가 생기면 `rm -rf .next` 후 다시 빌드하세요.

## 콘텐츠 수정 위치

- **문구/링크/사업자정보/서브브랜드**: [app/lib/site.js](app/lib/site.js) — 한 파일에서 관리
- **섹션 구성/카피**: [app/page.js](app/page.js)
- **색·타이포·간격 등 디자인**: [app/globals.css](app/globals.css)
- **로고 심볼(웃는 피클볼) SVG**: [app/components/Ball.js](app/components/Ball.js)
- **로고 이미지**: [public/logo.png](public/logo.png)

## 반영된 링크

- 스마트스토어: https://smartstore.naver.com/joytennis
- 인스타그램: @piclebox.official · @tennis_cmj · @tennisforest
- 유튜브: 조민정테니스TV

## 사업자 정보

테니스포레 · 대표 조민정 · 사업자등록번호 407-10-93280
서울특별시 성동구 서울숲2길 32-14, 지하1층 B102호 (성수동1가, 갤러리아 포레)

## 아직 자료가 오면 채울 곳 (플레이스홀더)

- 코트/라운지 실제 사진 → 히어로·스토리·오시는길 이미지
- 요금·운영시간·예약 링크 → 레슨/멤버십 CTA
- 지도 임베드(네이버/구글) → 현재는 지도 링크 카드로 대체
