'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function DisclaimerBanner() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative z-40 overflow-hidden border-b border-amber-500/[0.06] bg-amber-500/[0.03]"
        >
          <div className="max-w-2xl mx-auto px-5 sm:px-8 py-2 flex items-center gap-2.5">
            <AlertTriangle className="w-3 h-3 text-amber-500/60 shrink-0" />
            <p className="text-[11px] text-slate-500 leading-relaxed font-light flex-1">
              This tool is an informational aid, not legal advice. Limitation analysis depends on the
              facts. Always verify independently.
            </p>
            <button
              onClick={() => setVisible(false)}
              className="text-slate-600 hover:text-slate-400 transition-colors p-0.5 cursor-pointer"
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
