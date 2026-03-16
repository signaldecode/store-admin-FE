## 핵심 목표 (절대 우선순위)

1️⃣ **구조가 튼튼하고 재사용 가능한 템플릿 유지**
2️⃣ **고객사 맞춤 커스터마이징을 “최소 수정”으로 빠르게 수행**
3️⃣ **구조 = 코드, 내용 = data, 스타일 = scss + token** 으로 분리
4️⃣ **간결한 JavaScript 코드로 웹 최적화** (불필요한 추상화/과설계 금지)
5️⃣ **SEO / AEO / GEO에 유리한 구조를 기본 내장**
6️⃣ **웹 접근성(WCAG, A11y)을 기본적으로 준수**
7️⃣ **커스터마이징은 `data + 스타일 토큰 + 필요 시 API 연동부`만 수정**

---

## 개발 사고 순서 (항상 이 순서로 설계/출력)

레이아웃 → 페이지 → 컨테이너 → 블록/요소 → UI → 데이터 → SEO/AEO/GEO/A11y

---

## 기술 스택

- **Next.js (App Router)**
- **React + TSX**
- **JavaScript**
- **State: Zustand (기본)**
- **SCSS + Design Token System**
- Backend: **Java (Spring 등, REST `/api/...`)**
- SEO/AEO: **Next Metadata API + JSON-LD 구조화 데이터**

---

## 강의 플랫폼 URL 식별자 규칙 (slug) — 필수

### slug 정의
- slug는 URL에 들어가는 “사람이 읽기 좋은 식별자”다.
- 강의 상세 페이지는 `/courses/[slug]` 구조를 사용한다.
- 코드에서 id 기반 라우팅(`/courses/123`)을 기본으로 사용하지 않는다.

### slug 사용 이유 (템플릿 철학과 연결)
- SEO/AEO에 유리한 의미 있는 URL을 보장한다.
- 고객사 커스터마이징 시 URL 구조가 안정적으로 유지된다.
- 강의 데이터 매핑을 data 중심으로 관리할 수 있다.

### data 필드 규칙
- 각 강의 엔티티는 반드시 `slug`를 포함한다.
- 예: `data.courses[].slug`
- `slug`는 중복되면 안 된다(유일).

### slug 포맷 규칙 (권장)
- 소문자 영문/숫자/하이픈만 허용: `react-masterclass`, `js-basic-101`
- 공백은 하이픈으로 치환, 특수문자 제거
- 중복 시 짧은 접미사 추가: `react-masterclass-2` 또는 `react-masterclass-beginner`

### 라우팅/렌더링 규칙
- `app/(site)/courses/[slug]/page.jsx`에서 `params.slug`로 강의 데이터를 찾는다.
- 강의 데이터는 `data/mainData.json` 또는 확장 data 파일에서 로드한다.
- 강의 제목/요약/썸네일 alt/CTA ariaLabel/FAQ 등은 전부 data에서 가져온다.

### SEO/JSON-LD 규칙
- `/courses/[slug]`는 강의 data 기반으로 metadata(title/description/og)를 생성한다.
- FAQ가 있으면 data 기반으로 `FAQPage` JSON-LD를 주입한다.
- breadcrumb는 `BreadcrumbList` JSON-LD로 구성 가능하게 한다.

---

## 폴더 구조 (강의 플랫폼 템플릿)

자동 생성 / 수정 금지:
- `.next/`
- `node_modules/`

권장 구조:
project

├─ app

│ ├─ (site)

│ │ ├─ layout.jsx

│ │ ├─ page.jsx # 홈(랜딩)

│ │ ├─ about

│ │ │ └─ page.jsx

│ │ ├─ courses

│ │ │ ├─ page.jsx # 강의 목록

│ │ │ └─ [slug]

│ │ │ └─ page.jsx # 강의 상세(SEO 핵심)

│ │ ├─ account

│ │ │ ├─ page.jsx

│ │ │ └─ orders

│ │ │ └─ page.jsx

│ │ └─ etc

│ │ ├─ terms

│ │ │ └─ page.jsx

│ │ └─ privacy

│ │ └─ page.jsx

│ │

│ ├─ api # Next Route Handler(선택) - 프록시/헬퍼

│ └─ providers.jsx # (선택) 전역 Provider

│

├─ components

│ ├─ common

│ │ ├─ AppHeader.jsx

│ │ ├─ AppFooter.jsx

│ │ ├─ AppLogo.jsx

│ │ └─ SkipToContent.jsx

│ │

│ ├─ layout

│ │ ├─ GlobalNav.jsx

│ │ ├─ SidebarMenu.jsx

│ │ └─ Modal.jsx

│ │

│ ├─ ui

│ │ ├─ Button.jsx

│ │ ├─ Input.jsx

│ │ ├─ SectionTitle.jsx

│ │ ├─ Accordion.jsx # FAQ (A11y 필수)

│ │ ├─ Tabs.jsx

│ │ └─ Pagination.jsx

│ │

│ └─ containers

│ ├─ HomeHeroContainer.jsx

│ ├─ CourseGridContainer.jsx

│ ├─ CourseDetailContainer.jsx

│ ├─ TestimonialsContainer.jsx

│ └─ FaqContainer.jsx

│

├─ data # ⭐ UI/문구/접근성/SEO/AEO/GEO/엔티티 데이터

│ └─ mainData.json

│

├─ assets

│ ├─ images

│ │ ├─ logo

│ │ ├─ banners

│ │ └─ courses

│ └─ styles

│ ├─ tokens

│ │ ├─ _colors.scss

│ │ ├─ _typography.scss

│ │ ├─ _spacing.scss

│ │ └─ _z-index.scss

│ ├─ base

│ ├─ mixins

│ ├─ components

│ ├─ themes

│ └─ main.scss

│

├─ composables (or lib) # 비즈니스 로직/헬퍼 함수

├─ stores # Zustand stores

├─ config

├─ public

└─ next.config.js

---

## Data 설계 원칙 (SEO/AEO/GEO + A11y 포함)

UI 텍스트 / 이미지 경로 / 섹션 정보 / 접근성용 텍스트 / 메타 정보 등은
**절대 페이지/컴포넌트에 하드코딩하지 않는다.**

반드시 `data/mainData.json` 또는 확장된 data 파일에서 관리한다.

특히 아래는 **반드시 data에서 값 가져오기**:
- 페이지 타이틀 / 메타 설명 / 키워드 / OG 태그 등
- 이미지 alt 텍스트
- 버튼 / 링크 label, aria-label
- 섹션 제목 / 설명
- FAQ / Q&A 데이터
- 지역/주소/좌표/영업시간 등 GEO 관련 정보
- 강의 요약(AEO용 한 문장), 커리큘럼, 대상, 난이도, 기간 등

추가 원칙:
- `seo`(title/description/og)도 **가능하면 data에 둔다.**
- `seo`가 없으면, 최소한 `title/summary/thumbnail`로 **자동 생성**하되,
  컴포넌트 내부에서 임의 문구(CTA/aria/alt 포함)를 생성하지 않는다.

필드 네이밍 예:
- `name`, `title`, `label`, `description`, `summary`
- `alt`, `ariaLabel`, `ariaDescription`
- `slug`, `category`, `level`, `duration`, `price`
- `country`, `city`, `latitude`, `longitude`, `address`, `postalCode`, `businessHours`

---

## 네이밍 규칙

컴포넌트 파일명 (PascalCase):
- 레이아웃: `SomethingLayout.jsx`
- 큰 섹션/블록: `SomethingContainer.jsx`
- 소규모 래퍼: `SomethingWrap.jsx`
- 범용 박스: `SomethingBox.jsx`

리스트:
- ul → `XxxList`
- li → `XxxListItem`

CSS 클래스:
- kebab-case
- ul 관련: `-list` (예: `card-list`)
- li 관련: `-item` (예: `card-list-item`)
- 스타일 용도의 id 사용 금지 (form label용 id/for는 허용)

---

## 스타일 / 토큰 규칙 (절대 준수)

- inline style 금지
- HEX / px 직접 사용 금지
- 컴포넌트 파일 내 스타일 선언 금지 (CSS-in-JS 금지)
- 항상 토큰 사용 (`_colors.scss`, `_spacing.scss`, `_typography.scss`, `_z-index.scss`)

SCSS import 순서:
1) tokens
2) mixins / functions
3) base
4) components
5) themes

---

## 🔎 SEO / AEO / GEO / A11y 상세 규칙 (필수)

### 1️⃣ SEO

[구조 & 마크업]
- 의미 있는 시맨틱 태그: `<main> <header> <footer> <nav> <section> <article> <aside>`
- Heading 계층: **페이지당 H1 1개**, 이후 H2 → H3
- 제목 텍스트는 data의 `title` 기반

[메타 태그]
- Next App Router 기준으로 **Metadata API 사용**
- 문자열 하드코딩 금지: `data.site` 또는 `data.pages.*`에서 로드
- 강의 상세(`/courses/[slug]`)는 course data로 title/description/OG 구성

[URL & 라우팅]
- 의미 있는 슬러그 `/courses`, `/courses/[slug]`, `/account/orders` 등
- 페이지 내용과 URL 일관성 유지

[구조화 데이터(JSON-LD)]
- FAQ / Course / Organization / LocalBusiness / BreadcrumbList 등
- JSON-LD 텍스트도 data에서 가져온다.

### 2️⃣ AEO (Answer Engine Optimization)
- 주요 섹션 상단에 “한 문장 요약/핵심 답변”을 data의 `summary`/`description`으로 두고 UI에서 눈에 띄게 렌더링한다.
- FAQ는 질문-답변 구조를 data로 관리하고, 페이지에 명확히 노출한다.

### 3️⃣ GEO (Local SEO)
- `data.geo`에 `countryCode, city, address, postalCode, latitude, longitude, phone, businessHours` 정의
- “오시는 길/연락처/운영시간” 섹션은 geo 기반으로 렌더링
- 필요 시 LocalBusiness JSON-LD를 `data.site + data.geo`로 생성

### 4️⃣ A11y (WCAG)

[Alt/Aria data 기반]
- `alt`, `aria-label`, `aria-describedby`, `title`은 **항상 data에서만**
- 컴포넌트 내부에 문자열 직접 쓰지 않는다.

[키보드 접근성]
- 인터랙션 요소는 `<button>`, `<a>`, `<input>` 사용
- Enter/Space 조작 가능해야 함
- Tab 순서가 논리적인 DOM 순서를 따른다.

[폼 레이블링]
- `<label htmlFor="id">` + `<input id="id">`
- 에러/힌트는 `aria-describedby` 연결 가능하도록 id를 data로 관리 가능

[FAQ Accordion]
- `aria-expanded`, `aria-controls`, `id` 매칭 필수
- 키보드 토글 지원 필수

---

## Backend API 계약 (Spring REST) — 기본 스펙

기본 엔드포인트:
- 강의 목록: `GET /api/courses?category&level&sort&page&pageSize&query`
- 강의 상세: `GET /api/courses/{slug}`
- 내 수강: `GET /api/me/courses`
- 주문 생성: `POST /api/orders` body: `{ courseSlug, paymentMethod }`
- 주문 내역: `GET /api/me/orders?page&pageSize`

규칙:
- 프론트 라우팅은 slug 기준(`/courses/[slug]`), 백엔드도 slug로 상세 조회를 제공한다.
- 목록 응답은 카드에 필요한 최소 필드만 내려준다.
- 접근성 텍스트(alt/aria), UI 카피는 data에서 관리한다(백엔드에 의존하지 않는다).
- 필요 시 Next Route Handler(`/app/api/...`)로 프록시하여 도메인/인증 정책을 안정화한다.

---

## “최소 수정 커스터마이징” 원칙 (외주용)

고객사 변경 시, 기본적으로 아래만 수정하게 설계한다:
- `data/mainData.json` (문구/구성/SEO/AEO/GEO/A11y/강의 데이터)
- `assets/styles/tokens/*` (브랜드 컬러/타이포/스페이싱/레이어)
- 필요 시 `config` 또는 API base URL 정도만 수정

컴포넌트/페이지 구조 변경은 **최후의 수단**이다.

---

## 금지 (절대)

- inline style
- HEX / px 직접 사용
- 컴포넌트 파일 내 스타일 선언
- UI 텍스트/alt/aria 하드코딩
- data 구조 무시하고 임의 문자열 삽입
- SEO/AEO/GEO/A11y 무시한 마크업 제안
- 불필요한 타입 없는 any 남발(이 프로젝트는 JS이지만, “대충 때우기” 금지)

---

## 기능/페이지 개발 시 “답변 출력 형식” (반드시 지킬 것)

어떤 기능/페이지/컴포넌트를 생성/수정할 때, 답변은 아래 형식을 따른다.

1️⃣ 요구 요약
2️⃣ 구조 설계 트리 (레이아웃 → 페이지 → 컨테이너 → 요소)
3️⃣ 생성/수정 파일 목록 (상대 경로)
4️⃣ 코드 (JSX + JS + SCSS + 토큰 사용)
5️⃣ 연결되는 data 구조
6️⃣ SEO/AEO/GEO & A11y 관점에서 무엇을 어떻게 준수했는지 상세 설명
7️⃣ 어떤 data/토큰을 바꾸면 다른 사이트로 쉽게 커스터마이징 되는지 설명

---

## MCP 서버 설정 (필수)

`.mcp.json` 또는 사용자 설정에 아래를 구성한다.

```json
{
  "context7": { "type": "http", "url": "https://mcp.context7.com/mcp" },
  "sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
  },
  "playwright": {
    "type": "stdio",
    "command": "npx",
    "args": ["@playwright/mcp@latest"],
    "env": {}
  }
}
