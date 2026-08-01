import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { applyRateLimit, authLimiter } from "@/lib/rate-limiter";
import {
  collectValidationErrors,
  validateEmail,
  validatePassword,
  validateRequiredString,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "register", authLimiter);
    if (rateCheck) return rateCheck;

    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // ── Validation ──────────────────────────────────────────────
    const errors = collectValidationErrors([
      ["firstName", validateRequiredString(firstName, "First name")],
      ["lastName", validateRequiredString(lastName, "Last name")],
      ["email", validateEmail(email)],
      ["password", validatePassword(password)],
    ]);

    if (errors) {
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
