'use client';

import { motion } from 'framer-motion';
import { Rule } from '@/types/rules';
import { claimTypes } from '@/lib/rules';

type Props = {
  onSelect: (claimType: Rule['claimType']) => void;
};

export default function ClaimSelector({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="mb-6">
        <p className="text-[10px] tracking-[2px] uppercase text-slate-500 mb-1.5">
          England &amp; Wales
        </p>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-100">
          Limitation Calculator
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {claimTypes.map((claim, i) => (
          <motion.button
            key={claim.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            onClick={() => onSelect(claim.key)}
            className="group text-left bg-slate-800 border border-slate-700 rounded-lg p-3 sm:p-3.5
              hover:bg-slate-800/80 hover:border-blue-500/30
              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40
              transition-all duration-200 cursor-pointer"
          >
            <div className="text-[13px] font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
              {claim.title}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {claim.shortDesc}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
