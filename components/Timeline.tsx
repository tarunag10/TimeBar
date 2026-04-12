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
    <div className="mt-5 px-1 border border-white/[0.06] rounded-xl bg-black/10 p-3">
      <div className="relative h-8">
        <div className="absolute top-[13px] left-0 right-0 h-[3px] bg-white/[0.04] rounded-full" />

        <motion.div
          className="absolute top-[13px] left-0 h-[3px] rounded-full"
          style={{
            background: `linear-gradient(90deg, #d5b06b, ${gradientEnd})`,
            boxShadow: `0 0 8px -1px ${gradientEnd}40`,
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(todayPercent, 100)}%` }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        <div className="absolute top-[9px] left-0 w-[10px] h-[10px] rounded-full bg-[#d5b06b] ring-[3px] ring-[#090d17]" />

        <motion.div
          className="absolute top-[8px] w-[12px] h-[12px]"
          initial={{ left: '0%' }}
          animate={{ left: `${Math.min(todayPercent, 100)}%` }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ marginLeft: -6 }}
        >
          <span className="absolute inset-0 rounded-full bg-[#9fbff6] animate-ping opacity-20" />
          <span className="relative block w-[12px] h-[12px] rounded-full bg-[#9fbff6] ring-[3px] ring-[#090d17]" />
        </motion.div>

        <div
          className={`absolute top-[9px] right-0 w-[10px] h-[10px] rounded-full ring-[3px] ring-[#090d17] ${
            isExpired ? 'bg-rose-400' : 'bg-emerald-400'
          }`}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 px-0">
        <span>{format(accrual, 'd MMM yyyy')}</span>
        <span className="text-[#9fbff6]">Today</span>
        <span>{format(expiry, 'd MMM yyyy')}</span>
      </div>
    </div>
  );
}
