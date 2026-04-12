'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Timer } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/coverage', label: 'Coverage' },
    { href: '/changelog', label: 'Changelog' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 flex items-center justify-between h-12">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Timer className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
            <div className="absolute inset-0 blur-md bg-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-gradient-blue">
            TimeBar
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-1.5 text-[13px] font-light tracking-wide rounded-md transition-all duration-200 ${
                pathname === link.href
                  ? 'text-blue-300 bg-white/[0.04]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
