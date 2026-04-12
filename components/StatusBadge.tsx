import { CheckCircle, Clock, AlertTriangle, Search } from 'lucide-react';
import { CalculationResult } from '@/types/rules';

const statusConfig = {
  live: {
    label: 'LIVE',
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    text: 'text-green-400',
    icon: CheckCircle,
    pulse: true,
  },
  expires_today: {
    label: 'EXPIRES TODAY',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    icon: Clock,
    pulse: true,
  },
  expired: {
    label: 'EXPIRED',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: AlertTriangle,
    pulse: false,
  },
  manual_review: {
    label: 'REVIEW',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
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
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${status === 'live' ? 'bg-green-400' : 'bg-amber-400'}`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status === 'live' ? 'bg-green-400' : 'bg-amber-400'}`} />
        </span>
      ) : (
        <Icon className="w-3 h-3" />
      )}
      {config.label}
    </span>
  );
}
