'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { trackEvent } from '@/lib/storage';
import { copyToClipboard } from '@/lib/utils';
import { buildShareURL, type ShareState } from '@/lib/share';

type Props = {
  shareState: ShareState;
};

export default function ShareButton({ shareState }: Props) {
  const [shared, setShared] = useState(false);

  async function handleShare() {
    const url = buildShareURL(shareState);
    try {
      await copyToClipboard(url);
    } catch {
      // clipboard unavailable — silently ignore
    }
    setShared(true);
    trackEvent({ type: 'share_clicked', claimType: shareState.claimType });
    setTimeout(() => setShared(false), 2000);
  }

  return (
    <motion.button
      type="button"
      onClick={handleShare}
      whileTap={{ scale: 0.9 }}
      className="no-print flex items-center justify-center gap-1.5 text-[12px] sm:text-[11px] text-slate-500 hover:text-slate-300
  px-2.5 py-2 sm:py-1.5 rounded-xl transition-all duration-200 cursor-pointer border border-white/10 sm:border-transparent min-h-[44px] sm:min-h-0
  hover:border-white/10 hover:ring-1 hover:ring-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]
  active:scale-[0.98]"
      aria-label={shared ? 'Share link copied' : 'Copy share link'}
    >
      <AnimatePresence mode="wait">
        {shared ? (
          <motion.span
            key="check"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="text-green-400"
          >
            <Check className="w-3.5 h-3.5" />
          </motion.span>
        ) : (
          <motion.span
            key="share"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Share2 className="w-3.5 h-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="font-light">{shared ? 'Link copied' : 'Share'}</span>
    </motion.button>
  );
}
