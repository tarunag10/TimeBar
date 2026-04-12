'use client';

import { useState } from 'react';
import { CalculationResult } from '@/types/rules';
import { getRule } from '@/lib/rules';
import { format, parseISO } from 'date-fns';

type Props = {
  result: CalculationResult;
  claimType: string;
};

function formatCopyText(result: CalculationResult, claimType: string): string {
  const rule = getRule(claimType as any);
  const lines: string[] = [];

  lines.push('TimeBar — Limitation Calculator');
  lines.push(`Selected claim: ${rule.title}`);

  if (result.status === 'manual_review') {
    lines.push('');
    lines.push('MANUAL REVIEW REQUIRED');
    for (const warning of result.warnings) {
      lines.push(`Reason: ${warning}`);
    }
    lines.push(`Base period (if standard rule applied): ${rule.basePeriod.value} ${rule.basePeriod.unit} from ${rule.startRule.replace(/_/g, ' ')}`);
  } else {
    lines.push(`Base period: ${rule.basePeriod.value} ${rule.basePeriod.unit} from ${rule.startRule.replace(/_/g, ' ')}`);

    if (result.primaryExpiryDate) {
      lines.push(`Likely expiry: ${format(parseISO(result.primaryExpiryDate), 'd MMMM yyyy')}`);
    }
    if (result.adjustedExpiryDate) {
      lines.push(`Adjusted expiry: ${format(parseISO(result.adjustedExpiryDate), 'd MMMM yyyy')}`);
    }
    if (result.appliedModifiers.length > 0) {
      lines.push(`Modifiers: ${result.appliedModifiers.join('; ')}`);
    } else {
      lines.push('Modifiers: None applied');
    }

    const statusLabels = {
      live: `${result.daysRemaining} days remaining`,
      expires_today: 'Expires today',
      expired: `${Math.abs(result.daysRemaining || 0)} days overdue`,
      manual_review: 'Manual review required',
    };
    lines.push(`Status: ${statusLabels[result.status]}`);

    lines.push(`Statute: ${rule.statuteRef.act}, ${rule.statuteRef.section}`);

    if (result.warnings.length > 0) {
      lines.push('');
      for (const w of result.warnings) {
        lines.push(`Warning: ${w}`);
      }
    }
  }

  lines.push('');
  lines.push('This is an informational calculation, not legal advice.');

  return lines.join('\n');
}

export default function CopyButton({ result, claimType }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = formatCopyText(result, claimType);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
    >
      {copied ? 'Copied!' : 'Copy result'}
    </button>
  );
}
