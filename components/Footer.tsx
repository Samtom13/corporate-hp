import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#016812] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <p
              className="font-bold text-3xl mb-4"
              style={{ fontFamily: "Arial Black, Arial, sans-serif", letterSpacing: "-0.06em" }}
            >
              Bond
            </p>
            <p className="text-white/60 text-sm leading-relaxed font-light">
              Private tour experiences in Kyoto.<br />
              Curated. Personal. Unforgettable.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs tracking-widest uppercase text-white/40 mb-6">Explore</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Experiences", href: "/#experiences" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "About Bond", href: "/#about" },
                { label: "FAQ", href: "/faq" },
                { label: "Request Experience", href: "/booking" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white/60 text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs tracking-widest uppercase text-white/40 mb-6">Contact</p>
            <div className="flex flex-col gap-3 text-sm text-white/60">
              <a href="mailto:info@go-bond.jp" className="hover:text-white transition-colors">
                info@go-bond.jp
              </a>
              <p className="font-light">Kyoto, Japan</p>
              <div className="flex gap-4 mt-2">
                <a
                  href="https://www.instagram.com/bond_kyoto?igsh=NjEybnF3bm4wNndr&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-xs tracking-widest uppercase"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/share/1cDJrQZPuF/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-xs tracking-widest uppercase"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Bond. All rights reserved.
          </p>
          <p className="text-white/30 text-xs tracking-wide">
            Operated by 株式会社Bond — Kyoto, Japan · Since 2019
          </p>
        </div>
      </div>
    </footer>
  );
}
