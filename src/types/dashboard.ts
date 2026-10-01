export type DashboardSummary = {
  /** All-time paid revenue. */
  revenue: number;
  orders: number;
  customers: number;
  products: number;
};

export type PeriodTotals = {
  revenue: number;
  paidOrders: number;
  orders: number;
  newCustomers: number;
};

export type TrendPoint = {
  date: string;
  label: string;
  revenue: number;
  orders: number;
};

/** @deprecated use TrendPoint */
export type RevenuePoint = TrendPoint;

export type OrderStatusSummary = {
  status: string;
  count: number;
};

export type PaymentMethodSummary = {
  method: string;
  count: number;
  total: number;
};

export type DashboardOrder = {
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus?: string;
  createdAt?: string;
};

export type LowStockProduct = {
  id: string;
  name: string;
  sku: string;
  stock: number;
};

export type TopProduct = {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
};

export type DashboardRange = {
  days: number;
  from: string;
  to: string;
};

export type DashboardData = {
  summary: DashboardSummary;
  range?: DashboardRange;
  current?: PeriodTotals;
  previous?: PeriodTotals;
  trend?: TrendPoint[];
  revenue: TrendPoint[];
  paymentMethods?: PaymentMethodSummary[];
  orderStatus: OrderStatusSummary[];
  recentOrders: DashboardOrder[];
  lowStockProducts: LowStockProduct[];
  topProducts: TopProduct[];
};
