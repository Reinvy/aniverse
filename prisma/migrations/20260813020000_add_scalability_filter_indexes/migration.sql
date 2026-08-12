-- CreateIndex
-- Artwork: public gallery filtered by style (WHERE isPublic = true AND style = ? ORDER BY createdAt DESC)
CREATE INDEX "Artwork_isPublic_style_createdAt_idx" ON "Artwork"("isPublic", "style", "createdAt");

-- CreateIndex
-- BlogArticle: published list sorted by title (WHERE isPublished = true ORDER BY title)
CREATE INDEX "BlogArticle_isPublished_title_idx" ON "BlogArticle"("isPublished", "title");
