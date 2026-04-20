'use client';

import { motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';

type Props = {
  onRestore: () => void;
  onDismiss: () => void;
};

export default function DraftRecoveryBanner({ onRestore, onDismiss }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-3 px-5 py-4 rounded-2xl glass glass-card"
      role="alert"
    >
      <RotateCcw className="w-4 h-4 text-[var(--accent-text)] shrink-0" />
      <p className="text-[12px] text-[var(--accent-text)] flex-1 leading-relaxed">
        Resume your previous calculation?
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onRestore}
          className="btn-cta px-3 py-1.5 rounded-xl text-[11px] cursor-pointer min-h-[44px] flex items-center transition-all duration-200"
        >
          Restore
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Dismiss draft recovery"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
