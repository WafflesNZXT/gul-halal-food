import React from "react";
import logoImg from "@assets/image_1784700099561.png";
import { config } from "@/data/config";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[#174A2B] text-[#DDE8C8] relative overflow-hidden">
      {/* Decorative background SVG */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M60,20 C60,40 40,60 20,60 C40,60 60,80 60,100 C60,80 80,60 100,60 C80,60 60,40 60,20 Z" fill="currentColor" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="bg-white/90 p-4 rounded-2xl inline-block shadow-sm">
              <img src={logoImg} alt="Gul Halal Food Logo" className="h-16 w-auto object-contain" />
            </div>
            <p className="text-[#DDE8C8]/80 leading-relaxed pr-4">
              Authentic Pakistani halal catering for your most cherished moments. Bringing family recipes to your table since 1985.
            </p>
            <div className="flex gap-4">
              <a href={config.social.facebook} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors" aria-label="Facebook">
                <FaFacebookF size={20} className="text-white" />
              </a>
              <a href={config.social.instagram} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors" aria-label="Instagram">
                <FaInstagram size={20} className="text-white" />
              </a>
              <a href={config.social.twitter} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors" aria-label="Twitter">
                <FaTwitter size={20} className="text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-display text-2xl text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300">Home</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300">About Our Family</Link></li>
              <li><Link href="/menu" className="hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300">Featured Menu</Link></li>
              <li><Link href="/gallery" className="hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300">Event Gallery</Link></li>
              <li><Link href="/testimonials" className="hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300">Client Reviews</Link></li>
            </ul>
          </div>

          {/* Column 3: Catering Services */}
          <div>
            <h4 className="font-display text-2xl text-white mb-6">Catering</h4>
            <ul className="space-y-4">
              <li><Link href="/catering" className="hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300">Wedding Receptions</Link></li>
              <li><Link href="/catering" className="hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300">Family Gatherings</Link></li>
              <li><Link href="/catering" className="hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300">Corporate Events</Link></li>
              <li><Link href="/catering" className="hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300">Community Iftars</Link></li>
              <li><Link href="/quote" className="hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300 text-secondary font-bold">Request a Quote →</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-display text-2xl text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-secondary shrink-0 mt-1" />
                <span className="text-[#DDE8C8]/80">{config.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-secondary shrink-0" />
                <a href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`} className="text-[#DDE8C8]/80 hover:text-white transition-colors">{config.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-secondary shrink-0" />
                <a href={`mailto:${config.email}`} className="text-[#DDE8C8]/80 hover:text-white transition-colors">{config.email}</a>
              </li>
            </ul>

            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">100%</span>
              </div>
              <span className="font-bold text-white leading-tight">Proudly serving<br/>Halal food since {config.established}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#DDE8C8]/60">
          <p>&copy; {new Date().getFullYear()} {config.businessName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
