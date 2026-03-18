/**
 * UI 텍스트 통합 관리
 * - 컴포넌트/페이지에서 직접 한글 문자열을 사용하지 않고 이 파일에서 가져온다
 * - 향후 다국어(i18n) 전환 시 이 파일만 교체하면 된다
 */

import type { ProductStatus, OptionType, AdminRole, DiscountType } from "@/lib/constants";

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
  totalCount: (count: number) => `/ 총 ${count.toLocaleString("ko-KR")}건`,
  itemUnit: (size: number) => `${size}개`,
  errorOccurred: "오류가 발생했습니다",
  errorFallback: "페이지를 불러오는 중 문제가 발생했습니다.",
  saveFailed: "저장에 실패했습니다.",
  loginFailed: "로그인에 실패했습니다.",
  all: "전체",
};

// ─── 레이아웃 ───
export const layout = {
  appName: "시그널 디코드 스토어",
  appNameShort: "시",
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
  sectionMainCategory: "대분류 선택",
  sectionMainCategoryHint: "대분류를 먼저 선택해주세요.",
  sectionBasic: "기본 정보",
  sectionAdditional: "추가 정보",
  sectionOptions: "사용자 정의 옵션",

  // 폼 라벨
  nameLabel: "상품명",
  namePlaceholder: "상품명을 입력하세요",
  descriptionLabel: "상품 설명",
  descriptionPlaceholder: "상품 설명을 입력하세요",
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
  filterMainCategoryGroup: "대분류",
  filterMainCategoryAll: "전체",
  filterSubCategoryGroup: "중분류",
  filterDetailCategoryGroup: "소분류",
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
  title: "Shop Admin",
  description: "쇼핑몰 관리자 페이지",
};
