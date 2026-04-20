'use client';

import { motion } from 'framer-motion';
import { CalendarPlus } from 'lucide-react';
import { CalculationResult } from '@/types/rules';
import { generateIcsContent, downloadIcsFile } from '@/lib/ics';
import { trackEvent } from '@/lib/storage';

type Props = {
  result: CalculationResult;
  claimType: string;
};

export default function CalendarExportButton({ result, claimType }: Props) {
  const hasDate = result.adjustedExpiryDate || result.primaryExpiryDate;
  if (!hasDate) return null;

  function handleExport() {
    const ics = generateIcsContent({ result, claimType });
    if (ics) {
      downloadIcsFile(ics, claimType);
      trackEvent({ type: 'ics_downloaded', claimType });
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleExport}
      whileTap={{ scale: 0.9 }}
      className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300
  px-2.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer border border-transparent
  hover:border-white/10 hover:ring-1 hover:ring-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]
  active:scale-[0.98]"
    >
      <CalendarPlus className="w-3.5 h-3.5" />
      <span className="font-light">Calendar</span>
    </motion.button>
  );
}
