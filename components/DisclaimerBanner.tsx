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
          className="disclaimer-banner relative z-40 overflow-hidden bg-[var(--accent)]/8"
          style={{ borderBottom: 'none', borderTop: '1px solid transparent', borderImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent) 1' }}
        >
          <div className="max-w-6xl mx-auto px-3.5 sm:px-8 py-2.5 sm:py-2 flex items-start sm:items-center gap-2.5">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-[var(--accent-text)] shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-[11px] text-[var(--accent-text)] leading-relaxed flex-1">
              This tool gives an informational estimate, not legal advice. Limitation analysis depends
              on case facts, disputed evidence, and judicial discretion. Always verify with a qualified
              legal professional.
            </p>
            <button
              onClick={() => {
                setVisible(false);
                try { localStorage.setItem(DISMISSED_KEY, 'true'); } catch { /* ignore */ }
              }}
              className="text-[var(--accent-text)]/70 hover:text-[var(--accent-text)] transition-colors cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
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
