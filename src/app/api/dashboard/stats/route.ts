import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractBearerToken, verifyToken } from "@/lib/auth";
import { TIERS } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractBearerToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const userId = payload.userId;

    // Fetch user with aggregated data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        premiumTier: true,
        coinBalance: true,
        _count: {
          select: {
            artworks: true,
            likes: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ── Calculate generation stats ─────────────────────────────
    const tier = user.premiumTier as keyof typeof TIERS;
    const tierConfig = TIERS[tier] || TIERS.FREE;
    const generationLimit =
      tierConfig.credits === "Unlimited" ? Infinity : Number(tierConfig.credits) || 10;

    // Count artworks created this month (generations used)
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const generationsThisMonth = await prisma.artwork.count({
      where: {
        creatorId: userId,
        createdAt: { gte: firstOfMonth },
      },
    });

    const generationsUsed = generationsThisMonth;
    const generationsLeft = Math.max(0, generationLimit - generationsUsed);
    const usagePercent =
      generationLimit === Infinity
        ? 0
        : Math.min(100, Math.round((generationsUsed / generationLimit) * 100));

    // ── Earnings from transactions ──────────────────────────────
    const earningsAgg = await prisma.transaction.aggregate({
      where: {
        userId,
        status: "COMPLETED",
        type: { in: ["PURCHASE", "DEPOSIT", "COMMISSION"] },
      },
      _sum: { amount: true },
    });
    const totalEarnings = Number(earningsAgg._sum.amount ?? 0);

    // ── Like count (likes received on user's artworks) ──────────
    const userArtworks = await prisma.artwork.findMany({
      where: { creatorId: userId },
      select: { id: true },
    });
    const artworkIds = userArtworks.map((a) => a.id);
    const likesReceived =
      artworkIds.length > 0
        ? await prisma.like.count({
            where: {
              targetType: "Artwork",
              targetId: { in: artworkIds },
            },
          })
        : 0;

    // ── Recent activity (mixed: artworks, likes, comments) ────
    const recentArtworks = await prisma.artwork.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
        style: true,
        isPublic: true,
      },
    });

    const recentLikes = await prisma.like.findMany({
      where: {
        targetType: "Artwork",
        targetId: { in: artworkIds.length > 0 ? artworkIds : ["__none__"] },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        createdAt: true,
        user: { select: { name: true } },
        targetId: true,
      },
    });

    const recentComments = await prisma.comment.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        content: true,
        createdAt: true,
        targetType: true,
      },
    });

    // ── Build activity feed ─────────────────────────────────────
    const activityFeed: Array<{
      type: string;
      action: string;
      detail: string;
      time: string;
    }> = [];

    for (const art of recentArtworks) {
      activityFeed.push({
        type: "create",
        action: "Created artwork",
        detail: art.title,
        time: art.createdAt.toISOString(),
      });
    }

    for (const like of recentLikes) {
      activityFeed.push({
        type: "like",
        action: "Liked your artwork",
        detail: `by ${like.user?.name ?? "someone"}`,
        time: like.createdAt.toISOString(),
      });
    }

    for (const comment of recentComments) {
      activityFeed.push({
        type: "comment",
        action: `Commented on ${comment.targetType}`,
        detail:
          comment.content.length > 60
            ? comment.content.slice(0, 60) + "..."
            : comment.content,
        time: comment.createdAt.toISOString(),
      });
    }

    // Sort by time descending
    activityFeed.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    );

    // Calculate days until reset (end of month)
    const lastDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    );
    const daysUntilReset = Math.ceil(
      (lastDayOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    return NextResponse.json({
      stats: {
        generationsUsed,
        generationLimit:
          generationLimit === Infinity ? "Unlimited" : generationLimit,
        generationsLeft,
        usagePercent,
        totalArtworks: user._count.artworks,
        totalLikes: user._count.likes,
        likesReceived,
        totalFollowers: user._count.followers,
        totalFollowing: user._count.following,
        totalEarnings,
        coinBalance: user.coinBalance,
        daysUntilReset: generationLimit === Infinity ? 0 : daysUntilReset,
        tier: tier,
        isUnlimited: generationLimit === Infinity,
      },
      activity: activityFeed.slice(0, 10),
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      { status: 500 },
    );
  }
}
