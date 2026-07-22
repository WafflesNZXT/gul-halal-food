import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";

const logoImg = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/brand/gul-logo-navbar.webp`;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Our Menu", href: "/menu" },
    { name: "Catering", href: "/catering" },
    { name: "About Us", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Testimonials", href: "/testimonials" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <nav
            className={`bg-card/95 backdrop-blur-md border border-border rounded-full flex items-center justify-between px-6 transition-all duration-300 ${
              isScrolled ? "py-2 shadow-md" : "py-3 shadow-sm"
            }`}
          >
            <Link href="/" className="flex items-center gap-2 z-50">
              <img src={logoImg} alt="Gul Halal Food Logo" className="h-10 w-auto md:h-12 object-contain" />
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`font-semibold text-sm transition-colors relative group block py-2 ${
                        isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                      }`}
                    >
                      {link.name}
                      <span 
                        className={`absolute bottom-1 left-0 h-0.5 bg-primary transition-all rounded-full ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      ></span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden lg:flex items-center gap-4">
              <Link href="/quote" className="inline-block">
                <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 shadow-sm">
                  Request a Quote
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-foreground p-2 z-50 relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm lg:hidden pt-24 px-6 pb-6 flex flex-col h-[100dvh]">
          <ul className="flex flex-col gap-6 items-center justify-center flex-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-2xl font-display ${
                      isActive ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="pb-8 flex justify-center">
            <Link href="/quote" onClick={() => setMobileMenuOpen(false)} className="w-full max-w-sm">
              <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 w-full text-lg py-6 shadow-md">
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
