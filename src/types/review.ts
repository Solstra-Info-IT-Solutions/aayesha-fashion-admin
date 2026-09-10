export const REVIEW_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;

export const REVIEW_SORTS = [
  "newest",
  "oldest",
  "highest_rating",
  "lowest_rating",
] as const;

export type ReviewStatus =
  (typeof REVIEW_STATUSES)[number];

export type ReviewSort =
  (typeof REVIEW_SORTS)[number];

export type Review = {
  _id: string;

  productId: string;
  userId: string;
  orderNumber: string;

  rating: number;
  title: string;
  body: string;

  status: ReviewStatus;
  isFeatured: boolean;

  adminNote: string;

  moderatedBy: string | null;
  moderatedAt: string | null;

  createdAt: string;
  updatedAt: string;
};

export type ReviewStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  featured: number;
  averageRating: number;
};

export type ReviewListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReviewStatus;
  sort?: ReviewSort;
};

export type ReviewModerateInput = {
  status: ReviewStatus;
  adminNote?: string;
};

export type ReviewFeaturedInput = {
  isFeatured: boolean;
};

export type ReviewUpdateInput = {
  title?: string;
  body?: string;
  rating?: number;
  adminNote?: string;
};

export type ReviewListResponse = {
  success: boolean;
  data: {
    items: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type ReviewResponse = {
  success: boolean;
  data: Review;
};

export type ReviewStatsResponse = {
  success: boolean;
  data: ReviewStats;
};