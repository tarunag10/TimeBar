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
    gradient: 'from-emerald-500/[0.12] via-emerald-500/[0.03] to-transparent',
    border: 'border-emerald-500/[0.25]',
    glow: 'glow-green',
    dateColor: 'text-emerald-300',
    accent: 'bg-emerald-400',
  },
  expires_today: {
    gradient: 'from-amber-500/[0.12] via-amber-500/[0.04] to-transparent',
    border: 'border-amber-500/[0.25]',
    glow: 'glow-amber',
    dateColor: 'text-amber-300',
    accent: 'bg-amber-400',
  },
  expired: {
    gradient: 'from-rose-500/[0.12] via-rose-500/[0.03] to-transparent',
    border: 'border-rose-500/[0.26]',
    glow: 'glow-red',
    dateColor: 'text-rose-300',
    accent: 'bg-rose-400',
  },
  manual_review: {
    gradient: 'from-[#d5b06b]/20 via-[#d5b06b]/5 to-transparent',
    border: 'border-[#d5b06b]/35',
    glow: 'glow-blue',
    dateColor: 'text-[#f2dcb5]',
    accent: 'bg-[#d5b06b]',
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
      <div className={`absolute top-0 left-0 w-full h-px ${style.accent} opacity-30`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`} />
      <div className="absolute inset-0 glass" />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {result.status === 'manual_review' ? (
              <>
                <div className="text-[11px] uppercase tracking-wider text-[#eecf9a] font-semibold mb-3">
                  Manual Review Required
                </div>
                <div className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <p key={i} className="text-[13px] text-slate-200/90 leading-relaxed">
                      {w}
                    </p>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className={`text-[11px] uppercase tracking-wider ${style.dateColor} font-semibold opacity-90 mb-1`}>
                  {result.status === 'live' && `${result.daysRemaining} days remaining`}
                  {result.status === 'expires_today' && 'Expires today'}
                  {result.status === 'expired' && `${Math.abs(result.daysRemaining || 0)} days overdue`}
                </div>

                {result.primaryExpiryDate && (
                  <div className={`text-3xl sm:text-4xl display-serif ${style.dateColor} tracking-tight leading-none`}>
                    {formatDisplayDate(result.adjustedExpiryDate || result.primaryExpiryDate)}
                  </div>
                )}

                <div className="text-[11px] text-slate-300/85 mt-2.5">
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

        <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[1.5px]">
            <span className="px-2 py-1 rounded-md bg-white/[0.05] text-slate-300">
              Urgency: {result.urgencyLevel}
            </span>
            <span className="px-2 py-1 rounded-md bg-white/[0.05] text-slate-300">
              Confidence: {result.confidenceLevel}
            </span>
          </div>
          <p className="text-[12px] text-slate-200/90 leading-relaxed">
            {result.scenarioSummary}
          </p>
          {result.nextActions.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-[1.5px] text-slate-500 mb-2">Recommended next steps</p>
              <ul className="space-y-1.5">
                {result.nextActions.slice(0, 3).map((action, idx) => (
                  <li key={idx} className="text-[12px] text-slate-200/85 leading-relaxed">
                    {idx + 1}. {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
