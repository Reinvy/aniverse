import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { applyRateLimit, authLimiter } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "register", authLimiter);
    if (rateCheck) return rateCheck;

    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // ── Validation ──────────────────────────────────────────────
    const errors: Record<string, string> = {};

    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!lastName || typeof lastName !== "string" || !lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase())
    ) {
      errors.email = "Please enter a valid email address";
    }
    if (!password || typeof password !== "string") {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── Check for existing user ─────────────────────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { errors: { email: "An account with this email already exists" } },
        { status: 409 },
      );
    }

    // ── Create user ─────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const user = await prisma.user.create({
      data: {
        name: fullName,
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        premiumTier: true,
        createdAt: true,
      },
    });

    // ── Generate token ──────────────────────────────────────────
    const token = await signToken(user.id, user.email!);

    return NextResponse.json(
      {
        user,
        token,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { errors: { _form: "An unexpected error occurred. Please try again." } },
      { status: 500 },
    );
  }
}
