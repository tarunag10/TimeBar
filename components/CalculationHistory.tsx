'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Rule } from '@/types/rules';
import { getRule } from '@/lib/rules';
import { getHistory, removeHistoryEntry, clearHistory, HistoryEntry } from '@/lib/storage';

type Props = {
  onRestore: (claimType: Rule['claimType'], answers: Record<string, string | boolean | undefined>) => void;
};

const statusColors: Record<string, string> = {
  live: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  expires_today: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  expired: 'bg-red-500/15 text-red-300 border-red-500/30',
  manual_review: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
};

const statusLabels: Record<string, string> = {
  live: 'Live',
  expires_today: 'Today',
  expired: 'Expired',
  manual_review: 'Review',
};

export default function CalculationHistory({ onRestore }: Props) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  if (entries.length === 0) return null;

  function handleRemove(id: string) {
    removeHistoryEntry(id);
    setEntries(getHistory());
  }

  function handleClearAll() {
    clearHistory();
    setEntries([]);
  }

  function handleRestore(entry: HistoryEntry) {
    onRestore(entry.claimType as Rule['claimType'], entry.answers);
  }

  return (
    <section className="panel-shell p-5 sm:p-7">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#d5b06b]" />
          <h2 className="text-xs font-semibold uppercase tracking-[2px] text-slate-400">
            Recent Calculations
          </h2>
        </div>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {entries.map((entry) => {
            let title = entry.claimType;
            try {
              title = getRule(entry.claimType as Rule['claimType']).title;
            } catch { /* use raw claimType */ }

            return (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]
                  hover:bg-white/[0.04] hover:border-[#d5b06b]/20 transition-all duration-200 group cursor-pointer"
                onClick={() => handleRestore(entry)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] text-slate-200 font-medium truncate">{title}</span>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase border ${statusColors[entry.status] || ''}`}>
                      {statusLabels[entry.status] || entry.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    {entry.expiryDate && <span>Expiry: {entry.expiryDate}</span>}
                    <span>{formatDistanceToNow(entry.timestamp, { addSuffix: true })}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(entry.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400
                    transition-all duration-200 p-1 cursor-pointer"
                  aria-label="Remove entry"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
