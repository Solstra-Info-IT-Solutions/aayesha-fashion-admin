import { API_BASE_URL, ApiError } from "@/lib/api";

export type RevenueExportType = "orders" | "daily";

/** Downloads a revenue CSV for the given day range (YYYY-MM-DD). */
export async function downloadRevenueCsv(
  accessToken: string,
  input: { type: RevenueExportType; from: string; to: string; scope?: "paid" | "all" },
): Promise<void> {
  const params = new URLSearchParams({
    type: input.type,
    from: input.from,
    to: input.to,
    scope: input.scope ?? "paid",
  });

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/admin/dashboard/export?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Could not reach the server.", 0, "NETWORK_ERROR");
  }

  if (!response.ok) {
    let message = "The export failed.";

    try {
      message = (await response.json())?.error?.message ?? message;
    } catch {
      /* keep default */
    }

    throw new ApiError(message, response.status);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `revenue-${input.type}-${input.from}_to_${input.to}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
