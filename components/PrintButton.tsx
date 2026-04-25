'use client';

import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';
import { trackEvent } from '@/lib/storage';

type Props = {
  claimType: string;
};

export default function PrintButton({ claimType }: Props) {
  function handlePrint() {
    trackEvent({ type: 'print_clicked', claimType });
    window.print();
  }

  return (
    <motion.button
      type="button"
      onClick={handlePrint}
      whileTap={{ scale: 0.9 }}
      className="no-print flex items-center justify-center gap-1.5 text-[12px] sm:text-[11px] text-slate-500 hover:text-slate-300
  px-2.5 py-2 sm:py-1.5 rounded-xl transition-all duration-200 cursor-pointer border border-white/10 sm:border-transparent min-h-[44px] sm:min-h-0
  hover:border-white/10 hover:ring-1 hover:ring-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]
  active:scale-[0.98]"
      aria-label="Print result"
    >
      <Printer className="w-3.5 h-3.5" />
      <span className="font-light">Print</span>
    </motion.button>
  );
}
