import { NextRequest } from "next/server";
import {
  requireAuthenticatedRequest,
  conditionalJsonResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import {
  updateArtwork,
  deleteArtwork,
  ARTWORK_STYLES,
} from "@/lib/services/artwork.service";
import { invalidateDashboardStats } from "@/lib/services/dashboard.service";
import { writeLimiter } from "@/lib/rate-limiter";
import {
  collectValidationErrors,
  validateRequiredString,
} from "@/lib/validation";
import type { ArtworkStyle } from "@/generated/prisma/client";

/**
 * PATCH /api/artworks/[id] — Update an artwork (ownership-scoped).
 *
 * Only the authenticated creator of the artwork can update it. Accepts a
 * partial payload: any of `title`, `prompt`, `style`, `isPublic` may be
 * provided; omitted fields are left unchanged. Returns 404 when the artwork
 * does not exist or belongs to a different user (never leaks existence).
 *
 * Body (all optional):
 *   { "title": "New title", "style": "CHIBI", "isPublic": false }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuthenticatedRequest(request, {
      rateLimitKey: "artworks-update",
      limiter: writeLimiter,
    });
    if (!auth.ok) return auth.response;

    const { id } = await params;
    const body = await request.json();
    const { title, prompt, style, isPublic } = body ?? {};

    // Validate provided fields only (partial update semantics).
    const errors = collectValidationErrors([
      [
        "title",
        title !== undefined
          ? validateRequiredString(title, "Title")
          : undefined,
      ],
    ]);
    if (errors) return validationErrorResponse(errors);

    // Style whitelist derived from the Prisma enum (single source of truth —
    // can never drift from the schema).
    const VALID_STYLES: ArtworkStyle[] = ARTWORK_STYLES;

    const data: {
      title?: string;
      prompt?: string | null;
      style?: ArtworkStyle;
      isPublic?: boolean;
    } = {};

    if (title !== undefined) data.title = title;
    if (prompt !== undefined) {
      data.prompt = typeof prompt === "string" ? prompt : null;
    }
    if (style !== undefined) {
      if (!VALID_STYLES.includes(style as ArtworkStyle)) {
        return validationErrorResponse({
          style: `Style must be one of: ${VALID_STYLES.join(", ")}`,
        });
      }
      data.style = style as ArtworkStyle;
    }
    if (isPublic !== undefined) {
      if (typeof isPublic !== "boolean") {
        return validationErrorResponse({
          isPublic: "isPublic must be a boolean",
        });
      }
      data.isPublic = isPublic;
    }

    if (Object.keys(data).length === 0) {
      return validationErrorResponse({
        _form: "No updatable fields provided",
      });
    }

    const artwork = await updateArtwork(id, auth.userId, data);
    if (!artwork) return notFoundResponse("Artwork not found");

    return conditionalJsonResponse(request, { artwork }, { status: 200 });
  } catch (error) {
    console.error("Update artwork error:", error);
    return errorResponse("Failed to update artwork", 500);
  }
}

/**
 * DELETE /api/artworks/[id] — Delete an artwork (ownership-scoped).
 *
 * Only the authenticated creator can delete. Referencing products have
 * `onDelete: SetNull` so they survive the artwork removal. Returns 404 when
 * the artwork does not exist or belongs to a different user.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuthenticatedRequest(request, {
      rateLimitKey: "artworks-delete",
      limiter: writeLimiter,
    });
    if (!auth.ok) return auth.response;

    const { id } = await params;
    const deleted = await deleteArtwork(id, auth.userId);
    if (!deleted) return notFoundResponse("Artwork not found");

    // Deletion changes dashboard counts (totalArtworks, likesReceived, ...).
    invalidateDashboardStats(auth.userId);

    return conditionalJsonResponse(request, { ok: true }, { status: 200 });
  } catch (error) {
    console.error("Delete artwork error:", error);
    return errorResponse("Failed to delete artwork", 500);
  }
}
