export const SUPPORT_CATEGORIES = [
  "general",
  "order",
  "payment",
  "shipping",
  "return",
  "exchange",
  "product",
  "complaint",
] as const;

export const SUPPORT_PRIORITIES = [
  "low",
  "normal",
  "high",
  "urgent",
] as const;

export const SUPPORT_STATUSES = [
  "open",
  "in_progress",
  "waiting_customer",
  "resolved",
  "closed",
] as const;

export const SUPPORT_SORTS = [
  "newest",
  "oldest",
  "priority_high",
  "priority_low",
] as const;

export type SupportCategory =
  (typeof SUPPORT_CATEGORIES)[number];

export type SupportPriority =
  (typeof SUPPORT_PRIORITIES)[number];

export type SupportStatus =
  (typeof SUPPORT_STATUSES)[number];

export type SupportSort =
  (typeof SUPPORT_SORTS)[number];

export type SupportTicket = {
  _id: string;

  ticketNumber: string;

  userId: string | null;

  orderNumber: string;

  customerName: string;

  customerEmail: string;

  subject: string;

  message: string;

  category: SupportCategory;

  priority: SupportPriority;

  status: SupportStatus;

  assignedTo: string | null;

  resolutionNote: string;

  closedAt: string | null;

  createdAt: string;

  updatedAt: string;
};

export type SupportStats = {
  total: number;
  open: number;
  inProgress: number;
  waitingCustomer: number;
  resolved: number;
  closed: number;
  urgent: number;
};

export type SupportListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: SupportStatus;
  priority?: SupportPriority;
  category?: SupportCategory;
  assignedTo?: string;
  sort?: SupportSort;
};

export type SupportUpdateInput = {
  customerName?: string;
  customerEmail?: string;
  subject?: string;
  message?: string;
  category?: SupportCategory;
  priority?: SupportPriority;
  status?: SupportStatus;
  assignedTo?: string | null;
  resolutionNote?: string;
};

export type SupportCloseInput = {
  resolutionNote?: string;
};

export type SupportListResponse = {
  success: boolean;
  data: {
    items: SupportTicket[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type SupportResponse = {
  success: boolean;
  data: SupportTicket;
};

export type SupportStatsResponse = {
  success: boolean;
  data: SupportStats;
};