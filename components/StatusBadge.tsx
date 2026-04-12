import { CalculationResult } from '@/types/rules';

const statusConfig = {
  live: {
    label: 'LIVE',
    bg: 'bg-green-500/10',
    border: 'border-green-500/25',
    text: 'text-green-400',
  },
  expires_today: {
    label: 'EXPIRES TODAY',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    text: 'text-amber-400',
  },
  expired: {
    label: 'EXPIRED',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    text: 'text-red-400',
  },
  manual_review: {
    label: 'MANUAL REVIEW',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
    text: 'text-blue-400',
  },
};

type Props = {
  status: CalculationResult['status'];
};

export default function StatusBadge({ status }: Props) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide border ${config.bg} ${config.border} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
