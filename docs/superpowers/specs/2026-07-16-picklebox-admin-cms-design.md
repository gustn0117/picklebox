# PICKLEBOX 관리자(CMS) 설계 문서

- 날짜: 2026-07-16
- 대상 프로젝트: `피클박스/` (Next.js 15 App Router, 자체호스팅, https://picklebox.kr · picklebox.hsweb.pics, 포트 3080)
- 목적: 비개발자(조민정 대표/운영진)가 이벤트·아카데미·여행·굿즈·배너·사진·저널 등 콘텐츠를 직접 등록·수정·노출관리할 수 있는 관리자 페이지 추가

## 1. 배경 / 현재 상태

- 현재 모든 콘텐츠가 코드에 하드코딩되어 있음: `app/lib/site.js`(SUBBRANDS, SHOPS, LINKS, NAV, BUSINESS), 각 페이지 상수(events의 LINEUP/SCHEDULE, journal의 POSTS, about의 VALUES/PICKLE_APPEAL/TIMELINE, home의 STATS/WHY/STEPS 등).
- 콘텐츠 변경 = 코드 수정 → git push → 자동배포. 비개발자가 직접 못 함.
- 같은 서버의 [[miso-tour]]가 Next.js + Prisma/SQLite + 간단 관리자(공용 비번) 패턴을 이미 검증. 이 구조를 재사용.

## 2. 확정된 결정 (사용자 합의)

| 항목 | 결정 |
|---|---|
| 진행 범위 | 전체 콘텐츠 한 번에 (8종) |
| 로그인 | 공용 비밀번호 하나 (기본 `1234`, 환경변수로 변경 가능) |
| 문구 편집 범위 | 구조화 콘텐츠 목록 + 메인 배너 + 각 섹션 핵심 문구(제목/설명). 사이트의 모든 미세 문구까지는 아님 |
| 구현 방식 | 커스텀 관리자 + SQLite/Prisma (미소투어와 동일 스택) |
| 여행 상품 | 소개 수준만 (이미지 + 설명 + 외부 링크). 판매/예약/결제 없음 |

## 3. 아키텍처

- **동일 Next.js 앱에 `/admin` 경로 추가** (별도 서비스 아님). 같은 도메인, 같은 배포 흐름.
- **데이터 저장: SQLite + Prisma.** DB 파일은 **영속 볼륨 `/app/data`** 에 위치 → 자동배포(리빌드) 시에도 콘텐츠 유지.
- **이미지 업로드: 서버 볼륨 `/app/data/uploads`** 에 저장, `/uploads/...` 경로로 서빙(정적 파일 라우트). git에 안 들어가므로 리빌드로 지워지지 않음.
- **인증: 단일 비밀번호.** 환경변수 `ADMIN_PASSWORD`(기본 `1234`). 로그인 성공 시 서명된 세션 쿠키 발급, `/admin/*`와 관리 API는 미들웨어로 보호.
- **공개 페이지: DB에서 읽는 서버 컴포넌트로 전환.** 관리자 저장 시 해당 경로 `revalidatePath`로 갱신 → 방문자에게 즉시 반영. (현재 정적 프리렌더 → 동적/ISR. 현 트래픽에서 체감 차이 없음.)
- **초기 데이터(seed):** 현재 하드코딩된 콘텐츠를 DB로 이관하는 seed 스크립트. 관리자 최초 실행 시 기존 내용이 그대로 보이고 거기서 편집.
- **마이그레이션:** 컨테이너 시작 시 `prisma migrate deploy` 자동 실행(엔트리포인트).

## 4. 콘텐츠 모델 (8종)

모든 콘텐츠 공통 필드: `id`, `visible`(노출 on/off), `sortOrder`(순서), `createdAt`, `updatedAt`.

1. **Banner(배너)** — `page`(home/about/…), `imageUrl`, `title`, `subtitle`, `linkUrl?`
2. **Event(이벤트)** — `kind`(lineup|schedule), `titleEn`, `titleKo`, `desc`, `period?`(예: 상반기/매월), `imageUrl?`
3. **AcademyProgram(아카데미)** — `titleEn?`, `titleKo`, `desc`, `imageUrl?`
4. **Tour(여행 상품, 소개 전용)** — `title`, `desc`, `period?`, `imageUrl?`, `linkUrl?`
5. **Goods(굿즈)** — `name`, `desc?`, `imageUrl?`, `buyUrl`
6. **JournalPost(저널)** — `category`, `title`, `type`(article|video|soon), `articleUrl?`, `videoIds?`(유튜브 ID 배열, 썸네일 자동), `soon`(준비중 배지)
7. **Photo(사진/갤러리)** — `imageUrl`, `caption?`, `album?`(분류용, 선택)
8. **SiteCopy(핵심 문구)** — `key`(예: `hero.tagline`), `label`(관리자 표시명), `value`(텍스트). 편집 가능한 주요 문구만 등록.

> 필드는 구현 중 실제 화면에 맞춰 소폭 조정될 수 있음(추가/생략). 판매성 필드(재고·가격 결제 등)는 포함하지 않음.

## 5. 관리 화면 (UX)

- `/admin/login` → 비밀번호 입력 → `/admin` 대시보드(콘텐츠 8종 카드).
- 종류별 목록 화면: **등록 · 수정 · 삭제**, **노출 토글(눈 아이콘)**, **순서 변경**(위/아래 또는 드래그), **이미지 끌어다 업로드**(미리보기 포함).
- 한국어 UI, 큰 버튼, 필수 항목만. 저장 시 "저장됨" 피드백 + 실사이트 반영.
- 사이트 본문 톤과 별개로 관리 화면은 **밝고 단순한 폼 위주**(가독성 우선).

## 6. 데이터 흐름

1. 관리자가 항목 저장 → 관리 API가 DB 기록 → 관련 공개 경로 `revalidatePath` → 방문자 최신 반영.
2. 이미지 업로드 → 볼륨 `/app/data/uploads/<uuid>.<ext>` 저장 → DB엔 URL만 기록.
3. 노출 off → 공개 페이지 쿼리에서 제외. 순서 → `sortOrder` 기준 정렬.

## 7. 배포 / 안전

- 기존 webhook 자동배포(`git push` → `docker compose up -d --build`) 그대로 사용.
- `docker-compose.yml`에 **DB·업로드용 볼륨 `/app/data` 유지**(hsweb-deploy의 "볼륨 /app/data 1개" 관례와 일치). 리빌드해도 데이터 보존.
- 환경변수: `ADMIN_PASSWORD`, `DATABASE_URL=file:/app/data/picklebox.db`, `SESSION_SECRET`.
- 롤백: DB는 볼륨에 있으므로 코드 롤백과 독립. seed는 최초 1회만(기존 데이터 덮어쓰지 않도록 가드).

## 8. 범위 밖 (YAGNI)

- 판매·예약·결제, 재고 관리
- 개인별 계정/권한 등급 (지금은 단일 공용 비번; 추후 확장 여지만 남김)
- 사이트 모든 미세 문구의 CMS화 (핵심 문구만)
- 다국어 관리, 버전 관리/초안, 이미지 자동 리사이즈 파이프라인(초기엔 업로드 원본 사용, 필요 시 후속)

## 9. 리스크 / 유의

- 공개 페이지 정적→동적 전환: 캐싱 전략(revalidate) 잘못 잡으면 반영 지연 또는 과도한 DB 조회. → 저장 시 명시적 `revalidatePath` + 낮은 트래픽 고려한 단순 전략.
- 이미지 원본 크기 큰 파일 업로드 시 로딩 저하 가능. → 업로드 시 용량 안내, 후속으로 리사이즈 도입 여지.
- 자동배포 리빌드가 마이그레이션과 겹칠 때 순서 보장 필요. → 엔트리포인트에서 `migrate deploy` 완료 후 서버 기동.
