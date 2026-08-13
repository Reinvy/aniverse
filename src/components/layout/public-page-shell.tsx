"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageBackground } from "@/components/ui/page-background";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export interface PublicPageShellProps {
  children: React.ReactNode;
  /**
   * ErrorBoundary message shown if the page section crashes.
   * All public pages render inside a game-style ErrorBoundary by default.
   */
  errorMessage?: string;
  /** Container max-width class (default: "max-w-7xl") */
  maxWidth?: string;
  /** Extra classes appended to the content container */
  containerClassName?: string;
  /** PageBackground starfield opacity (default: 0.4) */
  starfieldOpacity?: number;
  /** PageBackground grid opacity (default: 0.15) */
  gridOpacity?: number;
  /** Hide the floating ScrollToTop button (default: false) */
  hideScrollToTop?: boolean;
  /** Extra classes appended to the <main> element */
  mainClassName?: string;
}

/**
 * PublicPageShell — reusable public-page layout (AniVerse Design System v2).
 *
 * Encapsulates the canonical public sub-page chrome used by every
 * marketing/content page: fixed Header + <main id="main-content"> +
 * PageBackground stack + centered content container + game-style
 * ErrorBoundary + Footer + floating ScrollToTop button.
 *
 * Keeps the 5 public pages (blog, characters, challenges + detail pages)
 * consistent, accessible (skip-target main), and DRY — one place to
 * change page chrome instead of five copies.
 *
 * Usage:
 *   <PublicPageShell errorMessage="Failed to load section" maxWidth="max-w-5xl">
 *     ...page content...
 *   </PublicPageShell>
 */
export function PublicPageShell({
  children,
  errorMessage,
  maxWidth = "max-w-7xl",
  containerClassName,
  starfieldOpacity,
  gridOpacity,
  hideScrollToTop = false,
  mainClassName,
}: PublicPageShellProps) {
  return (
    <>
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className={cn("relative min-h-screen pt-24 pb-16", mainClassName)}
      >
        {/* Background layers — deep eclipse + starfield + tech grid + scanline */}
        <PageBackground starfieldOpacity={starfieldOpacity} gridOpacity={gridOpacity} />

        <div
          className={cn(
            "relative mx-auto px-4 sm:px-6 lg:px-8",
            maxWidth,
            containerClassName,
          )}
        >
          <ErrorBoundary compact message={errorMessage}>
            {children}
          </ErrorBoundary>
        </div>
      </main>

      <Footer />

      {!hideScrollToTop && <ScrollToTop />}
    </>
  );
}

export default PublicPageShell;
