# 프로젝트 비교: store-admin-FE vs shoppingmall_admin

## 개요

| 항목 | store-admin-FE | shoppingmall_admin |
|------|---------------|-------------------|
| 프레임워크 | **Next.js 16** (App Router) + React 19 | **Vue 3.5** + Vite 7 |
| 언어 | TypeScript 5 | TypeScript 5.9 |
| 상태관리 | Zustand 5 | Pinia 3 + persistedstate |
| HTTP | fetch 래퍼 (lib/api.ts) | Axios 1.13 (인터셉터) |
| 스타일 | **Tailwind CSS 4** + shadcn/ui | **CSS Variables** (순수 CSS 토큰) |
| 아이콘 | lucide-react | lucide-vue-next |
| UI 라이브러리 | shadcn/ui (base-vega) | 없음 (전체 직접 구현) |
| 리치 텍스트 | TipTap 3.20 | 없음 |
| 드래그앤드롭 | @dnd-kit | 없음 |
| 빌드도구 | Next.js 내장 (Turbopack) | Vite 7 |

---

## 1. 공통점

### 1.1 아키텍처 패턴
- **도메인 기반 폴더 구조**: 페이지/컴포넌트/서비스/타입이 도메인별로 분리
- **레이아웃 이중 구조**: AdminLayout (사이드바+헤더) / AuthLayout (인증 전용)
- **서비스 레이어 분리**: API 호출은 서비스 파일에서 담당, 컴포넌트는 호출만
- **타입 시스템**: 공통 API 응답 타입 (`ApiResponse<T>`, `PageResponse<T>`) + 도메인별 타입

### 1.2 인증 방식
- **JWT + HttpOnly Cookie** 기반 (프론트에서 토큰 직접 접근 안 함)
- **credentials/withCredentials** 포함하여 API 호출
- **401 시 로그인 리다이렉트** 공통 처리
- **라우트 보호**: 미들웨어/네비게이션 가드로 인증 체크

### 1.3 CRUD 패턴
- **목록**: 검색 + 필터 + 페이지네이션 + 정렬
- **등록/수정**: 폼 기반 + 유효성 검사 + 이미지 업로드 (multipart/form-data)
- **삭제**: 확인 다이얼로그 후 처리

### 1.4 API 구조
- **동일한 백엔드 엔드포인트 패턴**: `/api/v1/admin/...`
- **페이지네이션 파라미터**: `page`, `size`, `sort`
- **응답 구조**: `{ success, data, error }` 래핑

### 1.5 공통 기능 도메인
| 기능 | store-admin-FE | shoppingmall_admin |
|------|:-:|:-:|
| 로그인 | O | O |
| 대시보드 | O | O |
| 상품 관리 (CRUD) | O | O |
| 카테고리 관리 | O | O |
| 브랜드 관리 | O | - |
| 관리자 계정 관리 | O | O |

### 1.6 기타 공통
- TypeScript 기반, 타입 안전성 중시
- 사이드바 메뉴 구조 (아이콘 + 계층형)
- 반응형 디자인 고려 (모바일/태블릿)
- 이미지 업로드 시 미리보기 제공

---

## 2. 차이점

### 2.1 프레임워크 & 렌더링

| 항목 | store-admin-FE | shoppingmall_admin |
|------|---------------|-------------------|
| 프레임워크 | React 19 (Next.js App Router) | Vue 3 (Composition API) |
| 렌더링 | SSR/SSG 가능 (서버 컴포넌트) | CSR (SPA) |
| 라우팅 | 파일 기반 (App Router) | 설정 기반 (Vue Router) |
| 빌드 | Next.js 내장 | Vite |
| API 프록시 | Next.js Route Handler (`/app/api/[...path]`) | Vite dev proxy |

### 2.2 스타일링

| 항목 | store-admin-FE | shoppingmall_admin |
|------|---------------|-------------------|
| 방식 | Tailwind CSS 4 유틸리티 클래스 | 순수 CSS + CSS Variables 토큰 |
| 컴포넌트 | shadcn/ui 기반 | 전체 직접 구현 |
| 테마 | Tailwind 토큰 + CSS 변수 | CSS Variables (tokens.css) |
| 파일 구조 | globals.css 하나 | tokens.css + global.css + 도메인별 CSS |
| 폰트 | Next.js font (Inter) | Pretendard (CDN) |

### 2.3 상태관리

| 항목 | store-admin-FE | shoppingmall_admin |
|------|---------------|-------------------|
| 라이브러리 | Zustand | Pinia |
| 스토어 수 | 3개 (auth, sidebar, productCache) | 2개 (auth, counter) |
| 영속성 | 없음 (매 로드 시 API 호출) | localStorage 영속 (persistedstate) |
| 사이드바 상태 | Zustand 전역 스토어 | 컴포넌트 로컬 상태 |

### 2.4 API 호출 레이어

| 항목 | store-admin-FE | shoppingmall_admin |
|------|---------------|-------------------|
| HTTP 클라이언트 | fetch 래퍼 (커스텀) | Axios (인터셉터) |
| 토큰 갱신 | 없음 (미들웨어에서 처리) | Axios 인터셉터에서 401 시 자동 refresh |
| 에러 처리 | ApiError throw → 컴포넌트에서 catch | 인터셉터에서 공통 처리 |
| 서비스 파일 수 | 7개 | 25개 |
| 백엔드 URL | localhost:8080 (프록시) | api-admin.sigdec.click |

### 2.5 기능 범위

**store-admin-FE에만 있는 기능:**
- 사이트 관리 (멀티 사이트 구조)
- 상품 옵션 시스템 (FIXED/FREE 타입, 조합별 SKU/재고)
- 리치 텍스트 에디터 (TipTap)
- 카테고리 드래그앤드롭 정렬
- 상품 할인가 (기간 설정)

**shoppingmall_admin에만 있는 기능:**
| 도메인 | 기능 |
|--------|------|
| 주문 | 주문 목록/상세, 주문 상태 변경, 배송 관리 |
| 회원 | 회원 목록/상세, 등급 관리, 포인트 관리, CS 메모 |
| 클레임 | 반품/환불/교환 관리 |
| 프로모션 | 프로모션 CRUD, 쿠폰 관리 |
| 콘텐츠 | 배너, 팝업, 공지사항, FAQ 관리 |
| 고객센터 | 1:1 문의, 상품 Q&A, 리뷰 관리 |
| 전시 | 프론트 전시/레이아웃 관리 |
| 설정 | 테넌트 설정, 헤더 메뉴, 약관 관리 |
| 태그 | 상품 태그 관리 |
| 인증 추가 | 이메일 찾기, 비밀번호 재설정 |

### 2.6 디렉토리 구조 비교

```
store-admin-FE (Next.js)          shoppingmall_admin (Vue)
─────────────────────────          ──────────────────────────
app/                               src/pages/
  (admin)/    ← 라우트 그룹          auth/
  (auth)/                            dashboard/
components/                          products/
  ui/         ← shadcn/ui           orders/
  layout/                            members/
  common/                            ...
  products/                       src/components/
  categories/                       common/
  brands/                         src/layouts/
  sites/                            AdminLayout.vue
  admins/                           AuthLayout.vue
services/                         src/api/         ← 25개 서비스
stores/                           src/stores/
types/                            src/types/
hooks/                            src/styles/
lib/                                tokens.css
data/                               global.css
                                    layouts/
                                    pages/
```

### 2.7 타입 정의 규모

| 항목 | store-admin-FE | shoppingmall_admin |
|------|---------------|-------------------|
| 타입 파일 | 6개 (도메인별 분리) | 2개 (api.ts + index.ts 통합) |
| 도메인 범위 | product, category, brand, site, admin, api | auth, admin, member, product, category, tag, order, claim, delivery, refund, promotion, coupon, api |
| 상품 옵션 타입 | ProductOption, ProductOptionValue, ProductSku | 없음 (단순 구조) |

---

## 3. 통합 시 고려사항

### 3.1 store-admin-FE가 가져와야 할 것 (shoppingmall_admin → store-admin-FE)

기능 이관이 필요한 도메인:

| 우선순위 | 도메인 | 이유 |
|---------|--------|------|
| 높음 | 주문 관리 | 핵심 커머스 기능 |
| 높음 | 회원 관리 (+ 등급/포인트) | 사이트별 회원 관리 필요 |
| 높음 | 콘텐츠 관리 (배너/팝업/공지) | 사이트별 페이지 배너 관리 |
| 중간 | 프로모션/쿠폰 | 마케팅 기능 |
| 중간 | 클레임 관리 | CS 운영 필수 |
| 중간 | 고객센터 (문의/Q&A/리뷰) | CS 운영 |
| 낮음 | 전시 관리 | 프론트 연동 필요 |
| 낮음 | 설정 (테넌트/약관) | 사이트별 설정으로 확장 |

### 3.2 구조적 차이로 인한 변환 필요

| 항목 | 변환 내용 |
|------|----------|
| Vue → React | 컴포넌트, 훅, 라우팅 전체 재작성 |
| Pinia → Zustand | 스토어 패턴 변환 |
| Axios → fetch 래퍼 | 서비스 레이어 재작성 (인터셉터 → 미들웨어) |
| CSS → Tailwind | 스타일 전체 마이그레이션 |
| Vue Router → App Router | 파일 기반 라우팅으로 전환 |
| 단일 types/index.ts → 도메인별 분리 | 타입 파일 분리 |

### 3.3 store-admin-FE의 기존 강점 (유지해야 할 것)

- **멀티 사이트 구조**: 사이트별 카테고리/상품 관리 이미 구현
- **상품 옵션 시스템**: 옵션 타입/조합/SKU 관리 고도화
- **shadcn/ui 기반 UI**: 일관된 컴포넌트 시스템
- **리치 텍스트 에디터**: TipTap 기반 상품 설명 편집
- **드래그앤드롭**: 카테고리 순서 관리
- **Next.js 서버 기능**: API 프록시, 미들웨어, 서버 컴포넌트

### 3.4 shoppingmall_admin의 참고할 패턴

- **토큰 자동 갱신**: Axios 인터셉터의 401 → refresh → retry 패턴
- **CSS 토큰 시스템**: `tokens.css`의 체계적인 디자인 토큰 구조
- **이메일 찾기/비밀번호 재설정**: 인증 플로우 확장
- **도메인별 상세 페이지 스타일**: 페이지별 CSS 분리 구조

---

## 4. 요약 다이어그램

```
shoppingmall_admin (Vue 3)              store-admin-FE (Next.js 16)
┌──────────────────────────┐            ┌──────────────────────────┐
│  인증 (로그인/찾기/재설정) │            │  인증 (로그인)            │
│  대시보드                 │            │  대시보드                 │
│  상품 관리                │  ──공통──▶ │  상품 관리 (+ 옵션 고도화) │
│  카테고리/태그 관리        │            │  카테고리 관리 (+ DnD)    │
│  관리자 관리              │            │  관리자 관리              │
│                          │            │  브랜드 관리              │
│                          │            │  사이트 관리 (멀티사이트)  │
├──────────────────────────┤            ├──────────────────────────┤
│  ▼ 이관 대상 기능 ▼       │            │                          │
│  주문 관리                │  ────────▶ │  (추가 예정)              │
│  회원 관리 (등급/포인트)   │  ────────▶ │  (추가 예정)              │
│  콘텐츠 (배너/팝업/공지)   │  ────────▶ │  (추가 예정)              │
│  프로모션/쿠폰             │  ────────▶ │  (추가 예정)              │
│  클레임 (반품/환불)        │  ────────▶ │  (추가 예정)              │
│  고객센터 (문의/Q&A/리뷰)  │  ────────▶ │  (추가 예정)              │
│  전시 관리                │  ────────▶ │  (추가 예정)              │
│  설정 (테넌트/약관)        │  ────────▶ │  (추가 예정)              │
└──────────────────────────┘            └──────────────────────────┘
```
