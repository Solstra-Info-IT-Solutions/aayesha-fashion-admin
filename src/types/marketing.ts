export const MARKETING_CAMPAIGN_TYPES = [
  "homepage",
  "collection",
  "product",
  "email",
  "whatsapp",
  "social",
] as const;

export const MARKETING_CAMPAIGN_STATUSES = [
  "draft",
  "scheduled",
  "active",
  "paused",
  "completed",
  "archived",
] as const;

export const MARKETING_CAMPAIGN_SORTS = [
  "newest",
  "oldest",
  "name_asc",
  "name_desc",
  "budget_high",
  "budget_low",
  "start_newest",
  "start_oldest",
] as const;

export type MarketingCampaignType =
  (typeof MARKETING_CAMPAIGN_TYPES)[number];

export type MarketingCampaignStatus =
  (typeof MARKETING_CAMPAIGN_STATUSES)[number];

export type MarketingCampaignSort =
  (typeof MARKETING_CAMPAIGN_SORTS)[number];

export type MarketingCampaign = {
  _id: string;
  name: string;
  description: string;
  type: MarketingCampaignType;
  status: MarketingCampaignStatus;

  budget: number;

  startsAt: string;
  endsAt: string | null;

  createdBy: string | null;
  updatedBy: string | null;

  createdAt: string;
  updatedAt: string;
};

export type MarketingCampaignStats = {
  total: number;
  draft: number;
  scheduled: number;
  active: number;
  paused: number;
  completed: number;
  archived: number;
  totalBudget: number;
};

export type MarketingCampaignListParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: MarketingCampaignType;
  status?: MarketingCampaignStatus;
  sort?: MarketingCampaignSort;
  includeArchived?: boolean;
};

export type MarketingCampaignCreateInput = {
  name: string;
  description?: string;
  type: MarketingCampaignType;
  status?: MarketingCampaignStatus;
  budget?: number;
  startsAt: string;
  endsAt?: string | null;
};

export type MarketingCampaignUpdateInput =
  Partial<MarketingCampaignCreateInput>;

export type MarketingCampaignStatusInput = {
  status: MarketingCampaignStatus;
};

export type MarketingCampaignListResponse = {
  success: boolean;
  data: {
    campaigns: MarketingCampaign[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type MarketingCampaignResponse = {
  success: boolean;
  data: MarketingCampaign;
};

export type MarketingCampaignStatsResponse = {
  success: boolean;
  data: MarketingCampaignStats;
};