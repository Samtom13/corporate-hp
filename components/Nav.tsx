"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

/**
 * Rendered by components/SiteNav.tsx, which hides Journal until an article is live.
 *
 * The header is transparent with white text until the visitor scrolls, which only
 * works over a dark hero (the homepage and tour pages). Pages that open on a light
 * background must pass `solid`, or the logo and the links are white on white and
 * nothing is visible until the page is scrolled.
 */
export default function Nav({
  showJournal = false,
  solid = false,
}: {
  showJournal?: boolean;
  solid?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /** Opaque bar with dark text: always on a light page, after scrolling elsewhere. */
  const onLight = solid || scrolled;

  // `external: true` renders a plain <a>: /photo is rewritten to the separate
  // photography deployment, which the client-side router cannot navigate to.
  const links = [
    { label: "Experiences", href: "/#experiences" },
    { label: "Photo", href: "/photo", external: true },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "About", href: "/#about" },
    ...(showJournal ? [{ label: "Journal", href: "/blog" }] : []),
    { label: "FAQ", href: "/faq" },
  ];

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        onLight ? "bg-white/95 backdrop-blur-sm border-b border-stone-100 py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`font-bold text-2xl transition-colors duration-300 ${
            onLight ? "text-[#1A1A1A]" : "text-white"
          }`}
          style={{ fontFamily: "Arial Black, Arial, sans-serif", letterSpacing: "-0.06em" }}
        >
          Bond
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {links.map((link) => {
            const className = `text-xs tracking-widest uppercase transition-colors duration-300 ${
              onLight ? "text-stone-500 hover:text-[#016812]" : "text-white/80 hover:text-white"
            }`;
            return link.external ? (
              <a key={link.label} href={link.href} className={className}>
                {link.label}
              </a>
            ) : (
              <Link key={link.label} href={link.href} className={className}>
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/booking"
            className={`text-xs tracking-widest uppercase px-6 py-3 border transition-all duration-300 ${
              onLight
                ? "border-[#016812] text-[#016812] hover:bg-[#016812] hover:text-white"
                : "border-white text-white hover:bg-white hover:text-[#1A1A1A]"
            }`}
          >
            Request Experience
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`lg:hidden flex flex-col gap-1.5 ${onLight ? "text-[#1A1A1A]" : "text-white"}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-100 px-6 py-8 flex flex-col gap-6">
          {links.map((link) => {
            const className =
              "text-xs tracking-widest uppercase text-stone-500 hover:text-[#016812]";
            return link.external ? (
              <a
                key={link.label}
                href={link.href}
                className={className}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={className}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/booking"
            className="text-xs tracking-widest uppercase px-6 py-3 border border-[#016812] text-center text-[#016812] hover:bg-[#016812] hover:text-white transition-all"
            onClick={() => setMenuOpen(false)}
          >
            Request Experience
          </Link>
        </div>
      )}
    </header>
  );
}
