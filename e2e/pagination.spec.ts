import { test, expect } from "@playwright/test";

/**
 * Pagination UI integration tests — AniVerse Design System v2 game-style
 * pagination bar (Pagination component, added 2026-08-12/13):
 *
 *   - "PAGE X OF Y" monospace readout (sys-label)
 *   - chamfered Prev/Next icon buttons with aria-labels
 *   - numbered page buttons with gold active state + aria-current="page"
 *   - prev disabled on page 1, next disabled on the last page
 *
 * Covers the two public pages that render it: /characters (2 pages @ 24/pp)
 * and /blog (2 pages @ 20/pp). The component returns null when totalPages<=1
 * (e.g. /challenges), which is also asserted as a graceful absence.
 */

test.describe("Pagination UI", () => {
  test("characters page shows game-style pagination bar with PAGE readout", async ({
    page,
  }) => {
    await page.goto("/characters");

    // Readout + numbered buttons appear once the CSR list has data
    await expect(page.getByText("PAGE 1 OF 2").first()).toBeVisible({
      timeout: 15000,
    });
    // Active page button carries aria-current and gold styling
    const page1Btn = page.getByRole("button", { name: "Page 1" }).first();
    await expect(page1Btn).toHaveAttribute("aria-current", "page");
    // Prev is disabled on page 1, Next is enabled
    await expect(
      page.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Next page" }),
    ).toBeEnabled();
  });

  test("characters page: clicking Next loads page 2 and flips readout + states", async ({
    page,
  }) => {
    await page.goto("/characters");
    await expect(page.getByText("PAGE 1 OF 2").first()).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole("button", { name: "Next page" }).click();

    // Readout flips to page 2, active state moves, prev becomes enabled
    await expect(page.getByText("PAGE 2 OF 2").first()).toBeVisible({
      timeout: 15000,
    });
    await expect(
      page.getByRole("button", { name: "Page 2" }).first(),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      page.getByRole("button", { name: "Previous page" }),
    ).toBeEnabled();
    // Next is disabled on the last page
    await expect(
      page.getByRole("button", { name: "Next page" }),
    ).toBeDisabled();

    // Prev returns to page 1
    await page.getByRole("button", { name: "Previous page" }).click();
    await expect(page.getByText("PAGE 1 OF 2").first()).toBeVisible({
      timeout: 15000,
    });
  });

  test("blog page shows pagination and numbered jump works", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByText("PAGE 1 OF 2").first()).toBeVisible({
      timeout: 15000,
    });

    // Jump straight to the last page via the numbered button.
    await page.getByRole("button", { name: "Page 2" }).click();
    await expect(page.getByText("PAGE 2 OF 2").first()).toBeVisible({
      timeout: 15000,
    });
    await expect(
      page.getByRole("button", { name: "Page 2" }).first(),
    ).toHaveAttribute("aria-current", "page");
    // Next is disabled on the last page.
    await expect(
      page.getByRole("button", { name: "Next page" }),
    ).toBeDisabled();
  });

  test("challenges page (single page) renders no pagination bar", async ({
    page,
  }) => {
    await page.goto("/challenges");
    // Pagination returns null when totalPages <= 1 — no crash, no empty bar.
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText(/PAGE \d+ OF \d+/).first()).not.toBeVisible({
      timeout: 5000,
    });
  });
});
