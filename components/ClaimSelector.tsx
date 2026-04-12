'use client';

import { motion } from 'framer-motion';
import { FileText, Shield, Heart, MessageSquare, ArrowRight } from 'lucide-react';
import { Rule } from '@/types/rules';
import { claimTypes } from '@/lib/rules';

const claimIcons = {
  simple_contract: FileText,
  tort_non_pi: Shield,
  personal_injury: Heart,
  defamation: MessageSquare,
} as const;

type Props = {
  onSelect: (claimType: Rule['claimType']) => void;
};

export default function ClaimSelector({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <p className="text-[11px] tracking-[3px] uppercase text-slate-500 font-light mb-2">
          England &amp; Wales
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gradient">
          Limitation Calculator
        </h1>
        <p className="text-sm text-slate-500 font-light mt-2 leading-relaxed">
          Select a claim type to calculate the likely limitation expiry date.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {claimTypes.map((claim, i) => {
          const Icon = claimIcons[claim.key];
          return (
            <motion.button
              key={claim.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{
                scale: 1.02,
                transition: { type: 'spring', stiffness: 400, damping: 25 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(claim.key)}
              className="group relative text-left glass glass-hover rounded-xl p-4
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40
                cursor-pointer overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors duration-300" />
                  <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 transform group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
                <div className="text-[13px] font-medium text-slate-300 group-hover:text-slate-100 transition-colors duration-200">
                  {claim.title}
                </div>
                <div className="text-[11px] text-slate-600 font-light mt-0.5">
                  {claim.shortDesc}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
