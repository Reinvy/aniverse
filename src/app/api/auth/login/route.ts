import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // ── Validation ──────────────────────────────────────────────
    const errors: Record<string, string> = {};

    if (!email || typeof email !== "string" || !email.trim()) {
      errors.email = "Email is required";
    }
    if (!password || typeof password !== "string" || !password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── Find user ───────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        premiumTier: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { errors: { _form: "Invalid email or password" } },
        { status: 401 },
      );
    }

    // ── Verify password ─────────────────────────────────────────
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { errors: { _form: "Invalid email or password" } },
        { status: 401 },
      );
    }

    // ── Generate token ──────────────────────────────────────────
    const token = await signToken(user.id, user.email!);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        premiumTier: user.premiumTier,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { errors: { _form: "An unexpected error occurred. Please try again." } },
      { status: 500 },
    );
  }
}
