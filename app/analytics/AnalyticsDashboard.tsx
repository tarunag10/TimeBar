'use client';

import { useState, useMemo } from 'react';
import { BarChart3, MousePointerClick, FileText } from 'lucide-react';
import { getAnalyticsEvents, AnalyticsEvent } from '@/lib/storage';

export default function AnalyticsDashboard() {
  const [events] = useState<AnalyticsEvent[]>(() => getAnalyticsEvents());

  const { actionCounts, claimCounts, statusCounts } = useMemo(() => {
    const actions: Record<string, number> = {};
    const claims: Record<string, number> = {};
    const statuses: Record<string, number> = {};

    for (const e of events) {
      actions[e.type] = (actions[e.type] || 0) + 1;
      if (e.claimType) claims[e.claimType] = (claims[e.claimType] || 0) + 1;
      if (e.status) statuses[e.status] = (statuses[e.status] || 0) + 1;
    }

    return { actionCounts: actions, claimCounts: claims, statusCounts: statuses };
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="panel-shell p-6 text-center">
        <p className="text-slate-400 text-sm">No analytics events recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="panel-shell p-5 sm:p-7">
        <div className="flex items-center gap-2 mb-4">
          <MousePointerClick className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-xs font-semibold uppercase tracking-[2px] text-slate-400">
            Actions ({events.length} total events)
          </h2>
        </div>
        <div className="space-y-2">
          {Object.entries(actionCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.06] bg-[var(--overlay-subtle)]">
                <span className="text-[12px] text-slate-300 font-mono">{type}</span>
                <span className="text-[12px] text-[var(--accent)] font-semibold">{count}</span>
              </div>
            ))}
        </div>
      </div>

      {Object.keys(claimCounts).length > 0 && (
        <div className="panel-shell p-5 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-[var(--accent-blue)]" />
            <h2 className="text-xs font-semibold uppercase tracking-[2px] text-slate-400">
              Claim Types
            </h2>
          </div>
          <div className="space-y-2">
            {Object.entries(claimCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.06] bg-[var(--overlay-subtle)]">
                  <span className="text-[12px] text-slate-300">{type.replace(/_/g, ' ')}</span>
                  <span className="text-[12px] text-[var(--accent-blue)] font-semibold">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {Object.keys(statusCounts).length > 0 && (
        <div className="panel-shell p-5 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-semibold uppercase tracking-[2px] text-slate-400">
              Result Statuses
            </h2>
          </div>
          <div className="space-y-2">
            {Object.entries(statusCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-2.5 rounded-lg border border-white/[0.06] bg-[var(--overlay-subtle)]">
                  <span className="text-[12px] text-slate-300">{status.replace(/_/g, ' ')}</span>
                  <span className="text-[12px] text-emerald-400 font-semibold">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
