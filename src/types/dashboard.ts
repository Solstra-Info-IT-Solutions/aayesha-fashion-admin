export type DashboardSummary = {
  revenue: number;
  orders: number;
  customers: number;
  products: number;
};

export type RevenuePoint = {
  date: string;
  label: string;
  revenue: number;
};

export type OrderStatusSummary = {
  status: string;
  count: number;
};

export type DashboardOrder = {
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
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

export type DashboardData = {
  summary: DashboardSummary;
  revenue: RevenuePoint[];
  orderStatus: OrderStatusSummary[];
  recentOrders: DashboardOrder[];
  lowStockProducts: LowStockProduct[];
  topProducts: TopProduct[];
};