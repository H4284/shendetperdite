import { expect, test } from "@playwright/test";

/**
 * Golden path against a running app (emulators or seeded production).
 * Set PLAYWRIGHT_BASE_URL to skip starting `next start`.
 */
test("browse → add to cart → checkout page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner")).toBeVisible();

  await page.goto("/categories/fitness");
  const productLink = page.locator('a[href^="/products/"]').first();
  await expect(productLink).toBeVisible({ timeout: 30_000 });
  await productLink.click();

  const add = page.getByRole("button", { name: /shto në shportë/i });
  await expect(add).toBeVisible();
  if (await add.isEnabled()) {
    await add.click();
    await expect(page.getByText(/shporta/i).first()).toBeVisible();
  }

  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: /arka|checkout|porosia/i }).or(page.locator("form")).first()).toBeVisible();
});

test("sitemap and robots are public", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const sitemapBody = await sitemap.text();
  expect(sitemapBody).toContain("urlset");

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  const robotsBody = await robots.text();
  expect(robotsBody).toMatch(/Disallow:\s*\/admin/i);
  expect(robotsBody).toMatch(/Disallow:\s*\/account/i);
  expect(robotsBody).toMatch(/Disallow:\s*\/checkout/i);
});
