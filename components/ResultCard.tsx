'use client';

import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { CalculationResult } from '@/types/rules';
import StatusBadge from './StatusBadge';
import Timeline from './Timeline';
import CopyButton from './CopyButton';
import CalendarExportButton from './CalendarExportButton';
import PrintButton from './PrintButton';
import ShareButton from './ShareButton';

type Props = {
  result: CalculationResult;
  claimType: string;
  accrualDate: string;
  answers: Record<string, string | boolean | undefined>;
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
    gradient: 'from-[var(--accent)]/20 via-[var(--accent)]/5 to-transparent',
    border: 'border-[var(--accent)]/35',
    glow: 'glow-blue',
    dateColor: 'text-[var(--accent-text)]',
    accent: 'bg-[var(--accent)]',
  },
};

function formatDisplayDate(isoDate: string): string {
  return format(parseISO(isoDate), 'd MMMM yyyy');
}

function priorityStyle(priority: 'normal' | 'high' | 'critical'): string {
  if (priority === 'critical') return 'text-[var(--priority-critical-text)] bg-[var(--priority-critical-bg)] border-[var(--priority-critical-border)]';
  if (priority === 'high') return 'text-[var(--priority-high-text)] bg-[var(--priority-high-bg)] border-[var(--priority-high-border)]';
  return 'text-[var(--priority-normal-text)] bg-[var(--priority-normal-bg)] border-[var(--priority-normal-border)]';
}

function riskBandStyle(riskBand: 'high' | 'medium' | 'low'): string {
  if (riskBand === 'high') return 'text-[var(--risk-high-text)] bg-[var(--risk-high-bg)] border-[var(--risk-high-border)]';
  if (riskBand === 'medium') return 'text-[var(--risk-medium-text)] bg-[var(--risk-medium-bg)] border-[var(--risk-medium-border)]';
  return 'text-[var(--risk-low-text)] bg-[var(--risk-low-bg)] border-[var(--risk-low-border)]';
}

export default function ResultCard({ result, claimType, accrualDate, answers }: Props) {
  const style = statusStyles[result.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative overflow-hidden rounded-2xl border glass-card ${style.border} ${style.glow}`}
    >
      <div className={`absolute top-0 left-0 w-full h-px ${style.accent} opacity-30`} />
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`} />
      <div className="absolute inset-0 glass" />

      <div className="relative p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            {result.status === 'manual_review' ? (
              <>
                <div className="text-[11px] uppercase tracking-wider text-[var(--accent-text)] font-semibold mb-3">
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
                <div className={`text-[13px] sm:text-sm uppercase tracking-wider ${style.dateColor} font-semibold mb-1`}>
                  {result.status === 'live' && (
                    <span className="animate-countdown">{result.daysRemaining} days remaining</span>
                  )}
                  {result.status === 'expires_today' && 'Expires today'}
                  {result.status === 'expired' && `${Math.abs(result.daysRemaining || 0)} days overdue`}
                </div>

                {result.primaryExpiryDate && (
                  <div className={`text-[2rem] sm:text-4xl display-serif ${style.dateColor} tracking-tight leading-none`}>
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

          <div className="shrink-0 grid grid-cols-2 sm:flex sm:flex-col items-stretch sm:items-end gap-2 sm:gap-2.5">
            <StatusBadge status={result.status} />
            <ShareButton shareState={{ claimType, answers }} />
            <CopyButton result={result} claimType={claimType} />
            <CalendarExportButton result={result} claimType={claimType} />
            <PrintButton claimType={claimType} />
          </div>
        </div>

        <div className="mt-4 rounded-xl sm:rounded-2xl border border-white/[0.08] bg-[var(--overlay-subtle)] p-3 sm:p-3.5 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[1.5px]">
            <span className="px-2 py-1 rounded-md bg-[var(--overlay-white-5)] text-slate-300">
              Urgency: {result.urgencyLevel}
            </span>
            <span className="px-2 py-1 rounded-md bg-[var(--overlay-white-5)] text-slate-300">
              Confidence: {result.confidenceLevel}
            </span>
          </div>
          <div className="divider-gradient" />
          <p className="text-[12px] text-slate-200/90 leading-relaxed">
            {result.scenarioSummary}
          </p>
          {result.nextActions.length > 0 && <div className="divider-gradient" />}
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

          {result.proceduralMilestones.length > 0 && <div className="divider-gradient" />}
          {result.proceduralMilestones.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-[1.5px] text-slate-500 mb-2">Procedural action timeline</p>
              <div className="space-y-2">
                {result.proceduralMilestones.slice(0, 4).map((milestone, idx) => (
                  <div key={idx} className="rounded-xl glass glass-card p-3 mobile-flat-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[12px] text-slate-100 font-medium">{milestone.title}</p>
                      <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded border ${priorityStyle(milestone.priority)}`}>
                        {milestone.priority}
                      </span>
                    </div>
                    {milestone.targetDate && (
                      <p className="text-[11px] text-slate-300 mt-1">
                        Target date: {formatDisplayDate(milestone.targetDate)}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{milestone.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.scenarioTimelines.length > 0 && <div className="divider-gradient" />}
          {result.scenarioTimelines.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-[1.5px] text-slate-500 mb-2">Scenario timeline model</p>
              <div className="space-y-2">
                {result.scenarioTimelines.map((scenario) => (
                  <div key={scenario.id} className="rounded-xl glass glass-card p-3 mobile-flat-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[12px] text-slate-100 font-medium">{scenario.label}</p>
                      <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded border ${riskBandStyle(scenario.riskBand)}`}>
                        {scenario.riskBand} risk
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      {formatDisplayDate(scenario.expiryDate)} ({scenario.daysRemaining} day(s) remaining)
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{scenario.basis}</p>
                  </div>
                ))}
              </div>
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
