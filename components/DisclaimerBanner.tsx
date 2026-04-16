'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const DISMISSED_KEY = 'timebar_disclaimer_dismissed';

function wasPreviouslyDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
}

export default function DisclaimerBanner() {
  const [visible, setVisible] = useState(() => !wasPreviouslyDismissed());

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="disclaimer-banner relative z-40 overflow-hidden border-b border-[#d5b06b]/20 bg-[#d5b06b]/8"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-2 flex items-center gap-2.5">
            <AlertTriangle className="w-3 h-3 text-[#f1d7ab] shrink-0" />
            <p className="text-[11px] text-[#f4e3c7] leading-relaxed flex-1">
              This tool gives an informational estimate, not legal advice. Limitation analysis depends
              on case facts, disputed evidence, and judicial discretion. Always verify with a qualified
              legal professional.
            </p>
            <button
              onClick={() => {
                setVisible(false);
                try { localStorage.setItem(DISMISSED_KEY, 'true'); } catch { /* ignore */ }
              }}
              className="text-[#f4e3c7]/70 hover:text-[#f4e3c7] transition-colors p-0.5 cursor-pointer"
              aria-label="Dismiss disclaimer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
