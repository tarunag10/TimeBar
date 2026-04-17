'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Scale, Sparkles, Sun, Moon } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard next-themes hydration guard
  useEffect(() => { setMounted(true); }, []);

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/coverage', label: 'Coverage' },
    { href: '/changelog', label: 'Changelog' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-15">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-lg border border-[var(--accent)]/35 bg-[var(--accent-soft)] flex items-center justify-center">
            <Scale className="w-4 h-4 text-[var(--accent-icon)] group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--accent-blue)]/70 border border-[var(--ring-bg)] flex items-center justify-center">
              <Sparkles className="w-1.5 h-1.5 text-[var(--ring-bg)]" />
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
        <nav aria-label="Main navigation" className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-slate-400 hover:text-[var(--accent-icon)] hover:bg-[var(--surface-hover)] transition-all duration-200 cursor-pointer"
            aria-label={mounted ? (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle theme'}
          >
            {mounted ? (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />) : <Sun className="w-4 h-4" />}
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-1.5 text-[13px] font-medium tracking-wide rounded-md transition-all duration-200 ${
                pathname === link.href
                  ? 'text-[var(--accent-text)] bg-[var(--accent-soft)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[var(--surface-hover)]'
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/90 to-transparent" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
