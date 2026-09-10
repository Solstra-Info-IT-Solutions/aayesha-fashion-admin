export type SettingValue = unknown;

export type StoreSetting = {
  _id: string;
  key: string;
  value: SettingValue;
  group: string;
  isPublic: boolean;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SettingListParams = {
  group?: string;
};

export type SettingUpsertInput = {
  key: string;
  value: SettingValue;
  group: string;
  isPublic?: boolean;
};

export type SettingPublicInput = {
  isPublic: boolean;
};

export type SettingListResponse = {
  success: boolean;
  data: StoreSetting[];
};

export type SettingResponse = {
  success: boolean;
  data: StoreSetting;
};

export type SettingApiError = {
  code?: string;
  message?: string;
  details?: unknown;
};

export type SettingApiResponse<T> = {
  success: boolean;
  data: T;
  error?: SettingApiError;
};