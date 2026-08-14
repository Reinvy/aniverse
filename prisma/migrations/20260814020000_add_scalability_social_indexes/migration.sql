-- CreateIndex
-- Comment: comment threads sorted newest-first (WHERE targetType = ? AND targetId = ? ORDER BY createdAt DESC)
CREATE INDEX "Comment_targetType_targetId_createdAt_idx" ON "Comment"("targetType", "targetId", "createdAt");

-- CreateIndex
-- Comment: dashboard activity feed (WHERE authorId = ? ORDER BY createdAt DESC)
CREATE INDEX "Comment_authorId_createdAt_idx" ON "Comment"("authorId", "createdAt");

-- CreateIndex
-- Like: like lists sorted newest-first (WHERE targetType = ? AND targetId IN (...) ORDER BY createdAt DESC)
CREATE INDEX "Like_targetType_targetId_createdAt_idx" ON "Like"("targetType", "targetId", "createdAt");

-- CreateIndex
-- Order: user order history (WHERE buyerId = ? ORDER BY createdAt DESC)
CREATE INDEX "Order_buyerId_createdAt_idx" ON "Order"("buyerId", "createdAt");

-- CreateIndex
-- Order: admin status queue (WHERE status = ? ORDER BY createdAt DESC)
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- CreateIndex
-- Transaction: wallet history (WHERE userId = ? ORDER BY createdAt DESC)
CREATE INDEX "Transaction_userId_createdAt_idx" ON "Transaction"("userId", "createdAt");

-- CreateIndex
-- Transaction: per-type rollups (WHERE type = ? ORDER BY createdAt DESC)
CREATE INDEX "Transaction_type_createdAt_idx" ON "Transaction"("type", "createdAt");

-- CreateIndex
-- SocialMediaPost: scheduler due-queue (WHERE status = 'SCHEDULED' AND scheduledAt <= ? ORDER BY scheduledAt)
CREATE INDEX "SocialMediaPost_status_scheduledAt_idx" ON "SocialMediaPost"("status", "scheduledAt");

-- CreateIndex
-- ChallengeSubmission: per-challenge review queue (WHERE challengeId = ? AND status = ?)
CREATE INDEX "ChallengeSubmission_challengeId_status_idx" ON "ChallengeSubmission"("challengeId", "status");

-- CreateIndex
-- AnalyticsEvent: event time-series rollups (WHERE event = ? AND createdAt >= ?)
CREATE INDEX "AnalyticsEvent_event_createdAt_idx" ON "AnalyticsEvent"("event", "createdAt");

-- CreateIndex
-- AnalyticsEvent: category time-series rollups (WHERE category = ? AND createdAt >= ?)
CREATE INDEX "AnalyticsEvent_category_createdAt_idx" ON "AnalyticsEvent"("category", "createdAt");
