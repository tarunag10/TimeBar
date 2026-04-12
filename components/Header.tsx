'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, Sparkles } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/coverage', label: 'Coverage' },
    { href: '/changelog', label: 'Changelog' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#d5b06b]/20 bg-[#090d17]/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-15">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg border border-[#d5b06b]/35 bg-[#d5b06b]/12 flex items-center justify-center">
            <Scale className="w-4 h-4 text-[#e9cca0] group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#9fbff6]/70 border border-[#090d17] flex items-center justify-center">
              <Sparkles className="w-1.5 h-1.5 text-[#090d17]" />
            </div>
          </div>
          <div>
            <span className="block text-base leading-none font-semibold tracking-tight text-gradient-blue">
              TimeBar
            </span>
            <span className="block text-[10px] uppercase tracking-[2px] text-slate-500 mt-0.5">
              England & Wales
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-1.5 text-[13px] font-medium tracking-wide rounded-md transition-all duration-200 ${
                pathname === link.href
                  ? 'text-[#f2dcb5] bg-[#d5b06b]/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]'
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#d5b06b]/90 to-transparent" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
