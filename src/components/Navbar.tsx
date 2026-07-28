import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBasket } from "lucide-react";
import { Link, useLocation } from "wouter";
import { BrandLockup } from "@/components/BrandLockup";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Our Menu", href: "/menu" },
  { name: "Catering", href: "/catering" },
  { name: "About Us", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Testimonials", href: "/testimonials" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const wasMenuOpen = useRef(false);
  const { itemCount, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      wasMenuOpen.current = true;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.requestAnimationFrame(() => {
        mobileMenuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
      });
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener("keydown", handleEscape);
      };
    }
    if (wasMenuOpen.current) {
      menuButtonRef.current?.focus();
      wasMenuOpen.current = false;
    }
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const scrollActiveLinkToTop = (href: string) => {
    if (location === href) window.scrollTo({ top: 0, behavior: "auto" });
  };

  const trapMobileMenuFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])"
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // Scrolled: deep-green translucent glass. Top: warm translucent cream.
  const navScrolledClass =
    "bg-[#1b3a1b]/88 backdrop-blur-lg border border-green-800/40 shadow-[0_4px_24px_rgba(27,58,27,0.25)]";
  const navTopClass =
    "bg-[#fffaf0]/70 backdrop-blur-sm border border-[#e8dfc8]/60 shadow-sm";

  const linkScrolled = "text-white/90 hover:text-[#f97316]";
  const linkTop = "text-foreground/80 hover:text-primary";
  const linkActiveScrolled = "text-[#f97316]";
  const linkActiveTop = "text-primary";

  return (
    <>
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-primary px-5 py-3 font-bold text-white shadow-lg focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 motion-safe:transition-all motion-safe:duration-300 ${isScrolled ? "py-1" : "py-2"}`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <nav
            className={`rounded-[2rem] flex items-center justify-between px-3 sm:px-4 lg:px-5 motion-safe:transition-all motion-safe:duration-300 ${
              isScrolled
                ? `${navScrolledClass} py-0`
                : `${navTopClass} py-1`
            }`}
            aria-label="Primary navigation"
          >
            <Link
              href="/"
              className="min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Gul Halal Food home"
            >
              <BrandLockup variant="header" scrolled={isScrolled} className="hidden sm:flex w-[280px]" />
              <BrandLockup variant="compact" scrolled={isScrolled} className="sm:hidden" />
            </Link>

            <ul className="hidden xl:flex items-center gap-5 2xl:gap-7">
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => scrollActiveLinkToTop(link.href)}
                      className={`font-semibold text-sm motion-safe:transition-colors relative group block py-2 focus-visible:outline-none ${
                        isActive
                          ? isScrolled
                            ? linkActiveScrolled
                            : linkActiveTop
                          : isScrolled
                          ? linkScrolled
                          : linkTop
                      }`}
                    >
                      {link.name}
                      <span
                        className={`absolute bottom-1 left-0 h-0.5 rounded-full motion-safe:transition-all ${
                          isScrolled ? "bg-[#f97316]" : "bg-primary"
                        } ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden xl:flex items-center gap-3">
              {/* Cart button */}
              <button
                onClick={toggleCart}
                className={`relative p-2 rounded-full motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isScrolled
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-foreground/70 hover:text-primary hover:bg-muted"
                }`}
                aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? "s" : ""}` : ""}`}
              >
                <ShoppingBasket size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
                    {itemCount}
                  </span>
                )}
              </button>
              <Link href="/quote" className="inline-block">
                <Button
                  className={`rounded-full font-bold px-5 shadow-sm motion-safe:transition-colors ${
                    isScrolled
                      ? "bg-secondary text-white hover:bg-secondary/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  Request a Quote
                </Button>
              </Link>
            </div>

            {/* Mobile: cart + hamburger */}
            <div className="xl:hidden flex items-center gap-1">
              <button
                onClick={toggleCart}
                className={`relative p-2 rounded-full motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isScrolled
                    ? "text-white/80 hover:bg-white/10"
                    : "text-foreground hover:bg-muted"
                }`}
                aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? "s" : ""}` : ""}`}
              >
                <ShoppingBasket size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                ref={menuButtonRef}
                className={`rounded-full p-2 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isScrolled
                    ? "text-white/80 hover:bg-white/10"
                    : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={
                  mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
                }
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          onKeyDown={trapMobileMenuFocus}
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm xl:hidden pt-24 px-6 pb-6 flex flex-col h-[100dvh]"
        >
          <ul className="flex flex-col gap-5 items-center justify-center flex-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`rounded-lg px-3 py-1 text-2xl font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                    onClick={() => {
                      scrollActiveLinkToTop(link.href);
                      closeMobileMenu();
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="pb-8 flex justify-center">
            <Link
              href="/quote"
              onClick={closeMobileMenu}
              className="w-full max-w-sm"
            >
              <Button
                size="lg"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 w-full text-lg py-6 shadow-md"
              >
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
