'use client';

import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { CalculationResult } from '@/types/rules';
import StatusBadge from './StatusBadge';
import Timeline from './Timeline';
import CopyButton from './CopyButton';

type Props = {
  result: CalculationResult;
  claimType: string;
  accrualDate: string;
};

const statusGradients = {
  live: 'from-green-950/40 to-slate-950',
  expires_today: 'from-amber-950/40 to-slate-950',
  expired: 'from-red-950/40 to-slate-950',
  manual_review: 'from-blue-950/40 to-slate-950',
};

const statusBorders = {
  live: 'border-green-500/15',
  expires_today: 'border-amber-500/15',
  expired: 'border-red-500/15',
  manual_review: 'border-blue-500/15',
};

const dateColors = {
  live: 'text-green-400',
  expires_today: 'text-amber-400',
  expired: 'text-red-400',
  manual_review: 'text-blue-400',
};

function formatDisplayDate(isoDate: string): string {
  return format(parseISO(isoDate), 'd MMMM yyyy');
}

export default function ResultCard({ result, claimType, accrualDate }: Props) {
  const gradient = statusGradients[result.status];
  const border = statusBorders[result.status];
  const dateColor = dateColors[result.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`bg-gradient-to-br ${gradient} border ${border} rounded-xl p-4 sm:p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {result.status === 'manual_review' ? (
            <>
              <div className="text-[10px] uppercase tracking-wider text-blue-400 mb-2">
                Manual Review Required
              </div>
              <div className="space-y-1.5">
                {result.warnings.map((w, i) => (
                  <p key={i} className="text-[12px] text-slate-400 leading-relaxed">
                    {w}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={`text-[10px] uppercase tracking-wider ${dateColor} mb-1`}>
                {result.status === 'live' && `Live — ${result.daysRemaining} days remaining`}
                {result.status === 'expires_today' && 'Expires today'}
                {result.status === 'expired' && `Expired — ${Math.abs(result.daysRemaining || 0)} days overdue`}
              </div>

              {/* Primary expiry */}
              {result.primaryExpiryDate && (
                <div className={`text-2xl sm:text-[28px] font-bold ${dateColor} leading-tight`}>
                  {formatDisplayDate(result.adjustedExpiryDate || result.primaryExpiryDate)}
                </div>
              )}

              {/* Base vs adjusted */}
              <div className="text-[11px] text-slate-500 mt-1">
                {result.adjustedExpiryDate ? (
                  <>
                    Base: {formatDisplayDate(result.primaryExpiryDate!)} · Adjusted by:{' '}
                    {result.appliedModifiers.join(', ')}
                  </>
                ) : (
                  <>Base: {result.primaryExpiryDate && formatDisplayDate(result.primaryExpiryDate)} · No modifiers</>
                )}
              </div>
            </>
          )}
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          <StatusBadge status={result.status} />
          <CopyButton result={result} claimType={claimType} />
        </div>
      </div>

      {/* Timeline — only for calculable results */}
      {result.status !== 'manual_review' && result.primaryExpiryDate && accrualDate && (
        <Timeline
          accrualDate={accrualDate}
          expiryDate={result.primaryExpiryDate}
          adjustedExpiryDate={result.adjustedExpiryDate}
        />
      )}
    </motion.div>
  );
}
