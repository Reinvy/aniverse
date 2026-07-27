import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractBearerToken, verifyToken } from "@/lib/auth";

/** POST /api/artworks — Save a new artwork after generation */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, prompt, style, imageUrl, width, height } = body;

    // ── Validation ──────────────────────────────────────────────
    const errors: Record<string, string> = {};

    if (!title || typeof title !== "string" || !title.trim()) {
      errors.title = "Title is required";
    }
    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
      errors.imageUrl = "Image URL is required";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // ── Create artwork ──────────────────────────────────────────
    const artwork = await prisma.artwork.create({
      data: {
        title: title.trim(),
        prompt: prompt?.trim() || null,
        style: style || "ANIME",
        imageUrl: imageUrl.trim(),
        width: width || null,
        height: height || null,
        creatorId: payload.userId,
      },
      select: {
        id: true,
        title: true,
        style: true,
        imageUrl: true,
        prompt: true,
        width: true,
        height: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ artwork }, { status: 201 });
  } catch (error) {
    console.error("Create artwork error:", error);
    return NextResponse.json(
      { error: "Failed to save artwork" },
      { status: 500 },
    );
  }
}

/** GET /api/artworks — List user's artworks */
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const skip = (page - 1) * limit;

    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where: { creatorId: payload.userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          style: true,
          imageUrl: true,
          prompt: true,
          width: true,
          height: true,
          isPublic: true,
          createdAt: true,
          _count: { select: { products: true } },
        },
      }),
      prisma.artwork.count({
        where: { creatorId: payload.userId },
      }),
    ]);

    return NextResponse.json({
      artworks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List artworks error:", error);
    return NextResponse.json(
      { error: "Failed to load artworks" },
      { status: 500 },
    );
  }
}
