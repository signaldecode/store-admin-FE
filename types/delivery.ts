export interface Shipment {
  id: number;
  orderId: number;
  carrierId: number;
  carrierName: string;
  trackingNumber: string;
  status: string;
  trackingUrl: string | null;
  items: ShipmentItem[];
  createdAt: string;
}

export interface ShipmentItem {
  orderItemId: number;
  productName: string;
  quantity: number;
}

export interface ShipmentCreateRequest {
  carrierId: number;
  trackingNumber: string;
  items: { orderItemId: number; quantity: number }[];
}

export interface ShipmentTracking {
  shipmentId: number;
  status: string;
  history: { status: string; description: string; timestamp: string }[];
}
