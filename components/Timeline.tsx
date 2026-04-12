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
  const gradientEnd = isExpired ? '#ef4444' : '#22c55e';

  return (
    <div className="mt-5 px-1">
      <div className="relative h-8">
        {/* Track background */}
        <div className="absolute top-[13px] left-0 right-0 h-[3px] bg-white/[0.04] rounded-full" />

        {/* Progress fill */}
        <motion.div
          className="absolute top-[13px] left-0 h-[3px] rounded-full"
          style={{
            background: `linear-gradient(90deg, #3b82f6, ${gradientEnd})`,
            boxShadow: `0 0 8px -1px ${gradientEnd}40`,
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(todayPercent, 100)}%` }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Accrual dot */}
        <div className="absolute top-[9px] left-0 w-[10px] h-[10px] rounded-full bg-blue-500 ring-[3px] ring-[#050a18]" />

        {/* Today dot with pulse */}
        <motion.div
          className="absolute top-[8px] w-[12px] h-[12px]"
          initial={{ left: '0%' }}
          animate={{ left: `${Math.min(todayPercent, 100)}%` }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ marginLeft: -6 }}
        >
          <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-20" />
          <span className="relative block w-[12px] h-[12px] rounded-full bg-amber-400 ring-[3px] ring-[#050a18]" />
        </motion.div>

        {/* Expiry dot */}
        <div
          className={`absolute top-[9px] right-0 w-[10px] h-[10px] rounded-full ring-[3px] ring-[#050a18] ${
            isExpired ? 'bg-red-500' : 'bg-green-500'
          }`}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-[10px] text-slate-600 font-light mt-0.5 px-0">
        <span>{format(accrual, 'd MMM yyyy')}</span>
        <span className="text-amber-500/70">Today</span>
        <span>{format(expiry, 'd MMM yyyy')}</span>
      </div>
    </div>
  );
}
