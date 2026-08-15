-- ============================================================
-- AniVerse — Search Acceleration: pg_trgm GIN Indexes
-- ============================================================
-- Accelerates the ILIKE '%term%' (contains + mode: insensitive)
-- search paths used by every list endpoint:
--   /api/gallery      → Artwork.title, Artwork.prompt
--   /api/characters   → Character.name, Character.personality
--   /api/blog         → BlogArticle.title, BlogArticle.excerpt
--   /api/users        → User.name, User.username, User.email
--   /api/marketplace  → Product.name, Product.description
--
-- B-tree indexes cannot serve substring matches, so without these
-- GIN (trigram) indexes every search query degrades to a sequential
-- scan of the table. gin_trgm_ops turns `ILIKE '%term%'` into an
-- index range lookup (O(log n)) for patterns of 3+ characters.
--
-- NOTE: Prisma's @@index only supports B-tree — trigram indexes
-- must be created as raw SQL. The schema.prisma documentation
-- comment references this migration.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Artwork: gallery search on title/prompt
CREATE INDEX "Artwork_title_trgm_idx" ON "Artwork" USING GIN ("title" gin_trgm_ops);
CREATE INDEX "Artwork_prompt_trgm_idx" ON "Artwork" USING GIN ("prompt" gin_trgm_ops);

-- Character: OC search on name/personality
CREATE INDEX "Character_name_trgm_idx" ON "Character" USING GIN ("name" gin_trgm_ops);
CREATE INDEX "Character_personality_trgm_idx" ON "Character" USING GIN ("personality" gin_trgm_ops);

-- BlogArticle: blog search on title/excerpt
CREATE INDEX "BlogArticle_title_trgm_idx" ON "BlogArticle" USING GIN ("title" gin_trgm_ops);
CREATE INDEX "BlogArticle_excerpt_trgm_idx" ON "BlogArticle" USING GIN ("excerpt" gin_trgm_ops);

-- User: user discovery search on name/username/email
CREATE INDEX "User_name_trgm_idx" ON "User" USING GIN ("name" gin_trgm_ops);
CREATE INDEX "User_username_trgm_idx" ON "User" USING GIN ("username" gin_trgm_ops);
CREATE INDEX "User_email_trgm_idx" ON "User" USING GIN ("email" gin_trgm_ops);

-- Product: marketplace search on name/description
CREATE INDEX "Product_name_trgm_idx" ON "Product" USING GIN ("name" gin_trgm_ops);
CREATE INDEX "Product_description_trgm_idx" ON "Product" USING GIN ("description" gin_trgm_ops);
