import { expect, test, type Page } from "@playwright/test";

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/email address/i).fill("admin@aayesha.com");
  await page.locator('input[type="password"]').fill("Passw0rd!x");
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("**/admin", { timeout: 30_000 });
}

test.describe("admin journeys", () => {
  test("an anonymous visitor is sent to the login page", async ({ page }) => {
    await page.route("**/api/auth/refresh", (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication is required." } }) }),
    );
    await page.goto("/admin/orders");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login rejects a malformed email in the browser", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email address/i).fill("nope");
    await page.locator('input[type="password"]').fill("x");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("a bad password shows the server's message and stays on the login page", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } }) }),
    );
    await page.route("**/api/auth/refresh", (route) => route.fulfill({ status: 401, contentType: "application/json", body: "{}" }));
    await page.goto("/login");
    await page.getByLabel(/email address/i).fill("admin@aayesha.com");
    await page.locator('input[type="password"]').fill("wrong-password");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("dashboard, orders, products and customers load after sign-in", async ({ page }) => {
    await signIn(page);
    await expect(page.getByText(/needs attention/i)).toBeVisible({ timeout: 20_000 });
    for (const [path, heading] of [
      ["/admin/orders", /orders/i],
      ["/admin/products", /products/i],
      ["/admin/customers", /customers/i],
      ["/admin/discounts", /discounts/i],
    ] as const) {
      await page.goto(path);
      await expect(page.locator("main h1").first()).toContainText(heading, { timeout: 20_000 });
    }
  });

  test("destructive actions ask for confirmation", async ({ page }) => {
    await signIn(page);
    await page.goto("/admin/catalog/categories");
    await page.getByRole("button", { name: /^delete/i }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("the admin site is not indexable and sends security headers", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toMatch(/Disallow:\s*\//);
    const login = await request.get("/login");
    expect(login.headers()["x-robots-tag"]).toMatch(/noindex/);
    expect(login.headers()["x-frame-options"]).toBe("DENY");
  });
});
