export const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

/** ₹1.2L / ₹4.5K style for axes and tight spaces. */
export function compactMoney(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 10_000_000) return `₹${(value / 10_000_000).toFixed(1)}Cr`;
  if (abs >= 100_000) return `₹${(value / 100_000).toFixed(1)}L`;
  if (abs >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;

  return `₹${Math.round(value)}`;
}

/** % change vs the previous period; null when there is nothing to compare to. */
export function delta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;

  return ((current - previous) / previous) * 100;
}

export const labelOf = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Categorical series colours (validated: colour-blind safe in this order).
 * Colour follows the entity, never its rank, so statuses/methods keep
 * their colour when the data changes.
 */
export const SERIES = [
  "#8fbfdc",
  "#d2561c",
  "#8fb08a",
  "#e0b56a",
  "#b8457a",
  "#b4a8f0",
] as const;

export const OTHER = "#8c847d";

const STATUS_ORDER = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const METHOD_ORDER = ["bank_upi", "online", "cod"];

export const statusColor = (status: string) => {
  const index = STATUS_ORDER.indexOf(status);

  return index >= 0 ? SERIES[index]! : OTHER;
};

export const methodColor = (method: string) => {
  const index = METHOD_ORDER.indexOf(method);

  return index >= 0 ? SERIES[index]! : OTHER;
};

export const methodLabel = (method: string) =>
  method === "bank_upi" ? "Bank / UPI" : method === "online" ? "Online" : method === "cod" ? "Cash on delivery" : labelOf(method);
