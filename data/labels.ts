/**
 * UI 텍스트 통합 관리
 * - 컴포넌트/페이지에서 직접 한글 문자열을 사용하지 않고 이 파일에서 가져온다
 * - 향후 다국어(i18n) 전환 시 이 파일만 교체하면 된다
 */

import type {
  ProductStatus, OptionType, AdminRole, DiscountType,
  OrderStatus, MemberStatus, ClaimType, ClaimStatus,
  InquiryStatus, BannerPosition, BannerStatus,
  NoticeType, NoticeStatus, CouponStatus, CouponDiscountType,
  CouponType, CouponValidityType, PopupType, PopupStatus, QnaStatus,
} from "@/lib/constants";

// ─── 열거형 라벨 ───
export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  ON_SALE: "판매중",
  SOLD_OUT: "품절",
  DISCONTINUED: "판매중단",
  DRAFT: "임시저장",
};

export const OPTION_TYPE_LABEL: Record<OptionType, string> = {
  FIXED: "고정 옵션",
  FREE: "자유 입력",
};

export const DISCOUNT_TYPE_LABEL: Record<DiscountType, string> = {
  NONE: "할인 없음",
  RATE: "정률 (%)",
  AMOUNT: "정액 (원)",
};

export const ADMIN_ROLE_LABEL: Record<AdminRole, string> = {
  SUPER_ADMIN: "슈퍼 관리자",
  ADMIN: "관리자",
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "결제대기",
  PAID: "결제완료",
  PREPARING: "상품준비중",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "주문취소",
  REFUNDED: "환불완료",
};

export const MEMBER_STATUS_LABEL: Record<MemberStatus, string> = {
  ACTIVE: "활성",
  DORMANT: "휴면",
  WITHDRAWN: "탈퇴",
};

export const CLAIM_TYPE_LABEL: Record<ClaimType, string> = {
  CANCEL: "취소",
  RETURN: "반품",
  EXCHANGE: "교환",
};

export const CLAIM_STATUS_LABEL: Record<ClaimStatus, string> = {
  REQUESTED: "접수",
  APPROVED: "승인",
  IN_PROGRESS: "처리중",
  COMPLETED: "완료",
  REJECTED: "거절",
};

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  WAITING: "대기",
  ANSWERED: "답변완료",
};

export const BANNER_POSITION_LABEL: Record<BannerPosition, string> = {
  HERO: "히어로",
  SLIDE: "슬라이드",
  HALF: "하프",
  FULL: "풀",
};

export const BANNER_STATUS_LABEL: Record<BannerStatus, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
  SCHEDULED: "예약",
};

export const NOTICE_TYPE_LABEL: Record<NoticeType, string> = {
  NOTICE: "공지",
  INSPECTION: "점검",
  GUIDELINES: "가이드",
  EVENT: "이벤트",
};

export const NOTICE_STATUS_LABEL: Record<NoticeStatus, string> = {
  ACTIVE: "게시중",
  INACTIVE: "비활성",
};

export const COUPON_STATUS_LABEL: Record<CouponStatus, string> = {
  REGISTERED: "등록",
  ACTIVE: "활성",
  STOPPED: "중지",
  ENDED: "종료",
  RECALLED: "회수",
};

export const COUPON_TYPE_LABEL: Record<CouponType, string> = {
  PRODUCT_DISCOUNT: "상품 할인",
  FREE_SHIPPING: "무료 배송",
};

export const COUPON_VALIDITY_TYPE_LABEL: Record<CouponValidityType, string> = {
  DAYS_FROM_DOWNLOAD: "다운로드 후 N일",
  FIXED_PERIOD: "고정 기간",
};

export const POPUP_TYPE_LABEL: Record<PopupType, string> = {
  CENTER: "중앙",
  FLOATING: "플로팅",
};

export const POPUP_STATUS_LABEL: Record<PopupStatus, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
};

export const QNA_STATUS_LABEL: Record<QnaStatus, string> = {
  WAITING: "대기",
  ANSWERED: "답변완료",
};

export const COUPON_DISCOUNT_TYPE_LABEL: Record<CouponDiscountType, string> = {
  RATE: "정률 (%)",
  AMOUNT: "정액 (원)",
};

// ─── 공통 ───
export const common = {
  loading: "불러오는 중...",
  saving: "저장 중...",
  processing: "처리 중...",
  cancel: "취소",
  confirm: "확인",
  delete: "삭제",
  edit: "수정",
  add: "추가",
  create: "등록",
  save: "저장",
  search: "검색",
  retry: "다시 시도",
  sortLabel: (column: string) => `${column} 정렬`,
  noData: "데이터가 없습니다.",
  notFound: "페이지를 찾을 수 없습니다.",
  goToDashboard: "대시보드로 이동",
  currency: "원",
  perPage: "페이지당",
  totalCount: (count: number) => `/ 총 ${(count ?? 0).toLocaleString("ko-KR")}건`,
  itemUnit: (size: number) => `${size}개`,
  errorOccurred: "오류가 발생했습니다",
  errorFallback: "페이지를 불러오는 중 문제가 발생했습니다.",
  saveFailed: "저장에 실패했습니다.",
  loginFailed: "로그인에 실패했습니다.",
  all: "전체",
};

// ─── 레이아웃 ───
export const layout = {
  appName: "MIREP 통합어드민",
  appNameShort: "MIREP",
  mainMenu: "메인 메뉴",
  mobileMenu: "모바일 메뉴",
  menuOpen: "메뉴 열기",
  sidebarCollapse: "사이드바 접기",
  sidebarExpand: "사이드바 펼치기",
  logout: "로그아웃",
};

// ─── 인증 ───
export const auth = {
  pageTitle: "관리자 로그인",
  emailLabel: "이메일",
  emailPlaceholder: "admin@example.com",
  passwordLabel: "비밀번호",
  passwordPlaceholder: "비밀번호를 입력하세요",
  loginButton: "로그인",
  loggingIn: "로그인 중...",
  validationRequired: "이메일과 비밀번호를 입력해주세요.",
};

// ─── 대시보드 ───
export const dashboard = {
  pageTitle: "대시보드",
  totalProducts: "전체 상품",
  soldoutProducts: "품절 상품",
  categories: "카테고리",
  brands: "브랜드",

  // 주문 현황
  orderStatusTitle: "주문 현황",
  orderCompletion: "주문 처리율",
  orderPending: "신규주문",
  orderPaid: "결제완료",
  orderPreparing: "배송준비",
  orderShipping: "배송중",

  // 매출
  salesTitle: "매출",
  todaySales: "오늘 매출",
  monthlySales: "월간 매출",

  // 최근 주문
  recentOrdersTitle: "최근 주문",
  recentOrdersEmpty: "최근 주문이 없습니다.",
  viewAll: "전체보기",

  // 클레임
  claimsTitle: "클레임 현황",
  claimsRequested: "접수",
  claimsInProgress: "처리중",
};

// ─── 상품 ───
export const product = {
  pageTitle: "상품 관리",
  createTitle: "상품 등록",
  editTitle: "상품 수정",
  detailTitle: "상품 상세",
  addButton: "상품 등록",
  emptyMessage: "등록된 상품이 없습니다.",
  notFound: "상품을 찾을 수 없습니다.",
  deleteTitle: "상품 삭제",
  deleteDescription: (name: string) => `"${name}" 상품을 삭제하시겠습니까?`,
  backToList: "목록으로",

  // 뷰 모드
  listView: "리스트형 보기",
  cardView: "카드형 보기",

  // 테이블 컬럼
  colImage: "",
  colName: "상품명",
  colPrice: "가격",
  colStock: "재고",
  colCategory: "분류",
  colBrand: "브랜드",
  colStatus: "상태",
  colCreatedAt: "등록일",
  colUpdatedAt: "수정일",

  // 섹션
  sectionSite: "사이트 선택",
  sectionSiteHint: "사이트를 먼저 선택해주세요.",
  sitePlaceholder: "사이트 선택",
  siteRequired: "사이트를 선택해주세요.",
  sectionBasic: "기본 정보",
  sectionAdditional: "추가 정보",
  sectionOptions: "사용자 정의 옵션",

  // 폼 라벨
  nameLabel: "상품명",
  namePlaceholder: "상품명을 입력하세요",
  descriptionLabel: "상품 설명 \n\n 이미지 업로드시 같은 너비(860px)의 이미지를 권장합니다.",
  descriptionPlaceholder: "상품 설명을 입력하세요. 이미지 업로드시 같은 너비(860px)의 이미지를 권장합니다.",
  priceLabel: "가격 (원)",
  stockLabel: "재고",
  stockPlaceholder: "재고 수량을 입력하세요",
  stockDisabledHint: "옵션이 있는 상품은 조합별 재고를 입력하세요",
  discountTypeLabel: "할인 유형",
  discountValueLabel: "할인 값",
  discountValuePlaceholder: "할인 값을 입력하세요",
  discountValueSuffixRate: "%",
  discountValueSuffixAmount: "원",
  discountPriceLabel: "할인가",
  discountRateMax: "할인율은 100% 이하여야 합니다.",
  discountAmountMax: "할인 금액이 가격보다 클 수 없습니다.",
  marginPrice1Label: "마진 1 가격 (원)",
  marginPrice1Placeholder: "마진 1 가격을 입력하세요",
  marginPrice2Label: "마진 2 가격 (원)",
  marginPrice2Placeholder: "마진 2 가격을 입력하세요",
  statusLabel: "상태",
  visibleLabel: "노출 여부",
  imageLabel: "상품 이미지",
  thumbnailLabel: "대표 이미지",
  thumbnailHint: "상품 목록에 표시되는 메인 이미지입니다.",
  additionalImageLabel: "추가 이미지",

  // 분류 폼
  mainCategoryLabel: "대분류",
  mainCategoryPlaceholder: "대분류 선택",
  subCategoryLabel: "중분류",
  subCategoryPlaceholder: "중분류 선택",
  subCategoryDisabled: "대분류를 먼저 선택",
  detailCategoryLabel: "소분류",
  detailCategoryPlaceholder: "소분류 선택",
  detailCategoryDisabled: "중분류를 먼저 선택",
  detailCategoryEmpty: "소분류 없음",
  brandLabel: "브랜드",
  brandPlaceholder: "브랜드 선택",
  brandSearchPlaceholder: "브랜드 검색",
  brandEmpty: "검색 결과가 없습니다.",
  noSelection: "선택 안 함",

  // 필터
  filterToggle: "필터",
  filterOpen: "필터 열기",
  filterClose: "필터 닫기",
  filterReset: "초기화",
  filterActiveCount: (count: number) => `${count}개 적용`,
  filterStatusGroup: "상태",
  filterSiteGroup: "사이트",
  filterSiteAll: "전체 사이트", 
  filterMainCategoryGroup: "대분류",
  filterMainCategoryAll: "전체",
  filterMainCategoryDisabled: "사이트를 먼저 선택",
  filterSubCategoryGroup: "중분류",
  filterSubCategoryDisabled: "대분류를 먼저 선택",
  filterDetailCategoryGroup: "소분류",
  filterDetailCategoryDisabled: "중분류를 먼저 선택",
  filterBrandGroup: "브랜드",
  filterBrandMore: "더보기",
  filterBrandDialogTitle: "브랜드 선택",
  filterBrandSearchPlaceholder: "브랜드명 검색",
  filterBrandEmpty: "검색 결과가 없습니다.",
  searchPlaceholder: "상품명으로 검색",

  // 정렬
  sortLabel: "정렬",
  sortNewest: "최신순",
  sortOldest: "오래된순",
  sortNameAsc: "이름순",
  sortNameDesc: "이름 역순",
  sortPriceHigh: "가격 높은순",
  sortPriceLow: "가격 낮은순",

  // 유효성 검사
  nameRequired: "상품명을 입력해주세요.",
  priceRequired: "올바른 가격을 입력해주세요.",
  stockRequired: "재고를 입력해주세요.",
  stockMin: "재고는 0 이상이어야 합니다.",
  imageRequired: "상품 이미지를 1장 이상 등록하세요.",
  mainCategoryRequired: "대분류를 선택해주세요.",
  subCategoryRequired: "중분류를 선택해주세요.",

  // 상세 페이지
  infoPrice: "가격",
  infoStock: "재고",
  infoMarginPrice1: "마진 1 가격",
  infoMarginPrice2: "마진 2 가격",
  infoDiscountType: "할인 유형",
  infoDiscountValue: "할인 값",
  infoDiscountPrice: "할인가",
  infoCategory: "분류",
  infoBrand: "브랜드",
  infoOrigin: "원산지",
  infoMaterial: "소재",
  infoWashingInfo: "세탁 정보",
  infoCreatedAt: "등록일",
  infoUpdatedAt: "수정일",
  descriptionHeading: "상품 설명",

  // 모바일
  productMenu: "상품 메뉴",
  menuView: "상세 보기",
  menuEdit: "수정",
  menuDelete: "삭제",
  noImage: "No IMG",
};

// ─── 상품 옵션 ───
export const productOption = {
  sectionLabel: "상품 옵션",
  addOption: "옵션 추가",
  emptyMessage: "옵션이 없습니다. 옵션을 추가하면 색상, 사이즈 등을 관리할 수 있습니다.",
  optionNameLabel: "옵션명",
  optionNamePlaceholder: "예: 색상, 사이즈",
  typeLabel: "타입",
  deleteOption: (name: string) => `${name || "옵션"} 삭제`,
  valuesLabel: "옵션값",
  valuePlaceholder: "옵션값 입력 후 Enter",
  addValueLabel: (index: number) => `옵션 ${index + 1} 값 추가`,
  deleteValue: (value: string) => `${value} 삭제`,
  freeOptionHint: "고객이 주문 시 직접 입력하는 옵션입니다. (예: 각인 문구)",

  // 조합 테이블
  combinationLabel: "옵션 조합별 재고/가격",
  combinationCount: (count: number) => `총 ${count}개 조합`,
  combinationHint: "추가금액은 기본 가격에 더해집니다.",
  colSku: "SKU",
  colStock: "재고",
  colAdditionalPrice: "추가금액 (원)",
  skuPlaceholder: "SKU",

  // 빠른 가격 설정
  additionalPriceLabel: (optionName: string, value: string) =>
    `${optionName} ${value} 추가금액`,
  quickPriceLabel: "옵션값별 추가금액 (빠른 설정)",
  quickPriceHint: "여기서 설정한 추가금액은 조합 테이블에 자동 반영됩니다.",

  // 상세 페이지
  detailHeading: "상품 옵션",
  variantHeading: "옵션 조합별 재고/가격",
  variantColCombo: "옵션 조합",
  variantColSku: "SKU",
  variantColStock: "재고",
  variantColPrice: "추가금액",
  variantColDiscontPrice: "할인가", 
};

// ─── 리치 텍스트 에디터 ───
export const richTextEditor = {
  toolbarLabel: "텍스트 서식 도구",
  placeholder: "상품 설명을 작성하세요. 이미지를 드래그하거나 붙여넣을 수 있습니다.",
  bold: "굵게",
  italic: "기울임",
  underline: "밑줄",
  strikethrough: "취소선",
  heading1: "제목 1",
  heading2: "제목 2",
  heading3: "제목 3",
  bulletList: "글머리 기호 목록",
  orderedList: "번호 매기기 목록",
  alignLeft: "왼쪽 정렬",
  alignCenter: "가운데 정렬",
  alignRight: "오른쪽 정렬",
  horizontalRule: "구분선",
  insertImage: "이미지 삽입",
  undo: "실행 취소",
  redo: "다시 실행",
};

// ─── 이미지 업로더 ───
export const imageUploader = {
  addButton: "추가",
  addLabel: "이미지 추가",
  deleteLabel: (index: number) => `이미지 ${index + 1} 삭제`,
  altText: (name: string, index: number) => `${name} 이미지 ${index + 1}`,
  hint: (maxCount: number, maxSizeMB: number) =>
    `최대 ${maxCount}장, 장당 ${maxSizeMB}MB 이하`,
  hintSingle: (maxSizeMB: number) => `${maxSizeMB}MB 이하`,
};

// ─── 카테고리 ───
export const category = {
  pageTitle: "카테고리 관리",
  addButton: "카테고리 추가",
  emptyMessage: "등록된 카테고리가 없습니다.",
  createTitle: "카테고리 추가",
  editTitle: "카테고리 수정",
  levelLabel: "분류 단계",
  levelMain: "대분류",
  levelSub: "중분류",
  levelDetail: "소분류",
  parentMainLabel: "소속 대분류",
  parentMainPlaceholder: "대분류 선택",
  parentSubLabel: "소속 중분류",
  parentSubPlaceholder: "중분류 선택",
  parentMainRequired: "대분류를 선택해주세요.",
  parentSubRequired: "중분류를 선택해주세요.",
  deleteTitle: "카테고리 삭제",
  deleteDescription: (name: string) => `"${name}" 카테고리를 삭제하시겠습니까?`,
  deleteWithChildren: (name: string) =>
    `"${name}" 카테고리를 삭제하시겠습니까? 하위 카테고리도 함께 삭제됩니다.`,
  nameLabel: "카테고리명",
  namePlaceholder: "카테고리명을 입력하세요",
  nameRequired: "카테고리명을 입력해주세요.",
  parentLabel: "상위 카테고리",
  parentPlaceholder: "상위 카테고리 선택",
  parentNone: "없음 (최상위)",
  treeItemLabel: (name: string) => `${name} 카테고리`,
  collapse: "접기",
  expand: "펼치기",
  editLabel: (name: string) => `${name} 수정`,
  deleteLabel: (name: string) => `${name} 삭제`,
  reorderButton: "순서 변경",
  editModeButton: "수정",
  editModeSave: "저장",
  editModeCancel: "취소",
  editModeSaving: "저장 중...",
  editModeUnsaved: "변경사항이 있습니다",
  renameLabel: (name: string) => `${name} 이름 변경`,
  siteLabel: "사이트",
  sitePlaceholder: "사이트 선택",
  siteRequired: "사이트를 선택해주세요.",
  siteAll: "전체 사이트",
  siteUrlLabel: "사이트 URL",
  siteUrlPlaceholder: "https://example.mirep.com",
};

// ─── 브랜드 ───
export const brand = {
  pageTitle: "브랜드 관리",
  addButton: "브랜드 추가",
  emptyMessage: "등록된 브랜드가 없습니다.",
  createTitle: "브랜드 추가",
  editTitle: "브랜드 수정",
  deleteTitle: "브랜드 삭제",
  deleteDescription: (name: string) =>
    `"${name}" 브랜드를 삭제하시겠습니까? 해당 브랜드를 사용 중인 상품이 있을 수 있습니다.`,
  colName: "브랜드명",
  colCreatedAt: "등록일",
  nameLabel: "브랜드명",
  namePlaceholder: "브랜드명을 입력하세요",
  nameRequired: "브랜드명을 입력해주세요.",
  descriptionLabel: "설명",
  descriptionPlaceholder: "브랜드에 대한 설명을 입력하세요",
  infoDescription: "설명",
  logoLabel: "로고",
  colLogo: "",
  detailTitle: "브랜드 상세",
  notFound: "브랜드를 찾을 수 없습니다.",
  backToList: "목록으로",
  infoName: "브랜드명",
  infoLogo: "로고",
  infoCreatedAt: "등록일",
  infoUpdatedAt: "수정일",
  noLogo: "등록된 로고가 없습니다.",

  // 검색
  searchPlaceholder: "브랜드명으로 검색",

  // 상태
  colStatus: "상태",
  statusActive: "활성",
  statusInactive: "비활성",
  statusToggleLabel: (name: string) => `${name} 브랜드 활성 상태 토글`,
  infoStatus: "상태",
  filterAll: "전체",
  filterActiveOnly: "활성화 된 브랜드",
  filterLabel: "상태 필터",

  // 정렬
  sortLabel: "정렬",
  sortNewest: "최신순",
  sortOldest: "오래된순",
  sortNameAsc: "이름순",
  sortNameDesc: "이름 역순",
};

// ─── 사이트 ───
export const site = {
  pageTitle: "사이트 관리",
  addButton: "사이트 추가",
  emptyMessage: "등록된 사이트가 없습니다.",
  createTitle: "사이트 추가",
  editTitle: "사이트 수정",
  deleteTitle: "사이트 삭제",
  deleteDescription: (name: string) =>
    `"${name}" 사이트를 삭제하시겠습니까? 해당 사이트에 연결된 상품이 있을 수 있습니다.`,

  // 테이블 컬럼
  colName: "사이트명",
  colSiteUrl: "사이트 URL",
  colSubCount: "하위 카테고리",

  // 폼
  codeLabel: "대분류",
  codePlaceholder: "가구",
  codeRequired: "대분류를 입력해주세요.",
  nameLabel: "사이트명",
  namePlaceholder: "사이트명을 입력하세요",
  nameRequired: "사이트명을 입력해주세요.",
  nameEnLabel: "영문명",
  nameEnPlaceholder: "영문 사이트명을 입력하세요",

  // 상태
  statusActive: "활성",
  statusInactive: "비활성",
  statusToggleLabel: (name: string) => `${name} 사이트 활성 상태 토글`,
  filterAll: "전체",
  filterLabel: "상태 필터",

  // 검색
  searchPlaceholder: "사이트명으로 검색",

  // 정렬
  sortLabel: "정렬",
  sortNewest: "최신순",
  sortOldest: "오래된순",
  sortNameAsc: "이름순",
  sortNameDesc: "이름 역순",

  // 설정 페이지
  settingsTitle: (name: string) => `${name} 사이트 설정`,
  settingsButton: "설정",

  // 탭
  tabBasic: "기본 정보",
  tabBusiness: "사업자 정보",
  tabCs: "고객센터",
  tabSeo: "SEO",

  // 기본 정보 탭
  siteUrlLabel: "사이트 URL",
  siteUrlPlaceholder: "https://example.mirep.com",
  logoLabel: "로고",
  logoHint: "권장: 200x60px, PNG/SVG",
  logoUpload: "로고 업로드",
  faviconLabel: "파비콘",
  faviconHint: "권장: 32x32px, ICO/PNG",
  faviconUpload: "파비콘 업로드",
  copyrightLabel: "카피라이트",
  copyrightPlaceholder: "© 2026 Company. All rights reserved.",

  // 사업자 정보 탭
  businessNumberLabel: "사업자등록번호",
  businessNumberPlaceholder: "123-45-67890",
  businessNameLabel: "상호명",
  businessNamePlaceholder: "주식회사 OO",
  businessTypeLabel: "업태",
  businessTypePlaceholder: "소매업",
  businessCategoryLabel: "업종",
  businessCategoryPlaceholder: "전자상거래",
  ecommerceLicenseLabel: "통신판매업 신고번호",
  ecommerceLicensePlaceholder: "2026-서울강남-0000",
  ceoNameLabel: "대표자명",
  ceoNamePlaceholder: "홍길동",
  emailLabel: "이메일",
  emailPlaceholder: "info@example.com",
  phoneLabel: "전화번호",
  phonePlaceholder: "02-1234-5678",
  addressLabel: "주소",
  addressPlaceholder: "서울시 강남구 테헤란로 123",
  addressDetailLabel: "상세주소",
  addressDetailPlaceholder: "OO빌딩 5층",
  zipCodeLabel: "우편번호",
  zipCodePlaceholder: "06234",
  privacyOfficerLabel: "개인정보 보호책임자",
  privacyOfficerPlaceholder: "홍길동",
  privacyEmailLabel: "개인정보 보호 이메일",
  privacyEmailPlaceholder: "privacy@example.com",

  // 고객센터 탭
  csPhoneLabel: "CS 전화번호",
  csPhonePlaceholder: "1588-0000",
  csFaxLabel: "CS 팩스",
  csFaxPlaceholder: "02-1234-5679",
  csEmailLabel: "CS 이메일",
  csEmailPlaceholder: "cs@example.com",
  csHoursLabel: "운영시간",
  csHoursPlaceholder: "평일 09:00~18:00 (주말/공휴일 휴무)",

  // SEO 탭
  metaTitleLabel: "메타 타이틀",
  metaTitlePlaceholder: "사이트 제목",
  metaTitleHint: (count: number) => `${count}/60자 (권장 60자 이내)`,
  metaDescriptionLabel: "메타 설명",
  metaDescriptionPlaceholder: "사이트에 대한 간단한 설명",
  metaDescriptionHint: (count: number) => `${count}/160자 (권장 160자 이내)`,
  metaKeywordsLabel: "메타 키워드",
  metaKeywordsPlaceholder: "키워드1, 키워드2, 키워드3",
};

// ─── 관리자 ───
export const admin = {
  pageTitle: "관리자 계정",
  addButton: "관리자 추가",
  emptyMessage: "등록된 관리자가 없습니다.",
  createTitle: "관리자 추가",
  editTitle: "관리자 수정",
  deleteTitle: "관리자 비활성화",
  deleteDescription: (name: string, email: string) =>
    `${name}(${email}) 계정을 비활성화하시겠습니까?`,
  isActiveLabel: "활성 상태",
  colEmail: "이메일",
  colName: "이름",
  colRole: "역할",
  colCreatedAt: "등록일",
  emailLabel: "이메일",
  emailPlaceholder: "admin@example.com",
  emailRequired: "이메일을 입력해주세요.",
  nameLabel: "이름",
  namePlaceholder: "관리자 이름",
  nameRequired: "이름을 입력해주세요.",
  passwordLabel: "비밀번호",
  passwordPlaceholder: "비밀번호를 입력하세요",
  passwordPlaceholderEdit: "변경 시에만 입력",
  passwordRequired: "비밀번호를 입력해주세요.",
  roleLabel: "역할",
  rolePlaceholder: "역할 선택",
};

// ─── 주문 ───
export const order = {
  pageTitle: "주문 관리",
  detailTitle: "주문 상세",
  emptyMessage: "주문 내역이 없습니다.",
  notFound: "주문을 찾을 수 없습니다.",
  backToList: "목록으로",

  // 테이블 컬럼
  colOrderNumber: "주문번호",
  colCustomer: "주문자",
  colItems: "주문상품",
  colTotalAmount: "결제금액",
  colStatus: "상태",
  colCreatedAt: "주문일시",

  // 상세
  sectionOrderInfo: "주문 정보",
  sectionItems: "주문 상품",
  sectionShipping: "배송 정보",
  sectionPayment: "결제 정보",
  recipientName: "수령인",
  recipientPhone: "연락처",
  address: "주소",
  shippingMemo: "배송 메모",
  paymentMethod: "결제수단",
  paidAt: "결제일시",

  // 배송 관리
  sectionDelivery: "배송 관리",
  registerInvoice: "송장 등록",
  carrierId: "택배사",
  carrierIdPlaceholder: "택배사 ID (1: CJ대한통운, 2: 한진택배, 3: 롯데택배)",
  trackingNumber: "송장번호",
  trackingNumberPlaceholder: "송장번호를 입력하세요",
  submitShipment: "송장 등록",
  refreshTracking: "배송 추적 새로고침",
  shipmentRegistered: "송장이 등록되었습니다.",
  trackingRefreshed: "배송 추적이 갱신되었습니다.",

  // 환불
  sectionRefund: "환불",
  refundAmount: "환불 금액",
  refundReason: "환불 사유",
  refundReasonPlaceholder: "환불 사유를 입력하세요",
  submitRefund: "환불 처리",
  refundSuccess: "환불이 처리되었습니다.",

  // 검색/필터
  searchPlaceholder: "주문번호 또는 주문자명으로 검색",
  filterStatus: "주문 상태",
  sortNewest: "최신순",
  sortOldest: "오래된순",
  sortLabel: "정렬",
};

// ─── 회원 ───
export const member = {
  pageTitle: "회원 관리",
  detailTitle: "회원 상세",
  emptyMessage: "등록된 회원이 없습니다.",
  notFound: "회원을 찾을 수 없습니다.",
  backToList: "목록으로",

  // 테이블 컬럼
  colName: "이름",
  colEmail: "이메일",
  colPhone: "연락처",
  colGrade: "등급",
  colStatus: "상태",
  colCreatedAt: "가입일",

  // 상세
  sectionBasicInfo: "기본 정보",
  sectionOrders: "주문 내역",
  sectionPoints: "포인트",
  sectionMemos: "CS 메모",
  totalPoints: "보유 포인트",
  adjustPoints: "포인트 조정",
  adjustReason: "사유",
  adjustReasonPlaceholder: "포인트 조정 사유를 입력하세요",
  adjustAmount: "조정 금액",
  memoPlaceholder: "메모 내용을 입력하세요",
  addMemo: "메모 추가",

  // 등급 관리
  gradePageTitle: "등급 관리",
  gradeName: "등급명",
  gradeMinAmount: "기준 금액",
  gradeIconUrl: "아이콘",
  gradeEmptyMessage: "등록된 등급이 없습니다.",

  // 검색/필터
  searchPlaceholder: "이름 또는 이메일로 검색",
  filterStatus: "회원 상태",
  filterGrade: "등급",
  sortNewest: "최신순",
  sortOldest: "오래된순",
  sortLabel: "정렬",
};

// ─── 배너 ───
export const banner = {
  pageTitle: "배너 관리",
  addButton: "배너 추가",
  emptyMessage: "등록된 배너가 없습니다.",
  createTitle: "배너 추가",
  editTitle: "배너 수정",
  deleteTitle: "배너 삭제",
  deleteDescription: (title: string) => `"${title}" 배너를 삭제하시겠습니까?`,

  // 테이블 컬럼
  colImage: "",
  colTitle: "제목",
  colPosition: "위치",
  colStatus: "상태",
  colPeriod: "게시 기간",
  colCreatedAt: "등록일",

  // 폼
  titleLabel: "제목",
  titlePlaceholder: "배너 제목을 입력하세요",
  titleRequired: "제목을 입력해주세요.",
  positionLabel: "위치",
  positionPlaceholder: "배너 위치 선택",
  imageLabel: "배너 이미지",
  linkUrlLabel: "링크 URL",
  linkUrlPlaceholder: "https://example.com",
  statusLabel: "상태",
  startedAtLabel: "게시 시작일",
  endedAtLabel: "게시 종료일",
  noEndDate: "종료일 없음",
  sortOrderLabel: "정렬 순서",

  // 검색
  searchPlaceholder: "배너 제목으로 검색",
  filterStatus: "상태",
};

// ─── 공지사항 ───
export const notice = {
  pageTitle: "공지사항",
  addButton: "공지 등록",
  createTitle: "공지 등록",
  editTitle: "공지 수정",
  emptyMessage: "등록된 공지가 없습니다.",
  deleteTitle: "공지 삭제",
  deleteDescription: (title: string) => `"${title}" 공지를 삭제하시겠습니까?`,
  backToList: "목록으로",

  // 테이블 컬럼
  colTitle: "제목",
  colType: "유형",
  colStatus: "상태",
  colPinned: "고정",
  colCreatedAt: "등록일",

  // 폼
  titleLabel: "제목",
  titlePlaceholder: "공지 제목을 입력하세요",
  titleRequired: "제목을 입력해주세요.",
  typeLabel: "유형",
  typePlaceholder: "유형 선택",
  contentLabel: "내용",
  contentPlaceholder: "공지 내용을 입력하세요",
  contentRequired: "내용을 입력해주세요.",
  statusLabel: "상태",
  isPinnedLabel: "상단 고정",

  // 검색
  searchPlaceholder: "공지 제목으로 검색",
  filterType: "유형",
};

// ─── 프로모션 ───
export const promotion = {
  pageTitle: "프로모션",
  addButton: "프로모션 등록",
  createTitle: "프로모션 등록",
  editTitle: "프로모션 수정",
  emptyMessage: "등록된 프로모션이 없습니다.",
  backToList: "목록으로",

  // 테이블 컬럼
  colName: "프로모션명",
  colDiscountType: "할인 유형",
  colDiscountValue: "할인 값",
  colPeriod: "기간",
  colStatus: "상태",
  colCreatedAt: "등록일",

  // 폼
  nameLabel: "프로모션명",
  namePlaceholder: "프로모션명을 입력하세요",
  nameRequired: "프로모션명을 입력해주세요.",
  discountTypeLabel: "할인 유형",
  discountValueLabel: "할인 값",
  discountValuePlaceholder: "할인 값을 입력하세요",
  startedAtLabel: "시작일",
  endedAtLabel: "종료일",
  isActiveLabel: "활성 여부",
  categoriesLabel: "적용 카테고리",

  // 검색
  searchPlaceholder: "프로모션명으로 검색",
  filterActive: "활성 상태",
  sortLabel: "정렬",
  sortNewest: "최신순",
  sortOldest: "오래된순",
};

// ─── 쿠폰 ───
export const coupon = {
  pageTitle: "쿠폰 관리",
  addButton: "쿠폰 등록",
  createTitle: "쿠폰 등록",
  editTitle: "쿠폰 수정",
  emptyMessage: "등록된 쿠폰이 없습니다.",
  deleteTitle: "쿠폰 삭제",
  deleteDescription: (name: string) => `"${name}" 쿠폰을 삭제하시겠습니까?`,
  backToList: "목록으로",

  // 테이블 컬럼
  colName: "쿠폰명",
  colDiscountType: "할인 유형",
  colDiscountValue: "할인 값",
  colMinOrder: "최소 주문금액",
  colStatus: "상태",
  colPeriod: "유효 기간",
  colCreatedAt: "등록일",

  // 폼
  nameLabel: "쿠폰명",
  namePlaceholder: "쿠폰명을 입력하세요",
  nameRequired: "쿠폰명을 입력해주세요.",
  descriptionLabel: "설명",
  descriptionPlaceholder: "쿠폰 설명을 입력하세요",
  discountTypeLabel: "할인 유형",
  discountValueLabel: "할인 값",
  discountValuePlaceholder: "할인 값을 입력하세요",
  maxDiscountLabel: "최대 할인금액",
  maxDiscountPlaceholder: "최대 할인금액",
  minOrderLabel: "최소 주문금액",
  minOrderPlaceholder: "최소 주문금액",
  totalQuantityLabel: "발급 수량",
  totalQuantityPlaceholder: "발급 수량",
  validFromLabel: "유효 시작일",
  validToLabel: "유효 종료일",
  statusLabel: "상태",

  // 검색
  searchPlaceholder: "쿠폰명으로 검색",
  filterStatus: "상태",
  sortLabel: "정렬",
  sortNewest: "최신순",
  sortOldest: "오래된순",
};

// ─── 클레임 ───
export const claim = {
  pageTitle: "클레임 관리",
  detailTitle: "클레임 상세",
  emptyMessage: "클레임 내역이 없습니다.",
  notFound: "클레임을 찾을 수 없습니다.",
  backToList: "목록으로",

  // 테이블 컬럼
  colId: "번호",
  colOrderNumber: "주문번호",
  colType: "유형",
  colReason: "사유",
  colStatus: "상태",
  colAmount: "예상 환불금액",
  colCreatedAt: "접수일",

  // 상세
  sectionClaimInfo: "클레임 정보",
  sectionItems: "클레임 상품",
  reasonType: "사유 유형",
  reason: "상세 사유",
  refundAmount: "예상 환불금액",
  refundMethod: "환불 방법",

  // 액션
  actionApprove: "승인",
  actionReject: "거절",
  actionReceiveInspect: "검수 확인",
  actionReturnShipping: "반송 처리",
  actionReship: "재배송",
  actionComplete: "완료 처리",
  actionRegisterReturn: "반송 정보 등록",
  returnCarrierId: "택배사",
  returnCarrierIdPlaceholder: "택배사 ID를 입력하세요",
  returnTrackingNumber: "송장번호",
  returnTrackingNumberPlaceholder: "송장번호를 입력하세요",
  submitReturnShipping: "반송 등록",
  returnShippingSuccess: "반송 정보가 등록되었습니다.",

  // 검색
  searchPlaceholder: "주문번호로 검색",
  filterType: "클레임 유형",
  filterStatus: "상태",
  sortLabel: "정렬",
  sortNewest: "최신순",
  sortOldest: "오래된순",
};

// ─── 1:1 문의 ───
export const inquiry = {
  pageTitle: "1:1 문의",
  detailTitle: "문의 상세",
  emptyMessage: "문의 내역이 없습니다.",
  notFound: "문의를 찾을 수 없습니다.",
  backToList: "목록으로",

  // 테이블 컬럼
  colTitle: "제목",
  colType: "유형",
  colUser: "작성자",
  colStatus: "상태",
  colCreatedAt: "작성일",

  // 상세
  sectionQuestion: "문의 내용",
  sectionAnswer: "답변",
  answerPlaceholder: "답변을 입력하세요",
  answerButton: "답변 등록",
  answered: "답변 완료",
  answeredAt: "답변일",
  deleteTitle: "문의 삭제",
  deleteDescription: (title: string) => `"${title}" 문의를 삭제하시겠습니까?`,

  // 검색
  searchPlaceholder: "문의 제목으로 검색",
  filterType: "문의 유형",
  filterStatus: "답변 상태",
  sortLabel: "정렬",
  sortNewest: "최신순",
  sortOldest: "오래된순",
};

// ─── 리뷰 ───
export const review = {
  pageTitle: "리뷰 관리",
  detailTitle: "리뷰 상세",
  emptyMessage: "등록된 리뷰가 없습니다.",
  notFound: "리뷰를 찾을 수 없습니다.",
  backToList: "목록으로",

  // 테이블 컬럼
  colProduct: "상품",
  colUser: "작성자",
  colRating: "평점",
  colContent: "내용",
  colVisible: "노출",
  colCreatedAt: "작성일",

  // 상세
  sectionReview: "리뷰 내용",
  images: "리뷰 이미지",
  rating: "평점",
  visibilityToggle: "노출 상태 변경",

  // 검색
  searchPlaceholder: "상품명 또는 작성자로 검색",
  sortLabel: "정렬",
  sortNewest: "최신순",
  sortOldest: "오래된순",
  sortRatingHigh: "평점 높은순",
  sortRatingLow: "평점 낮은순",
};

// ─── FAQ ───
export const faq = {
  pageTitle: "FAQ 관리",
  addButton: "FAQ 추가",
  emptyMessage: "등록된 FAQ가 없습니다.",
  createTitle: "FAQ 추가",
  editTitle: "FAQ 수정",
  deleteTitle: "FAQ 삭제",
  deleteDescription: (question: string) => `"${question}" FAQ를 삭제하시겠습니까?`,

  // 테이블 컬럼
  colCategory: "카테고리",
  colQuestion: "질문",
  colCreatedAt: "등록일",

  // 폼
  categoryLabel: "카테고리",
  categoryPlaceholder: "카테고리 선택",
  categoryRequired: "카테고리를 선택해주세요.",
  questionLabel: "질문",
  questionPlaceholder: "질문을 입력하세요",
  questionRequired: "질문을 입력해주세요.",
  answerLabel: "답변",
  answerPlaceholder: "답변을 입력하세요",
  answerRequired: "답변을 입력해주세요.",

  // 카테고리 관리
  categoryPageTitle: "FAQ 카테고리",
  addCategoryButton: "카테고리 추가",
  categoryNameLabel: "카테고리명",
  categoryNamePlaceholder: "카테고리명을 입력하세요",
  categoryNameRequired: "카테고리명을 입력해주세요.",
  categoryDeleteTitle: "카테고리 삭제",
  categoryDeleteDescription: (name: string) => `"${name}" 카테고리를 삭제하시겠습니까?`,
  categoryEmptyMessage: "등록된 카테고리가 없습니다.",

  // 검색
  searchPlaceholder: "FAQ 검색",
  filterCategory: "카테고리",
};

// ─── 팝업 ───
export const popup = {
  pageTitle: "팝업 관리",
  addButton: "팝업 추가",
  emptyMessage: "등록된 팝업이 없습니다.",
  createTitle: "팝업 추가",
  editTitle: "팝업 수정",
  deleteTitle: "팝업 삭제",
  deleteDescription: (title: string) => `"${title}" 팝업을 삭제하시겠습니까?`,

  // 테이블 컬럼
  colTitle: "제목",
  colType: "유형",
  colStatus: "상태",
  colPeriod: "게시 기간",
  colCreatedAt: "등록일",

  // 폼
  titleLabel: "제목",
  titlePlaceholder: "팝업 제목을 입력하세요",
  titleRequired: "제목을 입력해주세요.",
  contentLabel: "내용",
  contentPlaceholder: "팝업 내용을 입력하세요",
  typeLabel: "유형",
  typePlaceholder: "유형 선택",
  statusLabel: "상태",
  startDateLabel: "게시 시작일",
  endDateLabel: "게시 종료일",

  // 검색
  searchPlaceholder: "팝업 제목으로 검색",
  filterStatus: "상태",
};

// ─── 상품 Q&A ───
export const qna = {
  pageTitle: "상품 Q&A",
  detailTitle: "Q&A 상세",
  emptyMessage: "등록된 Q&A가 없습니다.",
  notFound: "Q&A를 찾을 수 없습니다.",
  backToList: "목록으로",

  // 테이블 컬럼
  colProduct: "상품",
  colTitle: "제목",
  colUser: "작성자",
  colStatus: "상태",
  colSecret: "비밀글",
  colCreatedAt: "작성일",

  // 상세
  sectionQuestion: "질문",
  sectionAnswer: "답변",
  answerPlaceholder: "답변을 입력하세요",
  answerButton: "답변 등록",
  answered: "답변 완료",
  answeredAt: "답변일",

  // 검색
  searchPlaceholder: "Q&A 검색",
  filterStatus: "답변 상태",
  sortLabel: "정렬",
  sortNewest: "최신순",
  sortOldest: "오래된순",
};

// ─── 태그 ───
export const tag = {
  pageTitle: "태그 관리",
  addButton: "태그 추가",
  emptyMessage: "등록된 태그가 없습니다.",
  createTitle: "태그 추가",
  nameLabel: "태그명",
  namePlaceholder: "태그명을 입력하세요",
  nameRequired: "태그명을 입력해주세요.",
  colName: "태그명",
  colCreatedAt: "등록일",
};

// ─── 설정 ───
export const settings = {
  pageTitle: "설정",

  // 테넌트 (사이트 기본 설정)
  sectionTenant: "사이트 기본 설정",
  tenantName: "사이트명",
  tenantDomain: "도메인",
  tenantLogo: "로고",
  tenantFavicon: "파비콘",
  tenantSeo: "SEO 설정",
  tenantSeoTitle: "SEO 타이틀",
  tenantSeoDescription: "SEO 설명",
  tenantSeoKeywords: "SEO 키워드",
  tenantSocial: "소셜 설정",
  tenantNotification: "알림 설정",
  tenantSecurity: "보안 설정",
  tenantMaintenance: "점검 모드",
  tenantSettlement: "정산 설정",

  // 정책
  sectionPolicy: "약관/정책 관리",
  policyOrder: "주문 정책",
  policyDelivery: "배송 정책",
  policyProduct: "상품 정책",
  policyReturns: "반품/교환 정책",

  // 헤더 메뉴
  sectionHeaderMenu: "헤더 메뉴 관리",
  headerMenuEmpty: "등록된 메뉴가 없습니다.",
  headerMenuAdd: "메뉴 추가",
  headerMenuLabel: "메뉴명",
  headerMenuUrl: "URL",
  headerMenuSortOrder: "정렬 순서",
  headerMenuRemove: "메뉴 삭제",

  // 전시 관리
  sectionDisplay: "전시 관리",
  displayEmpty: "등록된 전시 섹션이 없습니다.",
};

// ─── 페이지네이션 / 검색 ───
export const pagination = {
  navLabel: "페이지 네비게이션",
  prevPage: "이전 페이지",
  nextPage: "다음 페이지",
  pageSizeLabel: "페이지당 표시 개수",
};

export const searchFilter = {
  defaultPlaceholder: "검색어를 입력하세요",
};

// ─── 메타 ───
export const meta = {
  title: "MIREP 통합어드민",
  description: "MIREP 통합어드민 페이지",
};
