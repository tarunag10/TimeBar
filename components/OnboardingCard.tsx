'use client';

import { motion } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

type Props = {
  message: string;
  onDismiss: () => void;
};

export default function OnboardingCard({ message, onDismiss }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-start gap-2.5 px-5 py-4 rounded-2xl glass glass-card border border-[var(--accent-blue)]/20"
      role="note"
    >
      <Lightbulb className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
      <p className="text-[12px] text-slate-200 leading-relaxed flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Dismiss help tip"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
