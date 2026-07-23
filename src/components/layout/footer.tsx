import Link from "next/link";
import { Sparkles, Code2, AtSign, Heart } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-base font-bold text-white">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Where AI meets anime art. Generate, share, and discover stunning
              anime artwork powered by cutting-edge AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
              Product
            </h3>
            <ul className="space-y-2">
              {["Features", "Pricing", "Gallery", "API"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              {["Documentation", "Tutorials", "Community", "Blog"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              {["Privacy", "Terms", "License", "Guidelines"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-zinc-800/60 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-zinc-600">
            &copy; {year} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <Code2 className="h-4 w-4" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <AtSign className="h-4 w-4" />
            </Link>
            <span className="flex items-center gap-1 text-xs text-zinc-600">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by
              AniVerse Team
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
