'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { parseISO, format, differenceInCalendarDays } from 'date-fns';
import { useTheme } from 'next-themes';

type Props = {
  accrualDate: string;
  expiryDate: string;
  adjustedExpiryDate?: string;
  modifierDates?: { date: string; label: string }[];
};

export default function Timeline({ accrualDate, expiryDate, adjustedExpiryDate }: Props) {
  // Hooks must be called before any early returns (rules of hooks)
  const { resolvedTheme } = useTheme();
  const [accentColor, setAccentColor] = useState('#d5b06b');
  useEffect(() => {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading CSS variable requires effect + state
    if (value) setAccentColor(value);
  }, [resolvedTheme]);

  const accrual = parseISO(accrualDate);
  const expiry = parseISO(adjustedExpiryDate || expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = differenceInCalendarDays(expiry, accrual);
  if (totalDays <= 0) return null;

  const todayDays = differenceInCalendarDays(today, accrual);
  const todayPercent = Math.max(0, Math.min(100, (todayDays / totalDays) * 100));

  const isExpired = today > expiry;
  const gradientEnd = isExpired ? '#fb7185' : '#34d399';

  return (
    <div className="mt-5 px-1 border border-white/[0.06] rounded-xl bg-[var(--overlay-subtle)] p-3">
      <div className="relative h-8">
        <div className="absolute top-[13px] left-0 right-0 h-[3px] bg-white/[0.04] rounded-full" />

        <motion.div
          className="absolute top-[13px] left-0 h-[3px] rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accentColor}, ${gradientEnd})`,
            boxShadow: `0 0 8px -1px ${gradientEnd}40`,
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(todayPercent, 100)}%` }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        <div className="absolute top-[9px] left-0 w-[10px] h-[10px] rounded-full bg-[var(--accent)] ring-[3px] ring-[var(--ring-bg)]" />

        <motion.div
          className="absolute top-[8px] w-[12px] h-[12px]"
          initial={{ left: '0%' }}
          animate={{ left: `${Math.min(todayPercent, 100)}%` }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ marginLeft: -6 }}
        >
          <span className="absolute inset-0 rounded-full bg-[var(--accent-blue)] animate-ping opacity-20" />
          <span className="relative block w-[12px] h-[12px] rounded-full bg-[var(--accent-blue)] ring-[3px] ring-[var(--ring-bg)]" />
        </motion.div>

        <div
          className={`absolute top-[9px] right-0 w-[10px] h-[10px] rounded-full ring-[3px] ring-[var(--ring-bg)] ${
            isExpired ? 'bg-rose-400' : 'bg-emerald-400'
          }`}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 px-0">
        <span>{format(accrual, 'd MMM yyyy')}</span>
        <span className="text-[var(--accent-blue)]">Today</span>
        <span>{format(expiry, 'd MMM yyyy')}</span>
      </div>
    </div>
  );
}
