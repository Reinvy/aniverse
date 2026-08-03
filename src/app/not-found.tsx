import Link from "next/link";
import { Home, Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageBackground } from "@/components/ui/page-background";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: "404 — Node Not Found",
  description: "The requested AniVerse node could not be located.",
};

/**
 * Game-style 404 page — AniVerse Design System v2.
 * Uses the canonical background stack, glass panels, cut-corners,
 * corner brackets, HUD labels and real outbound links so the
 * "lost node" state is both on-theme and navigable.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative flex min-h-screen items-center justify-center pt-24 pb-16">
        <PageBackground starfieldOpacity={0.35} gridOpacity={0.12} />

        <div className="relative mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden glass rounded-[4px] cut-corner border-holo glow-ambient bg-noise">
            {/* Decorative brackets */}
            <div className="pointer-events-none absolute top-0 left-0 h-8 w-8 bracket-corner" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 bracket-corner-br" />
            {/* Ambient gold bleed */}
            <div className="pointer-events-none absolute inset-0 glow-ambient" />

            <div className="relative p-8 sm:p-12 text-center">
              {/* HUD error code */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="sys-label text-gold-300/90">[SYS.ERR] // 404</span>
                <span className="flex items-center gap-1.5 text-[10px] text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                  NODE NOT FOUND
                </span>
              </div>

              {/* Glitch-style code */}
              <div
                className="font-mono text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#F4D8A3] via-[#E5C587] to-[rgba(229,197,135,0.3)] drop-shadow-[0_0_25px_rgba(229,197,135,0.25)]"
                aria-label="Error 404"
              >
                404
              </div>

              {/* Diamond divider */}
              <div className="flex items-center justify-center gap-3 my-6">
                <span className="h-px w-16 bg-gradient-to-r from-transparent to-[rgba(229,197,135,0.4)]" />
                <span className="text-gold-400 text-xs">◆</span>
                <span className="h-px w-16 bg-gradient-to-l from-transparent to-[rgba(229,197,135,0.4)]" />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Signal lost — this coordinate does not exist
              </h1>
              <p className="text-sm text-white/50 leading-relaxed max-w-md mx-auto mb-8">
                The page you requested has drifted out of the AniVerse sector,
                was moved, or never existed. Return to a known node below to
                continue your journey.
              </p>

              {/* Action buttons — real navigation */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full gap-2 sm:w-auto">
                    <Home className="h-4 w-4" />
                    Return to Base
                  </Button>
                </Link>
                <Link href="/characters" className="w-full sm:w-auto">
                  <Button variant="default" className="w-full gap-2 sm:w-auto">
                    <Compass className="h-4 w-4" />
                    Explore Characters
                  </Button>
                </Link>
                <Link href="/blog" className="w-full sm:w-auto">
                  <Button variant="ghost" className="w-full gap-2 sm:w-auto">
                    <ArrowLeft className="h-4 w-4" />
                    Read the Blog
                  </Button>
                </Link>
              </div>

              {/* Footer strip */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-white/25">
                <Link href="/challenges" className="hover:text-gold-300 transition-colors">
                  CHALLENGES
                </Link>
                <span className="text-gold-400/40">◆</span>
                <Link href="/dashboard/gallery" className="hover:text-gold-300 transition-colors">
                  GALLERY
                </Link>
                <span className="text-gold-400/40">◆</span>
                <Link href="/dashboard/create" className="hover:text-gold-300 transition-colors">
                  CREATE
                </Link>
                <span className="text-gold-400/40">◆</span>
                <Link href="/" className="hover:text-gold-300 transition-colors">
                  {APP_NAME.toUpperCase()} {"//"} HOME
                </Link>
              </div>

              <span className="lang-label mt-6" data-en="SIGNAL LOST" data-ja="信号喪失" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
