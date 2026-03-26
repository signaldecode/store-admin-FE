import type { Shipment, ShipmentCreateRequest, ShipmentTracking } from "@/types/delivery";
import type { ApiResponse } from "@/types/api";

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function createShipment(
  orderId: number,
  data: ShipmentCreateRequest,
): Promise<ApiResponse<Shipment>> {
  await delay();
  const shipment: Shipment = {
    id: Date.now(),
    orderId,
    carrierId: data.carrierId,
    carrierName: data.carrierId === 1 ? "CJ대한통운" : data.carrierId === 2 ? "한진택배" : "롯데택배",
    trackingNumber: data.trackingNumber,
    status: "SHIPPED",
    trackingUrl: `https://trace.cjlogistics.com/web/detail.jsp?slipno=${data.trackingNumber}`,
    items: data.items.map((item) => ({
      orderItemId: item.orderItemId,
      productName: `상품 #${item.orderItemId}`,
      quantity: item.quantity,
    })),
    createdAt: new Date().toISOString(),
  };
  return { success: true, data: shipment };
}

export async function refreshShipmentTracking(
  shipmentId: number,
): Promise<ApiResponse<ShipmentTracking>> {
  await delay();
  const tracking: ShipmentTracking = {
    shipmentId,
    status: "IN_TRANSIT",
    history: [
      { status: "PICKED_UP", description: "집하 완료", timestamp: new Date(Date.now() - 86400000).toISOString() },
      { status: "IN_TRANSIT", description: "배송 중 — 서울 허브 도착", timestamp: new Date().toISOString() },
    ],
  };
  return { success: true, data: tracking };
}

export async function refreshOrderTracking(
  orderId: number,
): Promise<ApiResponse<ShipmentTracking>> {
  await delay();
  const tracking: ShipmentTracking = {
    shipmentId: orderId * 100,
    status: "IN_TRANSIT",
    history: [
      { status: "PICKED_UP", description: "집하 완료", timestamp: new Date(Date.now() - 86400000).toISOString() },
      { status: "IN_TRANSIT", description: "배송 중 — 서울 허브 도착", timestamp: new Date().toISOString() },
    ],
  };
  return { success: true, data: tracking };
}
