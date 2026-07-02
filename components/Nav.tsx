"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-sm border-b border-stone-100 py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`font-bold text-2xl transition-colors duration-300 ${
            scrolled ? "text-[#1A1A1A]" : "text-white"
          }`}
          style={{ fontFamily: "Arial Black, Arial, sans-serif", letterSpacing: "-0.06em" }}
        >
          Bond
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { label: "Experiences", href: "/#experiences" },
            { label: "How It Works", href: "/#how-it-works" },
            { label: "About", href: "/#about" },
            { label: "FAQ", href: "/faq" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-xs tracking-widest uppercase transition-colors duration-300 ${
                scrolled ? "text-stone-500 hover:text-[#016812]" : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className={`text-xs tracking-widest uppercase px-6 py-3 border transition-all duration-300 ${
              scrolled
                ? "border-[#016812] text-[#016812] hover:bg-[#016812] hover:text-white"
                : "border-white text-white hover:bg-white hover:text-[#1A1A1A]"
            }`}
          >
            Request Experience
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden flex flex-col gap-1.5 ${scrolled ? "text-[#1A1A1A]" : "text-white"}`}
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
        <div className="md:hidden bg-white border-t border-stone-100 px-6 py-8 flex flex-col gap-6">
          {[
            { label: "Experiences", href: "/#experiences" },
            { label: "How It Works", href: "/#how-it-works" },
            { label: "About", href: "/#about" },
            { label: "FAQ", href: "/faq" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs tracking-widest uppercase text-stone-500 hover:text-[#016812]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
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
