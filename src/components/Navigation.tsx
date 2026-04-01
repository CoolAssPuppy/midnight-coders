"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  isDisabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Pre-Order", href: "#", isDisabled: true },
  { label: "Read Chapter 1", href: "/excerpt" },
  { label: "About Prashant", href: "/author" },
  { label: "Book Club Guide", href: "/book-club" },
  { label: "Press Kit", href: "/press-kit" },
];

export function Navigation(): React.ReactElement {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (): void => {
    setIsMobileOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: isScrolled
          ? "rgba(18, 18, 18, 0.85)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(8px)" : "none",
        borderBottom: isScrolled
          ? "1px solid rgba(255, 255, 255, 0.06)"
          : "1px solid transparent",
      }}
    >
      <div className="max-w-3xl mx-auto px-6 py-4">
        {/* Desktop nav */}
        <ul className="hidden md:flex items-center justify-center gap-8 list-none m-0 p-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="relative text-center">
              {item.isDisabled ? (
                <span
                  className="text-xs tracking-wider uppercase cursor-default"
                  style={{ color: "rgba(255, 255, 255, 0.25)" }}
                >
                  {item.label}
                  <span
                    className="block text-[9px] tracking-widest mt-0.5"
                    style={{ color: "rgba(255, 255, 255, 0.15)" }}
                  >
                    coming soon
                  </span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-xs tracking-wider uppercase transition-colors duration-200"
                  style={{
                    color:
                      pathname === item.href
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.45)",
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== item.href) {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== item.href) {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.45)";
                    }
                  }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <div className="md:hidden flex justify-end">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {isMobileOpen ? (
                <>
                  <path d="M5 5l10 10" />
                  <path d="M15 5l-10 10" />
                </>
              ) : (
                <>
                  <path d="M3 6h14" />
                  <path d="M3 10h14" />
                  <path d="M3 14h14" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {isMobileOpen && (
          <ul className="md:hidden mt-4 space-y-3 list-none m-0 p-0 pb-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.isDisabled ? (
                  <span
                    className="block text-xs tracking-wider uppercase"
                    style={{ color: "rgba(255, 255, 255, 0.25)" }}
                  >
                    {item.label}
                    <span
                      className="ml-2 text-[9px]"
                      style={{ color: "rgba(255, 255, 255, 0.15)" }}
                    >
                      coming soon
                    </span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className="block text-xs tracking-wider uppercase"
                    style={{
                      color:
                        pathname === item.href
                          ? "rgba(255, 255, 255, 0.9)"
                          : "rgba(255, 255, 255, 0.45)",
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
