-- CreateIndex
-- Artwork: user artwork list (WHERE creatorId = ? ORDER BY createdAt DESC)
CREATE INDEX "Artwork_creatorId_createdAt_idx" ON "Artwork"("creatorId", "createdAt");

-- CreateIndex
-- Artwork: public gallery filtered by creator (WHERE isPublic = true AND creatorId = ? ORDER BY createdAt DESC)
CREATE INDEX "Artwork_isPublic_creatorId_createdAt_idx" ON "Artwork"("isPublic", "creatorId", "createdAt");

-- CreateIndex
-- Character: public list sorted by name (WHERE isPublic = true ORDER BY name)
CREATE INDEX "Character_isPublic_name_idx" ON "Character"("isPublic", "name");

-- CreateIndex
-- Challenge: active list default sort (WHERE status = 'ACTIVE' ORDER BY endsAt ASC)
CREATE INDEX "Challenge_status_endsAt_idx" ON "Challenge"("status", "endsAt");

-- CreateIndex
-- Challenge: scope=all list default sort (ORDER BY endsAt ASC, no status filter)
CREATE INDEX "Challenge_endsAt_idx" ON "Challenge"("endsAt");

-- CreateIndex
-- User: filtered list by role (WHERE role = ? ORDER BY createdAt DESC)
CREATE INDEX "User_role_createdAt_idx" ON "User"("role", "createdAt");

-- CreateIndex
-- User: filtered list by premium tier (WHERE premiumTier = ? ORDER BY createdAt DESC)
CREATE INDEX "User_premiumTier_createdAt_idx" ON "User"("premiumTier", "createdAt");
