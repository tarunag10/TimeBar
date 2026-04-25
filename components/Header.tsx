'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Scale, Sparkles, Sun, Moon, Menu, X, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard next-themes hydration guard
  useEffect(() => { setMounted(true); }, []);

  // Close mobile menu on route change
  useEffect(() => {
    queueMicrotask(() => setMobileMenuOpen(false));
  }, [pathname]);

  const handleShowHelp = useCallback(() => {
    try { localStorage.removeItem('timebar_onboarded'); } catch { /* ignore */ }
    window.location.reload();
  }, []);

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/coverage', label: 'Coverage' },
    { href: '/changelog', label: 'Changelog' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/70 backdrop-blur-[20px]" style={{ borderBottom: '1px solid transparent', borderImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), rgba(255,255,255,0.05), transparent) 1' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-14 sm:h-15">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group" aria-label="TimeBar home">
          <div className="relative w-8 h-8 rounded-lg border border-[var(--accent)]/35 bg-[var(--accent-soft)] flex items-center justify-center">
            <Scale className="w-4 h-4 text-[var(--accent-icon)] group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--accent-blue)]/70 border border-[var(--ring-bg)] flex items-center justify-center">
              <Sparkles className="w-1.5 h-1.5 text-[var(--ring-bg)]" />
            </div>
          </div>
          <div>
            <span className="block text-xl leading-none font-semibold tracking-tight text-gradient display-serif">
              TimeBar
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-[2px] text-slate-500 mt-0.5">
              England & Wales
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-1">
          <button
            type="button"
            onClick={handleShowHelp}
            className="p-2 rounded-lg text-slate-400 hover:text-[var(--accent-icon)] hover:bg-[var(--surface-hover)] transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Show onboarding help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full glass text-slate-400 hover:text-[var(--accent-icon)] transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mounted ? (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle theme'}
          >
            {mounted ? (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />) : <Sun className="w-4 h-4" />}
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-1.5 text-[13px] font-medium tracking-wide rounded-full transition-all duration-200 min-h-[44px] flex items-center ${
                pathname === link.href
                  ? 'text-[var(--accent-text)] glass border-[var(--accent)]/25 shadow-[0_0_12px_rgba(213,176,107,0.15)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[var(--surface-hover)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg text-slate-400 hover:text-[var(--accent-icon)] hover:bg-[var(--surface-hover)] transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="sm:hidden border-t border-[var(--border-default)] bg-[var(--bg-primary)]/95 backdrop-blur-xl"
        >
          <nav aria-label="Mobile navigation" className="max-w-6xl mx-auto px-4 py-3 space-y-1">
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0 * 0.05 }}>
              <button
                type="button"
                onClick={() => { handleShowHelp(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-slate-400 hover:text-slate-100 hover:bg-[var(--surface-hover)] rounded-lg transition-all duration-200 cursor-pointer min-h-[44px]"
              >
                <HelpCircle className="w-4 h-4" />
                Show help
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 * 0.05 }}>
              <button
                type="button"
                onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-slate-400 hover:text-slate-100 hover:bg-[var(--surface-hover)] rounded-lg transition-all duration-200 cursor-pointer min-h-[44px]"
              >
                {mounted && (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
                {mounted ? (theme === 'dark' ? 'Light mode' : 'Dark mode') : 'Toggle theme'}
              </button>
            </motion.div>
            {navLinks.map((link, index) => (
              <motion.div key={link.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (index + 2) * 0.05 }}>
                <Link
                  href={link.href}
                  className={`block px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all duration-200 min-h-[44px] leading-7 ${
                    pathname === link.href
                      ? 'text-[var(--accent-text)] bg-[var(--accent-soft)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
