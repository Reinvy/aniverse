import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import {
  findExistingUserByEmail,
  createUser,
} from "@/lib/services/auth.service";
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
    const existingUser = await findExistingUserByEmail(normalizedEmail);

    if (existingUser) {
      return NextResponse.json(
        { errors: { email: "An account with this email already exists" } },
        { status: 409 },
      );
    }

    // ── Create user ─────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const user = await createUser({
      name: fullName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // ── Generate token ──────────────────────────────────────────
    const token = await signToken(user.id, user.email!);

    // Auth responses carry credentials — never allow caching.
    return NextResponse.json(
      {
        user,
        token,
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { errors: { _form: "An unexpected error occurred. Please try again." } },
      { status: 500 },
    );
  }
}
