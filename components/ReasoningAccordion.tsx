'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalculationResult } from '@/types/rules';

type Props = {
  result: CalculationResult;
};

export default function ReasoningAccordion({ result }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer
          hover:bg-slate-800/80 transition-colors"
      >
        <span className="text-[13px] font-medium text-slate-200">
          Reasoning &amp; Statute
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-500 text-xs"
        >
          &#9660;
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-4 pb-4 border-t border-slate-700/50">
              {/* Explanation steps */}
              <ol className="mt-3 space-y-2">
                {result.explanationSteps.map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-[12px] text-slate-400 leading-relaxed">
                    <span className="text-slate-600 font-mono text-[10px] mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              {/* Statute references */}
              {result.statuteRefs.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-700/50">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                    Statute Reference
                  </p>
                  {result.statuteRefs.map((ref, i) => (
                    <p key={i} className="text-[12px] text-slate-300">
                      {ref.act}, {ref.section} — {ref.label}
                    </p>
                  ))}
                </div>
              )}

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-700/50">
                  <p className="text-[10px] uppercase tracking-wider text-amber-500/80 mb-2">
                    Warnings
                  </p>
                  {result.warnings.map((warning, i) => (
                    <p key={i} className="text-[11px] text-amber-400/70 leading-relaxed mb-1.5">
                      {warning}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
