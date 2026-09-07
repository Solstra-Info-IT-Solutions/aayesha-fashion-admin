export type OrderStatus =
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "exchanged";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type PaymentMethod =
  | "cod"
  | "razorpay"
  | "online"
  | string;

export type OrderItem = {
  productId: string;
  variantId: string;
  productName?: string;
  sku?: string;
  quantity: number;
  sellingPrice?: number;
  mrp?: number;
  total?: number;
  image?: string;
};

export type AdminOrder = {
  _id?: string;
  orderNumber: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  subtotal: number;
  mrpTotal: number;
  productDiscount: number;
  couponCode?: string | null;
  couponDiscount: number;
  shippingAmount: number;
  total: number;
  currency: string;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string | null;
  paymentSource?: string | null;

  status: OrderStatus;

  deliveryMethod?: string;

  shippingAddress?: {
    name?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    pincode?: string;
    country?: string;
  };

  shippingInfo?: {
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
  };

  items: OrderItem[];

  adminNotes?: string;

  createdAt?: string;
  updatedAt?: string;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
};

export type OrderListFilters = {
  page: number;
  limit: number;
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  customerEmail?: string;
  customerPhone?: string;
  sort?:
    | "newest"
    | "oldest"
    | "highest_value"
    | "lowest_value";
};

export type OrderPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type AdminOrderListResponse = {
  orders: AdminOrder[];
  pagination: OrderPagination;
};