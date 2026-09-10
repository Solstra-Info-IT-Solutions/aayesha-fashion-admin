export const COUPON_DISCOUNT_TYPES = [
  "percentage",
  "fixed",
  "free_shipping",
] as const;

export const COUPON_STATUSES = [
  "active",
  "inactive",
  "expired",
  "scheduled",
] as const;

export const COUPON_SORTS = [
  "newest",
  "oldest",
  "highest_usage",
  "lowest_usage",
] as const;

export type CouponDiscountType =
  (typeof COUPON_DISCOUNT_TYPES)[number];

export type CouponStatus =
  (typeof COUPON_STATUSES)[number];

export type CouponSort =
  (typeof COUPON_SORTS)[number];

export type Coupon = {
  _id: string;
  code: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscountAmount: number | null;
  minimumOrderValue: number;
  usageLimit: number | null;
  usageLimitPerCustomer: number | null;
  usedCount: number;
  applicableProductIds: string[];
  applicableCollectionIds: string[];
  firstOrderOnly: boolean;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  publishedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  lifecycleStatus: CouponStatus;
};

export type CouponStats = {
  total: number;
  active: number;
  inactive: number;
  scheduled: number;
  expired: number;
  totalUsage: number;
};

export type CouponListParams = {
  page?: number;
  limit?: number;
  search?: string;
  discountType?: CouponDiscountType;
  status?: CouponStatus;
  sort?: CouponSort;
};

export type CouponCreateInput = {
  code: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscountAmount?: number | null;
  minimumOrderValue?: number;
  usageLimit?: number | null;
  usageLimitPerCustomer?: number | null;
  applicableProductIds?: string[];
  applicableCollectionIds?: string[];
  firstOrderOnly?: boolean;
  startsAt: string;
  endsAt?: string | null;
  isActive?: boolean;
};

export type CouponUpdateInput =
  Partial<CouponCreateInput>;

export type CouponStatusInput = {
  isActive: boolean;
};

export type CouponListResponse = {
  success: boolean;
  data: {
    items: Coupon[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type CouponResponse = {
  success: boolean;
  data: Coupon;
};

export type CouponStatsResponse = {
  success: boolean;
  data: CouponStats;
};