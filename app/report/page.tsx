'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { calculate } from '@/lib/engine/calculate';
import { decodeShareState } from '@/lib/share';
import { rules } from '@/lib/rules';
import { Rule, CalculationResult } from '@/types/rules';
import { getRule } from '@/lib/rules';

function formatDisplayDate(isoDate: string): string {
  return format(parseISO(isoDate), 'd MMMM yyyy');
}

function priorityLabel(priority: 'normal' | 'high' | 'critical'): string {
  if (priority === 'critical') return 'CRITICAL';
  if (priority === 'high') return 'HIGH';
  return 'NORMAL';
}

function riskLabel(risk: 'high' | 'medium' | 'low'): string {
  if (risk === 'high') return 'HIGH';
  if (risk === 'medium') return 'MEDIUM';
  return 'LOW';
}

function ReportContent() {
  const searchParams = useSearchParams();
  const shared = searchParams.get('s');

  const data = useMemo(() => {
    if (!shared) return null;
    const state = decodeShareState(shared);
    if (!state || !state.claimType || !(state.claimType in rules)) return null;
    const rule = getRule(state.claimType as Rule['claimType']);
    const result = calculate({ claimType: state.claimType as Rule['claimType'], answers: state.answers });
    return { rule, result, claimType: state.claimType, answers: state.answers };
  }, [shared]);

  if (!data) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Report Link</h1>
          <p className="text-gray-600">The share link is invalid or has expired. Please generate a new link from the calculator.</p>
        </div>
      </div>
    );
  }

  const { rule, result, claimType } = data;
  const accrualDate = data.answers.accrual_date as string | undefined;
  const generatedAt = format(new Date(), 'd MMMM yyyy \'at\' HH:mm');

  return (
    <div className="min-h-screen bg-white text-gray-900 relative print-watermark">
      {/* Header */}
      <header className="border-b-2 border-gray-800 py-6 px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              TimeBar — Limitation Period Report
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {rule.title} · {rule.statuteRef.act}, {rule.statuteRef.section}
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>Generated: {generatedAt}</p>
            <p>Rule version: {rule.version}</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-8 py-8 space-y-8">
        {/* Result summary */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Result Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
              <p className={`text-lg font-bold ${
                result.status === 'live' ? 'text-emerald-700' :
                result.status === 'expires_today' ? 'text-amber-700' :
                result.status === 'expired' ? 'text-red-700' :
                'text-blue-700'
              }`}>
                {result.status.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            {(result.primaryExpiryDate) && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Expiry Date</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDisplayDate(result.adjustedExpiryDate || result.primaryExpiryDate)}
                </p>
              </div>
            )}
            {result.daysRemaining !== undefined && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Days Remaining</p>
                <p className="text-lg font-bold text-gray-900">{result.daysRemaining}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Urgency</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{result.urgencyLevel}</p>
            </div>
          </div>
          {accrualDate && (
            <p className="mt-3 text-sm text-gray-600">
              Accrual date: {formatDisplayDate(accrualDate)}
              {result.adjustedExpiryDate && (
                <> · Base expiry: {formatDisplayDate(result.primaryExpiryDate!)} · Modifiers: {result.appliedModifiers.join(', ') || 'None'}</>
              )}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-700">{result.scenarioSummary}</p>
        </section>

        {/* Scenario timelines */}
        {result.scenarioTimelines.length > 0 && (
          <section className="break-before-page">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              Scenario Timelines
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 text-gray-600 font-medium">Scenario</th>
                  <th className="text-left py-2 pr-4 text-gray-600 font-medium">Expiry Date</th>
                  <th className="text-left py-2 pr-4 text-gray-600 font-medium">Days Left</th>
                  <th className="text-left py-2 pr-4 text-gray-600 font-medium">Risk</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Basis</th>
                </tr>
              </thead>
              <tbody>
                {result.scenarioTimelines.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium">{s.label}</td>
                    <td className="py-2 pr-4">{formatDisplayDate(s.expiryDate)}</td>
                    <td className="py-2 pr-4">{s.daysRemaining}</td>
                    <td className="py-2 pr-4">{riskLabel(s.riskBand)}</td>
                    <td className="py-2 text-gray-600 text-xs">{s.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Reasoning trail */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Reasoning Trail
          </h2>
          <ol className="space-y-2">
            {result.explanationSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-medium shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Applied modifiers & warnings */}
        {result.appliedModifiers.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              Applied Modifiers
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {result.appliedModifiers.map((mod, i) => (
                <li key={i}>{mod}</li>
              ))}
            </ul>
          </section>
        )}

        {result.warnings.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              Warnings
            </h2>
            <ul className="space-y-2">
              {result.warnings.map((w, i) => (
                <li key={i} className="flex gap-2 text-sm text-amber-800">
                  <span className="shrink-0">⚠</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Procedural milestones */}
        {result.proceduralMilestones.length > 0 && (
          <section className="break-before-page">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              Procedural Milestones
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 text-gray-600 font-medium">Milestone</th>
                  <th className="text-left py-2 pr-4 text-gray-600 font-medium">Target Date</th>
                  <th className="text-left py-2 pr-4 text-gray-600 font-medium">Priority</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {result.proceduralMilestones.map((m, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium">{m.title}</td>
                    <td className="py-2 pr-4">{m.targetDate ? formatDisplayDate(m.targetDate) : '—'}</td>
                    <td className="py-2 pr-4">{priorityLabel(m.priority)}</td>
                    <td className="py-2 text-gray-600 text-xs">{m.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Statute references */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Statute References
          </h2>
          <ul className="space-y-1 text-sm text-gray-700">
            {result.statuteRefs.map((ref, i) => (
              <li key={i}>{ref.act}, {ref.section} — {ref.label}</li>
            ))}
          </ul>
        </section>

        {/* Review checklist */}
        {result.reviewChecklist.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              Review Checklist
            </h2>
            <ol className="space-y-1 text-sm text-gray-700">
              {result.reviewChecklist.map((item, i) => (
                <li key={i}>{i + 1}. {item}</li>
              ))}
            </ol>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-300 py-4 px-8 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p className="font-semibold text-gray-600">
            DISCLAIMER: This is not legal advice. Limitation analysis depends on case facts, disputed evidence, and judicial discretion. Always verify with a qualified legal professional.
          </p>
          <p>
            TimeBar v{rule.version} · Page <span className="page-number">1</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <p className="text-gray-500">Loading report…</p>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
