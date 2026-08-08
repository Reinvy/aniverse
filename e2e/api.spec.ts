import { test, expect } from "@playwright/test";

test.describe("API Endpoints", () => {
  test("GET /api/artworks should return 401 when not authenticated", async ({
    request,
  }) => {
    const response = await request.get("/api/artworks");
    // Requires authentication - should be 401
    expect([401, 403]).toContain(response.status());
  });

  test("GET /api/blog should return 200", async ({ request }) => {
    const response = await request.get("/api/blog");
    expect(response.ok()).toBe(true);
  });

  test("GET /api/characters should return 200", async ({ request }) => {
    const response = await request.get("/api/characters");
    expect(response.ok()).toBe(true);
  });

  test("GET /api/challenges should return 200", async ({ request }) => {
    const response = await request.get("/api/challenges");
    expect(response.ok()).toBe(true);
  });

  test("GET /api/characters/[id] should return 200 for an existing character", async ({
    request,
  }) => {
    // Fetch the list first to get a real character id (ids are DB-generated, not slugs)
    const listResponse = await request.get("/api/characters");
    expect(listResponse.ok()).toBe(true);
    const listBody = await listResponse.json();
    const characters = Array.isArray(listBody)
      ? listBody
      : (listBody.characters ?? listBody.data ?? []);
    expect(characters.length).toBeGreaterThan(0);
    const firstId = characters[0].id;
    expect(firstId).toBeTruthy();

    const response = await request.get(`/api/characters/${firstId}`);
    expect(response.ok()).toBe(true);
    const body = await response.json();
    const character = body.character ?? body;
    expect(character.name).toBeDefined();
  });

  test("GET /api/characters/[id] should return 404 for an unknown id", async ({
    request,
  }) => {
    const response = await request.get(
      "/api/characters/this-id-does-not-exist-xyz",
    );
    expect([404, 400]).toContain(response.status());
  });

  test("GET /api/dashboard/stats should return 401 when not authenticated", async ({
    request,
  }) => {
    const response = await request.get("/api/dashboard/stats");
    // Should return 401 or 403 since we're not authenticated
    expect([401, 403]).toContain(response.status());
  });

  test("GET /api/auth/me should return 401 when no token is present", async ({
    request,
  }) => {
    const response = await request.get("/api/auth/me");
    expect([401, 403]).toContain(response.status());
    const body = await response.json();
    // Graceful JSON error, not an HTML crash page
    expect(body.error ?? body.message).toBeDefined();
  });

  test("GET /api/gallery should return 200 with artworks", async ({
    request,
  }) => {
    const response = await request.get("/api/gallery");
    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(Array.isArray(body.artworks)).toBe(true);
  });

  test("GET /api/challenges/current should respond gracefully (active or empty state)", async ({
    request,
  }) => {
    const response = await request.get("/api/challenges/current");
    // Either an active challenge (200) or a graceful empty state (404 JSON) is valid
    expect([200, 404]).toContain(response.status());
    const body = await response.json();
    if (response.status() === 200) {
      expect(body.challenge ?? body).toBeDefined();
    } else {
      // Empty state must be a JSON error object, not an HTML crash page
      expect(body.error).toBeDefined();
    }
  });

  test("POST /api/auth/login with invalid credentials should return 401", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/login", {
      data: { email: "nonexistent@test.com", password: "wrongpassword" },
    });
    expect([401, 400]).toContain(response.status());
  });

  test("POST /api/auth/register with validation errors should return 400", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/register", {
      data: { email: "", password: "" },
    });
    expect(response.status()).toBe(400);
  });

  test("GET /api/users should return 401 when not authenticated", async ({
    request,
  }) => {
    const response = await request.get("/api/users");
    expect([401, 403]).toContain(response.status());
  });

  test("GET /api/blog/[slug] should return 200 for existing slug", async ({
    request,
  }) => {
    const response = await request.get(
      "/api/blog/original-character-universe-worldbuilding-2026",
    );
    expect(response.ok()).toBe(true);
  });

  test("GET /api/blog/[slug] should return 404 for unknown slug", async ({
    request,
  }) => {
    const response = await request.get(
      "/api/blog/this-slug-does-not-exist-xyz",
    );
    expect([404, 400]).toContain(response.status());
  });

  test("GET /api/health should return 200", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body.status).toBeDefined();
  });

  test("GET /api/gallery cursor pagination: page1 emits nextCursor, page2 has no overlap", async ({
    request,
  }) => {
    // Regression for PR #93/#94 — keyset (cursor) pagination contract.
    const page1 = await request.get("/api/gallery?limit=2");
    expect(page1.ok()).toBe(true);
    const body1 = await page1.json();
    const ids1 = body1.artworks.map((a: { id: string }) => a.id);
    expect(ids1.length).toBeGreaterThan(0);
    const nextCursor = body1.pagination?.nextCursor;
    expect(nextCursor).toBeTruthy();

    // Follow the cursor — must return 200, items, and no overlap with page 1
    const page2 = await request.get(
      `/api/gallery?limit=2&cursor=${encodeURIComponent(nextCursor)}`,
    );
    expect(page2.ok()).toBe(true);
    const body2 = await page2.json();
    const ids2 = body2.artworks.map((a: { id: string }) => a.id);
    expect(ids2.length).toBeGreaterThan(0);
    const overlap = ids1.filter((id: string) => ids2.includes(id));
    expect(overlap).toEqual([]);
  });

  test("GET /api/blog cursor pagination: page1 emits nextCursor, page2 has no overlap", async ({
    request,
  }) => {
    const page1 = await request.get("/api/blog?limit=2");
    expect(page1.ok()).toBe(true);
    const body1 = await page1.json();
    const ids1 = body1.articles.map((a: { id: string }) => a.id);
    expect(ids1.length).toBeGreaterThan(0);
    const nextCursor = body1.pagination?.nextCursor;
    expect(nextCursor).toBeTruthy();

    const page2 = await request.get(
      `/api/blog?limit=2&cursor=${encodeURIComponent(nextCursor)}`,
    );
    expect(page2.ok()).toBe(true);
    const body2 = await page2.json();
    const ids2 = body2.articles.map((a: { id: string }) => a.id);
    expect(ids2.length).toBeGreaterThan(0);
    const overlap = ids1.filter((id: string) => ids2.includes(id));
    expect(overlap).toEqual([]);
  });

  test("GET /api/characters page-based pagination honors page param", async ({
    request,
  }) => {
    const page1 = await request.get("/api/characters?limit=2&page=1");
    expect(page1.ok()).toBe(true);
    const body1 = await page1.json();
    expect(body1.pagination.page).toBe(1);
    expect(body1.pagination.hasNextPage).toBe(true);

    const page2 = await request.get("/api/characters?limit=2&page=2");
    expect(page2.ok()).toBe(true);
    const body2 = await page2.json();
    expect(body2.pagination.page).toBe(2);
    expect(body2.pagination.hasPrevPage).toBe(true);

    // No overlap between pages
    const ids1 = body1.characters.map((c: { id: string }) => c.id);
    const ids2 = body2.characters.map((c: { id: string }) => c.id);
    const overlap = ids1.filter((id: string) => ids2.includes(id));
    expect(overlap).toEqual([]);
  });

  test("GET /api/challenges?type=DAILY should return only DAILY challenges", async ({
    request,
  }) => {
    // Regression for PR #100 — type filter on the challenges list endpoint.
    const response = await request.get("/api/challenges?scope=all&type=DAILY&limit=20");
    expect(response.ok()).toBe(true);
    const body = await response.json();
    const challenges = body.challenges ?? [];
    expect(challenges.length).toBeGreaterThan(0);
    const types = new Set<string>(
      challenges.map((c: { type?: string }) => c.type ?? "DAILY"),
    );
    expect(Array.from(types)).toEqual(["DAILY"]);
  });

  test("GET /api/challenges?type=WEEKLY should return only WEEKLY challenges", async ({
    request,
  }) => {
    const response = await request.get("/api/challenges?scope=all&type=WEEKLY&limit=20");
    expect(response.ok()).toBe(true);
    const body = await response.json();
    const challenges = body.challenges ?? [];
    expect(challenges.length).toBeGreaterThan(0);
    const types = new Set<string>(
      challenges.map((c: { type?: string }) => c.type ?? "WEEKLY"),
    );
    expect(Array.from(types)).toEqual(["WEEKLY"]);
  });

  test("GET /api/challenges?type=INVALID should ignore unknown type gracefully", async ({
    request,
  }) => {
    // Unknown type values must not 500 — they fall back to the unfiltered list.
    const response = await request.get(
      "/api/challenges?scope=all&type=NOT_A_REAL_TYPE&limit=3",
    );
    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(Array.isArray(body.challenges)).toBe(true);
    expect(body.challenges.length).toBeGreaterThan(0);
  });

  test("GET /feed.xml should return XML with 200", async ({ request }) => {
    const response = await request.get("/feed.xml");
    expect(response.ok()).toBe(true);
    const text = await response.text();
    expect(text).toContain("<?xml");
    expect(text).toContain("<rss");
  });

  test("GET /robots.txt should return 200 with sitemap reference", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBe(true);
    const text = await response.text();
    expect(text).toContain("User-Agent");
    expect(text).toContain("sitemap");
    expect(text).toContain("aniverse-one-khaki.vercel.app");
  });

  test("GET /sitemap.xml should return 200 with public routes", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    const text = await response.text();
    expect(text).toContain("<urlset");
    expect(text).toContain("/blog");
    expect(text).toContain("/characters");
    // Auth-gated routes must NOT be listed (consistent with robots disallow)
    expect(text).not.toContain("/dashboard");
    expect(text).not.toContain("/login");
  });
});
