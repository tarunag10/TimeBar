'use client';

import { motion } from 'framer-motion';
import { parseISO, format, differenceInCalendarDays } from 'date-fns';

type TimelineEvent = {
  date: Date;
  label: string;
  color: string;
};

type Props = {
  accrualDate: string;
  expiryDate: string;
  adjustedExpiryDate?: string;
  modifierDates?: { date: string; label: string }[];
};

export default function Timeline({ accrualDate, expiryDate, adjustedExpiryDate, modifierDates }: Props) {
  const accrual = parseISO(accrualDate);
  const expiry = parseISO(adjustedExpiryDate || expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = differenceInCalendarDays(expiry, accrual);
  if (totalDays <= 0) return null;

  const todayDays = differenceInCalendarDays(today, accrual);
  const todayPercent = Math.max(0, Math.min(100, (todayDays / totalDays) * 100));

  const isExpired = today > expiry;
  const gradientColor = isExpired ? '#ef4444' : '#22c55e';

  // Build modifier dots
  const modDots: { percent: number; label: string }[] = [];
  if (modifierDates) {
    for (const md of modifierDates) {
      const d = parseISO(md.date);
      const days = differenceInCalendarDays(d, accrual);
      const pct = Math.max(0, Math.min(100, (days / totalDays) * 100));
      modDots.push({ percent: pct, label: md.label });
    }
  }

  return (
    <div className="mt-4">
      <div className="relative h-6">
        {/* Track */}
        <div className="absolute top-[10px] left-0 right-0 h-[2px] bg-slate-800 rounded-full" />

        {/* Progress */}
        <motion.div
          className="absolute top-[10px] left-0 h-[2px] rounded-full"
          style={{
            background: `linear-gradient(90deg, #3b82f6, ${gradientColor})`,
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(todayPercent, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Accrual dot */}
        <div className="absolute top-[5px] left-0 w-3 h-3 rounded-full bg-blue-500 ring-2 ring-slate-950" />

        {/* Modifier dots */}
        {modDots.map((dot, i) => (
          <div
            key={i}
            className="absolute top-[6px] w-2.5 h-2.5 rounded-full bg-purple-400 ring-2 ring-slate-950"
            style={{ left: `${dot.percent}%` }}
            title={dot.label}
          />
        ))}

        {/* Today dot */}
        <motion.div
          className="absolute top-[5px] w-3 h-3 rounded-full bg-amber-500 ring-2 ring-slate-950"
          initial={{ left: '0%' }}
          animate={{ left: `${Math.min(todayPercent, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Expiry dot */}
        <div
          className={`absolute top-[5px] right-0 w-3 h-3 rounded-full ring-2 ring-slate-950 ${
            isExpired ? 'bg-red-500' : 'bg-green-500'
          }`}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-[9px] text-slate-500 mt-1">
        <span>{format(accrual, 'd MMM yyyy')}</span>
        <span>Today</span>
        <span>{format(expiry, 'd MMM yyyy')}</span>
      </div>
    </div>
  );
}
