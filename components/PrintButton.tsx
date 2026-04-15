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
      className="no-print flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300
        px-2.5 py-1.5 rounded-lg glass-hover transition-all duration-200 cursor-pointer border border-transparent hover:border-white/[0.06]"
    >
      <Printer className="w-3.5 h-3.5" />
      <span className="font-light">Print</span>
    </motion.button>
  );
}
