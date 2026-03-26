# 통합 관리자 페이지 로드맵

> store-admin-FE를 멀티사이트 통합 관리자로 전환하기 위한 단계별 계획

---

## Phase 0: 기반 정비

기존 구조를 새 도메인 추가에 적합하게 준비한다.

### 0-1. 사이드바 메뉴 그룹화
현재 메뉴가 flat 리스트 → **그룹(섹션)** 구조로 변경

```
상품            ← 그룹
  상품 관리
  카테고리
  브랜드
주문            ← 그룹
  주문 관리
  클레임 (반품/환불)
회원            ← 그룹
  회원 관리
  등급/포인트
콘텐츠          ← 그룹
  배너
  팝업
  공지사항
  FAQ
마케팅          ← 그룹
  프로모션
  쿠폰
고객센터        ← 그룹
  1:1 문의
  상품 Q&A
  리뷰
설정            ← 그룹
  사이트 관리
  관리자 계정
  약관/정책
```

**수정 파일:**
- `data/menuData.ts` — MenuItem에 `group` 필드 추가
- `components/layout/Sidebar.tsx` — 그룹 렌더링
- `data/labels.ts` — 메뉴 그룹 라벨 추가

### 0-2. 공통 상수 확장
`lib/constants.ts`에 새 도메인 상수 추가:
- `ORDER_STATUS` — PENDING, PAID, SHIPPING, DELIVERED, CANCELLED, ...
- `CLAIM_TYPE` — RETURN, REFUND, EXCHANGE
- `CLAIM_STATUS` — REQUESTED, APPROVED, REJECTED, COMPLETED, ...
- `MEMBER_STATUS` — ACTIVE, DORMANT, WITHDRAWN
- `INQUIRY_STATUS` — WAITING, ANSWERED
- `NOTICE_TYPE` — GENERAL, EVENT, SYSTEM
- `BANNER_POSITION` — MAIN_TOP, MAIN_MIDDLE, ...
- `COUPON_STATUS` — ACTIVE, EXPIRED, STOPPED

### 0-3. 공통 컴포넌트 보강
- `StatusBadge` — 새 도메인 상태값 색상 매핑 추가
- `DateRangePicker` — 배너/프로모션/쿠폰 기간 설정용 (신규)
- `DetailPageLayout` — 상세 페이지 공통 레이아웃 (신규)

---

## Phase 1: 주문 관리 (핵심)

### 생성 파일
| 파일 | 설명 |
|------|------|
| `types/order.ts` | Order, OrderItem, OrderListParams |
| `services/orderService.ts` | CRUD + 상태 변경 API |
| `data/labels.ts` | order 섹션 추가 |
| `app/(admin)/orders/page.tsx` | 주문 목록 (검색/필터/페이지네이션) |
| `app/(admin)/orders/[id]/page.tsx` | 주문 상세 (배송정보, 결제정보, 상품목록) |
| `components/orders/OrderStatusFlow.tsx` | 주문 상태 흐름 시각화 |
| `components/orders/OrderItemList.tsx` | 주문 상품 목록 |

### API 엔드포인트
```
GET    /api/v1/admin/orders              — 목록 (필터: status, searchType, keyword)
GET    /api/v1/admin/orders/{id}         — 상세
GET    /api/v1/admin/orders/statuses     — 상태 목록
PATCH  /api/v1/admin/orders/statuses     — 상태 일괄 변경
```

---

## Phase 2: 회원 관리

### 생성 파일
| 파일 | 설명 |
|------|------|
| `types/member.ts` | Member, Grade, Point, CsMemo, MemberListParams |
| `services/memberService.ts` | 회원 CRUD + 등급/포인트/메모 API |
| `app/(admin)/members/page.tsx` | 회원 목록 |
| `app/(admin)/members/[id]/page.tsx` | 회원 상세 (주문내역, 포인트, CS메모) |
| `app/(admin)/members/grades/page.tsx` | 등급 관리 |
| `components/members/MemberDetail.tsx` | 회원 상세 탭 구성 |
| `components/members/GradeTable.tsx` | 등급 테이블 + 수정 |
| `components/members/PointHistory.tsx` | 포인트 이력 |
| `components/members/CsMemoList.tsx` | CS 메모 CRUD |

### API 엔드포인트
```
GET    /api/v1/admin/users                          — 회원 목록
GET    /api/v1/admin/users/{id}                     — 회원 상세
GET    /api/v1/admin/users/{id}/orders              — 회원 주문 내역
GET    /api/v1/admin/users/{id}/points              — 포인트 조회
POST   /api/v1/admin/users/{id}/points              — 포인트 조정
POST   /api/v1/admin/users/{id}/cs-memos            — CS 메모 생성
PUT    /api/v1/admin/users/{id}/cs-memos/{memoId}   — CS 메모 수정
DELETE /api/v1/admin/users/{id}/cs-memos/{memoId}   — CS 메모 삭제
GET    /api/v1/admin/users/grades                   — 등급 목록
PATCH  /api/v1/admin/users/grades                   — 등급 일괄 수정
```

---

## Phase 3: 콘텐츠 관리 (배너 / 공지 / 팝업 / FAQ)

### 3-1. 배너

| 파일 | 설명 |
|------|------|
| `types/banner.ts` | Banner, BannerFormData, BannerListParams |
| `services/bannerService.ts` | CRUD |
| `app/(admin)/banners/page.tsx` | 배너 목록 + 생성/수정 다이얼로그 |
| `components/banners/BannerFormDialog.tsx` | 배너 폼 (이미지, 기간, 위치) |

```
GET    /api/v1/admin/banners           — 목록
POST   /api/v1/admin/banners           — 생성
GET    /api/v1/admin/banners/{id}      — 상세
PATCH  /api/v1/admin/banners/{id}      — 수정
DELETE /api/v1/admin/banners/{id}      — 삭제
```

### 3-2. 공지사항

| 파일 | 설명 |
|------|------|
| `types/notice.ts` | Notice, NoticeFormData, NoticeListParams |
| `services/noticeService.ts` | CRUD |
| `app/(admin)/notices/page.tsx` | 목록 |
| `app/(admin)/notices/new/page.tsx` | 등록 (리치 텍스트) |
| `app/(admin)/notices/[id]/edit/page.tsx` | 수정 |

```
GET    /api/v1/admin/notices           — 목록
POST   /api/v1/admin/notices           — 생성
GET    /api/v1/admin/notices/{id}      — 상세
PATCH  /api/v1/admin/notices/{id}      — 수정
DELETE /api/v1/admin/notices/{id}      — 삭제
```

### 3-3. 팝업 / FAQ
- 공지사항과 동일한 CRUD 패턴
- 별도 타입/서비스/페이지 생성

---

## Phase 4: 마케팅 (프로모션 / 쿠폰)

### 4-1. 프로모션

| 파일 | 설명 |
|------|------|
| `types/promotion.ts` | Promotion, PromotionFormData, PromotionListParams |
| `services/promotionService.ts` | CRUD |
| `app/(admin)/promotions/page.tsx` | 목록 |
| `app/(admin)/promotions/new/page.tsx` | 등록 |
| `app/(admin)/promotions/[id]/edit/page.tsx` | 수정 |
| `components/promotions/PromotionForm.tsx` | 폼 (할인타입, 적용카테고리, 기간) |

```
GET    /api/v1/admin/promotions           — 목록
POST   /api/v1/admin/promotions           — 생성
GET    /api/v1/admin/promotions/{id}      — 상세
PUT    /api/v1/admin/promotions/{id}      — 수정
```

### 4-2. 쿠폰

| 파일 | 설명 |
|------|------|
| `types/coupon.ts` | Coupon, CouponFormData, CouponListParams |
| `services/couponService.ts` | CRUD + 상태/회수 |
| `app/(admin)/coupons/page.tsx` | 목록 |
| `app/(admin)/coupons/new/page.tsx` | 등록 |
| `app/(admin)/coupons/[id]/edit/page.tsx` | 수정 |
| `components/coupons/CouponForm.tsx` | 폼 (할인, 조건, 유효기간, 대상 등급) |

```
GET    /api/v1/admin/coupons                    — 목록
POST   /api/v1/admin/coupons                    — 생성
GET    /api/v1/admin/coupons/{id}               — 상세
PATCH  /api/v1/admin/coupons/{id}               — 수정
DELETE /api/v1/admin/coupons/{id}               — 삭제
PATCH  /api/v1/admin/coupons/{id}/status        — 상태 변경
PATCH  /api/v1/admin/coupons/{id}/visibility    — 노출 토글
POST   /api/v1/admin/coupons/{id}/recall        — 회수
```

---

## Phase 5: 클레임 관리 (반품 / 환불 / 교환)

| 파일 | 설명 |
|------|------|
| `types/claim.ts` | Claim, ClaimListParams |
| `services/claimService.ts` | 목록 + 상태 전이 API |
| `app/(admin)/claims/page.tsx` | 클레임 목록 |
| `app/(admin)/claims/[id]/page.tsx` | 클레임 상세 + 처리 |
| `components/claims/ClaimStatusActions.tsx` | 승인/거절/검수/재배송 액션 |

```
GET    /api/v1/admin/claims                              — 목록
POST   /api/v1/admin/claims                              — 생성
POST   /api/v1/admin/claims/{id}/approve                 — 승인
POST   /api/v1/admin/claims/{id}/reject                  — 거절
POST   /api/v1/admin/claims/{id}/receive-inspect         — 검수
POST   /api/v1/admin/claims/{id}/return-shipping         — 반송
POST   /api/v1/admin/claims/{id}/reship                  — 재배송
POST   /api/v1/admin/claims/{id}/exchange/complete       — 교환 완료
```

---

## Phase 6: 고객센터 (문의 / Q&A / 리뷰)

### 6-1. 1:1 문의

| 파일 | 설명 |
|------|------|
| `types/inquiry.ts` | Inquiry, InquiryListParams |
| `services/inquiryService.ts` | 목록/상세/답변/삭제 |
| `app/(admin)/inquiries/page.tsx` | 문의 목록 |
| `app/(admin)/inquiries/[id]/page.tsx` | 문의 상세 + 답변 |

```
GET    /api/v1/admin/inquiries                  — 목록
GET    /api/v1/admin/inquiries/{id}             — 상세
PATCH  /api/v1/admin/inquiries/{id}/answer      — 답변
DELETE /api/v1/admin/inquiries/{id}             — 삭제
GET    /api/v1/admin/inquiries/types            — 문의 유형
```

### 6-2. 리뷰

| 파일 | 설명 |
|------|------|
| `types/review.ts` | Review, ReviewListParams |
| `services/reviewService.ts` | 목록/상세/노출 토글 |
| `app/(admin)/reviews/page.tsx` | 리뷰 목록 |
| `app/(admin)/reviews/[id]/page.tsx` | 리뷰 상세 |

```
GET    /api/v1/admin/reviews                    — 목록
GET    /api/v1/admin/reviews/{id}               — 상세
PATCH  /api/v1/admin/reviews/visibility         — 노출 일괄 토글
```

---

## Phase 7: 설정

- 테넌트(사이트) 설정 → 기존 사이트 관리 페이지 확장
- 약관/정책 관리 페이지 추가
- 헤더 메뉴 관리 (프론트 노출용)

---

## 도메인별 생성 파일 요약

| Phase | 도메인 | types | services | pages | components |
|-------|--------|:-----:|:--------:|:-----:|:----------:|
| 0 | 기반 정비 | - | - | - | 2~3개 보강 |
| 1 | 주문 | 1 | 1 | 2 | 2 |
| 2 | 회원 | 1 | 1 | 3 | 4 |
| 3 | 콘텐츠 | 3~4 | 3~4 | 6~8 | 3~4 |
| 4 | 마케팅 | 2 | 2 | 4~6 | 2 |
| 5 | 클레임 | 1 | 1 | 2 | 1 |
| 6 | 고객센터 | 2 | 2 | 4 | - |
| 7 | 설정 | 1~2 | 1~2 | 2~3 | 1~2 |

---

## 작업 순서 원칙

1. **Phase 0은 반드시 먼저** — 메뉴/상수/공통 컴포넌트가 준비되어야 이후 도메인이 일관적
2. **각 Phase 내에서**: 타입 → 상수 → 라벨 → 서비스 → 페이지 → 컴포넌트 순으로 작업
3. **Phase 1~2 우선**: 주문/회원은 커머스 핵심이므로 먼저 구현
4. **Phase 간 독립적**: 3~6은 순서 상관없이 병렬 진행 가능
