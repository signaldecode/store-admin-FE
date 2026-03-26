import type { Order, OrderSummary, OrderListParams } from "@/types/order";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Mock Data ───
const MOCK_ORDERS: Order[] = Array.from({ length: 35 }, (_, i) => {
  const statuses = ["PENDING", "PAID", "PREPARING", "SHIPPING", "DELIVERED", "CANCELLED"] as const;
  const names = ["김민수", "이영희", "박지훈", "최수진", "정태호", "한소영"];
  const products = ["오버핏 코튼 티셔츠", "슬림핏 데님 팬츠", "울 블렌드 코트", "캐시미어 니트", "리넨 셔츠"];
  return {
    id: i + 1,
    orderNumber: `ORD-2026${String(i + 1).padStart(6, "0")}`,
    status: statuses[i % statuses.length],
    customerName: names[i % names.length],
    customerEmail: `user${i + 1}@example.com`,
    items: [
      {
        id: i * 10 + 1,
        productId: (i % 5) + 1,
        productName: products[i % products.length],
        thumbnailUrl: null,
        optionSummary: "블랙 / M",
        quantity: 1 + (i % 3),
        unitPrice: 29000 + i * 1000,
        totalPrice: (29000 + i * 1000) * (1 + (i % 3)),
      },
    ],
    shippingAddress: {
      recipientName: names[i % names.length],
      phone: "010-1234-5678",
      zipCode: "06234",
      address: "서울특별시 강남구 테헤란로 123",
      addressDetail: `${100 + i}호`,
      memo: i % 3 === 0 ? "부재 시 경비실에 맡겨주세요" : "",
    },
    payment: {
      method: i % 2 === 0 ? "카드결제" : "무통장입금",
      amount: (29000 + i * 1000) * (1 + (i % 3)),
      paidAt: statuses[i % statuses.length] !== "PENDING" ? "2026-03-20T10:30:00" : null,
    },
    totalAmount: (29000 + i * 1000) * (1 + (i % 3)),
    createdAt: new Date(2026, 2, 25 - (i % 30)).toISOString(),
    updatedAt: new Date(2026, 2, 25 - (i % 30)).toISOString(),
  };
});

function toSummary(o: Order): OrderSummary {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    customerName: o.customerName,
    itemSummary: o.items[0]?.productName + (o.items.length > 1 ? ` 외 ${o.items.length - 1}건` : ""),
    itemCount: o.items.length,
    totalAmount: o.totalAmount,
    createdAt: o.createdAt,
  };
}

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getOrders(params?: OrderListParams): Promise<PaginatedResponse<OrderSummary>> {
  await delay();
  let filtered = [...MOCK_ORDERS];
  if (params?.status) filtered = filtered.filter((o) => o.status === params.status);
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter(
      (o) => o.orderNumber.toLowerCase().includes(kw) || o.customerName.toLowerCase().includes(kw)
    );
  }
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;
  const start = (page - 1) * size;
  return {
    success: true,
    data: {
      content: filtered.slice(start, start + size).map(toSummary),
      page,
      size,
      total_elements: filtered.length,
    },
  };
}

export async function getOrder(id: number): Promise<ApiResponse<Order>> {
  await delay();
  const order = MOCK_ORDERS.find((o) => o.id === id);
  if (!order) throw new Error("주문을 찾을 수 없습니다.");
  return { success: true, data: order };
}

export async function updateOrderStatus(ids: number[], status: string): Promise<void> {
  await delay();
  ids.forEach((id) => {
    const order = MOCK_ORDERS.find((o) => o.id === id);
    if (order) (order as unknown as Record<string, unknown>).status = status;
  });
}

export async function getOrderStatuses(): Promise<ApiResponse<{ value: string; label: string }[]>> {
  await delay();
  return {
    success: true,
    data: [
      { value: "PENDING", label: "결제대기" },
      { value: "PAID", label: "결제완료" },
      { value: "PREPARING", label: "상품준비중" },
      { value: "SHIPPING", label: "배송중" },
      { value: "DELIVERED", label: "배송완료" },
      { value: "CANCELLED", label: "주문취소" },
      { value: "REFUNDED", label: "환불완료" },
    ],
  };
}
