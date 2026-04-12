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

const statusStyles = {
  live: {
    gradient: 'from-green-500/[0.08] via-green-500/[0.03] to-transparent',
    border: 'border-green-500/[0.12]',
    glow: 'glow-green',
    dateColor: 'text-green-400',
    accent: 'bg-green-500',
  },
  expires_today: {
    gradient: 'from-amber-500/[0.08] via-amber-500/[0.03] to-transparent',
    border: 'border-amber-500/[0.12]',
    glow: 'glow-amber',
    dateColor: 'text-amber-400',
    accent: 'bg-amber-500',
  },
  expired: {
    gradient: 'from-red-500/[0.08] via-red-500/[0.03] to-transparent',
    border: 'border-red-500/[0.12]',
    glow: 'glow-red',
    dateColor: 'text-red-400',
    accent: 'bg-red-500',
  },
  manual_review: {
    gradient: 'from-blue-500/[0.08] via-blue-500/[0.03] to-transparent',
    border: 'border-blue-500/[0.12]',
    glow: 'glow-blue',
    dateColor: 'text-blue-400',
    accent: 'bg-blue-500',
  },
};

function formatDisplayDate(isoDate: string): string {
  return format(parseISO(isoDate), 'd MMMM yyyy');
}

export default function ResultCard({ result, claimType, accrualDate }: Props) {
  const style = statusStyles[result.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative overflow-hidden rounded-2xl border ${style.border} ${style.glow}`}
    >
      {/* Accent line */}
      <div className={`absolute top-0 left-0 w-full h-px ${style.accent} opacity-30`} />

      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`} />
      <div className="absolute inset-0 glass" />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {result.status === 'manual_review' ? (
              <>
                <div className="text-[11px] uppercase tracking-wider text-blue-400/80 font-medium mb-3">
                  Manual Review Required
                </div>
                <div className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <p key={i} className="text-[13px] text-slate-400 leading-relaxed font-light">
                      {w}
                    </p>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className={`text-[11px] uppercase tracking-wider ${style.dateColor} font-medium opacity-80 mb-1`}>
                  {result.status === 'live' && `${result.daysRemaining} days remaining`}
                  {result.status === 'expires_today' && 'Expires today'}
                  {result.status === 'expired' && `${Math.abs(result.daysRemaining || 0)} days overdue`}
                </div>

                {result.primaryExpiryDate && (
                  <div className={`text-3xl sm:text-4xl font-bold ${style.dateColor} tracking-tight leading-none`}>
                    {formatDisplayDate(result.adjustedExpiryDate || result.primaryExpiryDate)}
                  </div>
                )}

                <div className="text-[11px] text-slate-500 font-light mt-2.5">
                  {result.adjustedExpiryDate ? (
                    <>
                      Base date: {formatDisplayDate(result.primaryExpiryDate!)} &middot; {result.appliedModifiers.join(', ')}
                    </>
                  ) : (
                    <>Base date: {result.primaryExpiryDate && formatDisplayDate(result.primaryExpiryDate)} &middot; No limitation modifiers applied</>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2.5">
            <StatusBadge status={result.status} />
            <CopyButton result={result} claimType={claimType} />
          </div>
        </div>

        {result.status !== 'manual_review' && result.primaryExpiryDate && accrualDate && (
          <Timeline
            accrualDate={accrualDate}
            expiryDate={result.primaryExpiryDate}
            adjustedExpiryDate={result.adjustedExpiryDate}
          />
        )}
      </div>
    </motion.div>
  );
}
