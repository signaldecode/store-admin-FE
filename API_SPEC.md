# API 스펙 참조 (api-admin.sigdec.click)

> Swagger에서 추출한 Admin 관련 엔드포인트 전체 목록

## 수정 필요 사항 (기존 구현 vs 실제 API)

### 배너 위치
- 기존: MAIN_TOP, MAIN_MIDDLE, MAIN_BOTTOM, SUB_TOP
- API: **HERO, SLIDE, HALF, FULL**

### 공지 유형
- 기존: GENERAL, EVENT, SYSTEM
- API: **NOTICE, INSPECTION, GUIDELINES, EVENT**

### 공지 상태
- 기존: PUBLISHED, DRAFT
- API: **ACTIVE, INACTIVE**

### 쿠폰 상태
- 기존: ACTIVE, EXPIRED, STOPPED
- API: **REGISTERED, ACTIVE, STOPPED, ENDED, RECALLED**

### 쿠폰 추가 필드
- couponType: PRODUCT_DISCOUNT | FREE_SHIPPING
- validityType: DAYS_FROM_DOWNLOAD | FIXED_PERIOD
- validityDays (DAYS_FROM_DOWNLOAD일 때)
- allowPromotionOverlap, allowDuplicateUse

### 클레임 타입
- 기존: RETURN, REFUND, EXCHANGE
- API: **CANCEL, RETURN, EXCHANGE**

### 클레임 상태
- 기존: REQUESTED, APPROVED, REJECTED, PROCESSING, COMPLETED
- API: **REQUESTED, APPROVED, IN_PROGRESS, COMPLETED, REJECTED**

## 누락 도메인 (새로 추가 필요)

| 도메인 | 엔드포인트 |
|--------|-----------|
| FAQ | 카테고리 CRUD + FAQ CRUD |
| 팝업 | CRUD |
| 상품 Q&A | 답변 관리 |
| 태그 | 목록/생성 |
| 정책 설정 | 주문/배송/반품 정책 조회/수정 |
| 테넌트 설정 | 사이트 정보/SEO/결제/보안 등 |
| 전시 관리 | 섹션 조회/수정 |
| 배송 관리 | 송장 등록/추적 |
| 환불 관리 | 환불 처리 |
