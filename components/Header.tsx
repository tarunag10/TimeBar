'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/coverage', label: 'Coverage' },
    { href: '/changelog', label: 'Changelog' },
  ];

  return (
    <header className="border-b border-slate-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-2 h-2 rounded-sm bg-blue-500 group-hover:bg-blue-400 transition-colors" />
          <span className="font-semibold text-[15px] text-slate-100 tracking-tight">
            TimeBar
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs transition-colors ${
                pathname === link.href
                  ? 'text-blue-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
