import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { BrandLockup } from "@/components/BrandLockup";

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
      'a[href], button:not([disabled])',
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

  return (
    <>
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-primary px-5 py-3 font-bold text-white shadow-lg focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-1" : "py-2"}`}>
        <div className="container mx-auto px-4 md:px-6">
          <nav className={`bg-card/95 backdrop-blur-md border border-border rounded-[2rem] flex items-center justify-between px-3 sm:px-4 lg:px-5 transition-all duration-300 ${isScrolled ? "py-0 shadow-md" : "py-1 shadow-sm"}`} aria-label="Primary navigation">
            <Link href="/" className="min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" aria-label="Gul Halal Food home">
              <BrandLockup variant="header" className="hidden sm:flex w-[300px]" />
              <BrandLockup variant="compact" className="sm:hidden" />
            </Link>

            <ul className="hidden xl:flex items-center gap-5 2xl:gap-7">
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return <li key={link.name}><Link href={link.href} onClick={() => scrollActiveLinkToTop(link.href)} className={`font-semibold text-sm transition-colors relative group block py-2 focus-visible:outline-none focus-visible:text-primary ${isActive ? "text-primary" : "text-foreground/80 hover:text-primary"}`}>
                  {link.name}<span className={`absolute bottom-1 left-0 h-0.5 bg-primary transition-all rounded-full ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </Link></li>;
              })}
            </ul>

            <div className="hidden xl:flex items-center gap-4">
              <Link href="/quote" className="inline-block"><Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-5 shadow-sm">Request a Quote</Button></Link>
            </div>

            <button
              ref={menuButtonRef}
              className="xl:hidden rounded-full p-2 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </header>

      {mobileMenuOpen && <div id="mobile-navigation" ref={mobileMenuRef} role="dialog" aria-modal="true" aria-label="Mobile navigation" onKeyDown={trapMobileMenuFocus} className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm xl:hidden pt-24 px-6 pb-6 flex flex-col h-[100dvh]">
        <ul className="flex flex-col gap-5 items-center justify-center flex-1">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return <li key={link.name}><Link href={link.href} className={`rounded-lg px-3 py-1 text-2xl font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`} onClick={() => { scrollActiveLinkToTop(link.href); closeMobileMenu(); }}>{link.name}</Link></li>;
          })}
        </ul>
        <div className="pb-8 flex justify-center"><Link href="/quote" onClick={closeMobileMenu} className="w-full max-w-sm"><Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 w-full text-lg py-6 shadow-md">Request a Quote</Button></Link></div>
      </div>}
    </>
  );
}
