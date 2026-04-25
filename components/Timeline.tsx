'use client';

import { motion } from 'framer-motion';
import { parseISO, format, differenceInCalendarDays } from 'date-fns';

type Props = {
  accrualDate: string;
  expiryDate: string;
  adjustedExpiryDate?: string;
  modifierDates?: { date: string; label: string }[];
};

export default function Timeline({ accrualDate, expiryDate, adjustedExpiryDate }: Props) {
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
      <div className="relative h-10">
        <div className="absolute top-[10px] left-0 right-0 h-3 bg-white/[0.04] rounded-full" />

        <motion.div
          className="absolute top-[10px] left-0 h-3 rounded-full origin-left"
          style={{
            background: 'linear-gradient(90deg, #34d399, #fbbf24, #fb7185)',
            boxShadow: `0 0 10px -2px ${gradientEnd}50`,
            width: '100%',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: Math.min(todayPercent, 100) / 100 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        <div className="absolute top-[8px] left-0 w-[14px] h-[14px] rounded-full bg-[var(--accent)] ring-[3px] ring-[var(--ring-bg)]" />

        <motion.div
          className="absolute top-[7px] w-[16px] h-[16px]"
          initial={{ left: '0%' }}
          animate={{ left: `${Math.min(todayPercent, 100)}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ marginLeft: -8 }}
        >
          <span className="absolute inset-0 rounded-full bg-[var(--accent-blue)] animate-ping opacity-20" />
          <span
            className="relative block w-[16px] h-[16px] rounded-full bg-[var(--accent-blue)] ring-[3px] ring-[var(--ring-bg)]"
            style={{ boxShadow: '0 0 8px 2px rgba(159, 191, 246, 0.5)' }}
          />
        </motion.div>

        <div
          className={`absolute top-[8px] right-0 w-[14px] h-[14px] rounded-full ring-[3px] ring-[var(--ring-bg)] ${
            isExpired ? 'bg-rose-400' : 'bg-emerald-400'
          }`}
        />
      </div>

      <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-0">
        <div className="text-center">
          <span className="block text-[10px] uppercase tracking-wider text-slate-500">Accrual</span>
          <span>{format(accrual, 'd MMM yyyy')}</span>
        </div>
        <span className="text-[var(--accent-blue)] self-end">Today</span>
        <div className="text-center">
          <span className="block text-[10px] uppercase tracking-wider text-slate-500">Expiry</span>
          <span>{format(expiry, 'd MMM yyyy')}</span>
        </div>
      </div>
    </div>
  );
}
