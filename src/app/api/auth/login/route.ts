import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { findUserWithCredentials } from "@/lib/services/auth.service";
import { applyRateLimit, authLimiter } from "@/lib/rate-limiter";
import {
  collectValidationErrors,
  validateEmail,
  validateRequiredString,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const rateCheck = applyRateLimit(request, "login", authLimiter);
    if (rateCheck) return rateCheck;

    const body = await request.json();
    const { email, password } = body;

    // ── Validation ──────────────────────────────────────────────
    const errors = collectValidationErrors([
      ["email", validateEmail(email)],
      ["password", validateRequiredString(password, "Password")],
    ]);

    if (errors) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── Find user ───────────────────────────────────────────────
    const user = await findUserWithCredentials(normalizedEmail);

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

    // Auth responses carry credentials — never allow caching.
    return NextResponse.json(
      {
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
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { errors: { _form: "An unexpected error occurred. Please try again." } },
      { status: 500 },
    );
  }
}
