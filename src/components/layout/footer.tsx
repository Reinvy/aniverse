import Link from "next/link";
import { Sparkles, Code2, AtSign, Heart } from "lucide-react";
import {
  APP_NAME,
  FOOTER_PRODUCT_LINKS,
  FOOTER_RESOURCE_LINKS,
  FOOTER_APP_LINKS,
} from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stroke-white bg-eclipse">
      {/* Angled bar accent */}
      <div className="angled-bar" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(243,198,105,0.3)] to-[rgba(243,198,105,0.1)] border border-stroke-gold">
                <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              </div>
              <span className="text-base font-bold text-white group-hover:text-gold-300 transition-colors">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Where AI meets anime art. Generate, share, and discover stunning
              anime artwork powered by cutting-edge AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="sys-label mb-3">PRODUCT // NODE</h3>
            <ul className="space-y-2">
              {FOOTER_PRODUCT_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/40 hover:text-gold-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="sys-label mb-3">RESOURCES // NODE</h3>
            <ul className="space-y-2">
              {FOOTER_RESOURCE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/40 hover:text-gold-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App */}
          <div>
            <h3 className="sys-label mb-3">APP // DASHBOARD</h3>
            <ul className="space-y-2">
              {FOOTER_APP_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/40 hover:text-gold-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-stroke-white pt-8 sm:flex-row sm:justify-between">
          <p className="sys-label">
            &copy; {year} {APP_NAME}{" //"} ALL RIGHTS RESERVED
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-gold-400 transition-colors"
            >
              <Code2 className="h-4 w-4" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-gold-400 transition-colors"
            >
              <AtSign className="h-4 w-4" />
            </Link>
            <span className="flex items-center gap-1 sys-label">
              MADE WITH <Heart className="h-3 w-3 text-gold-400" /> BY ANIVERSE TEAM
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
