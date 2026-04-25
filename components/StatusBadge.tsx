import { CheckCircle, Clock, AlertTriangle, Search } from 'lucide-react';
import { CalculationResult } from '@/types/rules';

const statusConfig = {
  live: {
    label: 'LIVE',
    bg: 'bg-[var(--badge-live-bg)]',
    border: 'border-[var(--badge-live-border)]',
    text: 'text-[var(--badge-live-text)]',
    icon: CheckCircle,
    pulse: true,
  },
  expires_today: {
    label: 'EXPIRES TODAY',
    bg: 'bg-[var(--badge-today-bg)]',
    border: 'border-[var(--badge-today-border)]',
    text: 'text-[var(--badge-today-text)]',
    icon: Clock,
    pulse: true,
  },
  expired: {
    label: 'EXPIRED',
    bg: 'bg-[var(--badge-expired-bg)]',
    border: 'border-[var(--badge-expired-border)]',
    text: 'text-[var(--badge-expired-text)]',
    icon: AlertTriangle,
    pulse: false,
  },
  manual_review: {
    label: 'REVIEW',
    bg: 'bg-[var(--badge-review-bg)]',
    border: 'border-[var(--badge-review-border)]',
    text: 'text-[var(--badge-review-text)]',
    icon: Search,
    pulse: false,
  },
};

type Props = {
  status: CalculationResult['status'];
};

export default function StatusBadge({ status }: Props) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const glowVars: Record<string, string> = {
    live: 'var(--badge-glow-green)',
    expires_today: 'var(--badge-glow-amber)',
    expired: 'var(--badge-glow-red)',
    manual_review: 'var(--badge-glow-blue)',
  };

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-lg text-xs sm:text-sm font-medium tracking-wide border min-h-[44px] sm:min-h-0 ${config.bg} ${config.border} ${config.text}`}
      style={{ boxShadow: glowVars[status] }}
    >
      {config.pulse ? (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${status === 'live' ? 'bg-[var(--badge-live-dot)]' : 'bg-[var(--badge-today-dot)]'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'live' ? 'bg-[var(--badge-live-dot)]' : 'bg-[var(--badge-today-dot)]'}`} />
        </span>
      ) : (
        <Icon className="w-3.5 h-3.5" />
      )}
      {config.label}
    </span>
  );
}
