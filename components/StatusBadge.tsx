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

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium tracking-wide border ${config.bg} ${config.border} ${config.text}`}
    >
      {config.pulse ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${status === 'live' ? 'bg-[var(--badge-live-dot)]' : 'bg-[var(--badge-today-dot)]'}`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status === 'live' ? 'bg-[var(--badge-live-dot)]' : 'bg-[var(--badge-today-dot)]'}`} />
        </span>
      ) : (
        <Icon className="w-3 h-3" />
      )}
      {config.label}
    </span>
  );
}
