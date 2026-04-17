'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Scale, AlertTriangle } from 'lucide-react';
import { CalculationResult } from '@/types/rules';

type Props = {
  result: CalculationResult;
};

export default function ReasoningAccordion({ result }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass rounded-xl overflow-hidden border border-[var(--accent)]/22">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left cursor-pointer
          hover:bg-[var(--surface-hover)] transition-colors duration-200"
      >
        <div className="flex items-center gap-2.5">
          <Scale className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-[13px] font-semibold text-slate-100">
            Reasoning &amp; Statute
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <ChevronDown className="w-4 h-4 text-slate-300" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="px-5 pb-5 border-t border-white/[0.06]">
              <ol className="mt-4 space-y-3">
                {result.explanationSteps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-[12px] leading-relaxed">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--accent-soft)] text-[var(--accent-text)] text-[10px] font-medium shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-200/90">{step}</span>
                  </li>
                ))}
              </ol>

              {result.statuteRefs.length > 0 && (
                <div className="mt-5 glass rounded-lg p-3.5 border border-[var(--accent)]/22">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-2">
                    Statute Reference
                  </p>
                  {result.statuteRefs.map((ref, i) => (
                    <p key={i} className="text-[12px] text-slate-100">
                      {ref.act}, {ref.section} — {ref.label}
                    </p>
                  ))}
                </div>
              )}

              {result.warnings.length > 0 && (
                <div className="mt-4 space-y-2">
                  {result.warnings.map((warning, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <AlertTriangle className="w-3 h-3 text-[var(--priority-high-text)] shrink-0 mt-0.5" />
                      <p className="text-[11px] text-[var(--priority-high-text)] leading-relaxed">
                        {warning}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {result.reviewChecklist.length > 0 && (
                <div className="mt-5 glass rounded-lg p-3.5 border border-[var(--accent-blue)]/22">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-2">
                    Review checklist
                  </p>
                  <ol className="space-y-1.5">
                    {result.reviewChecklist.map((item, i) => (
                      <li key={i} className="text-[12px] text-slate-100/90 leading-relaxed">
                        {i + 1}. {item}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
