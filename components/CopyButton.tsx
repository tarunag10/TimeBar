'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { CalculationResult } from '@/types/rules';
import { getRule } from '@/lib/rules';
import { format, parseISO } from 'date-fns';

type Props = {
  result: CalculationResult;
  claimType: string;
};

function formatCopyText(result: CalculationResult, claimType: string): string {
  const rule = getRule(claimType as Parameters<typeof getRule>[0]);
  const lines: string[] = [];

  lines.push('TimeBar — Limitation Calculator');
  lines.push(`Selected claim: ${rule.title}`);

  if (result.status === 'manual_review') {
    lines.push('');
    lines.push('MANUAL REVIEW REQUIRED');
    lines.push(`Urgency: ${result.urgencyLevel.toUpperCase()}`);
    lines.push(`Confidence: ${result.confidenceLevel.toUpperCase()}`);
    lines.push(`Summary: ${result.scenarioSummary}`);
    for (const warning of result.warnings) {
      lines.push(`Reason: ${warning}`);
    }
    if (result.nextActions.length > 0) {
      lines.push('');
      lines.push('Recommended next actions:');
      for (const action of result.nextActions) {
        lines.push(`- ${action}`);
      }
    }
    if (result.proceduralMilestones.length > 0) {
      lines.push('');
      lines.push('Procedural action timeline:');
      for (const milestone of result.proceduralMilestones) {
        const when = milestone.targetDate
          ? format(parseISO(milestone.targetDate), 'd MMMM yyyy')
          : 'Date to be confirmed';
        lines.push(`- [${milestone.priority.toUpperCase()}] ${milestone.title} (${when})`);
      }
    }
    if (result.scenarioTimelines.length > 0) {
      lines.push('');
      lines.push('Scenario timeline model:');
      for (const scenario of result.scenarioTimelines) {
        lines.push(
          `- ${scenario.label}: ${format(parseISO(scenario.expiryDate), 'd MMMM yyyy')} (${scenario.riskBand.toUpperCase()} RISK) — ${scenario.basis}`
        );
      }
    }
    lines.push(`Base period (if standard rule applied): ${rule.basePeriod.value} ${rule.basePeriod.unit} from ${rule.startRule.replace(/_/g, ' ')}`);
  } else {
    lines.push(`Base period: ${rule.basePeriod.value} ${rule.basePeriod.unit} from ${rule.startRule.replace(/_/g, ' ')}`);
    if (result.primaryExpiryDate) {
      lines.push(`Estimated limitation expiry date: ${format(parseISO(result.primaryExpiryDate), 'd MMMM yyyy')}`);
    }
    if (result.adjustedExpiryDate) {
      lines.push(`Adjusted expiry after modifiers: ${format(parseISO(result.adjustedExpiryDate), 'd MMMM yyyy')}`);
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
    lines.push(`Urgency: ${result.urgencyLevel.toUpperCase()}`);
    lines.push(`Confidence: ${result.confidenceLevel.toUpperCase()}`);
    lines.push(`Summary: ${result.scenarioSummary}`);
    lines.push(`Statute: ${rule.statuteRef.act}, ${rule.statuteRef.section}`);
    if (result.nextActions.length > 0) {
      lines.push('');
      lines.push('Recommended next actions:');
      for (const action of result.nextActions) {
        lines.push(`- ${action}`);
      }
    }
    if (result.proceduralMilestones.length > 0) {
      lines.push('');
      lines.push('Procedural action timeline:');
      for (const milestone of result.proceduralMilestones) {
        const when = milestone.targetDate
          ? format(parseISO(milestone.targetDate), 'd MMMM yyyy')
          : 'Date to be confirmed';
        lines.push(`- [${milestone.priority.toUpperCase()}] ${milestone.title} (${when})`);
      }
    }
    if (result.scenarioTimelines.length > 0) {
      lines.push('');
      lines.push('Scenario timeline model:');
      for (const scenario of result.scenarioTimelines) {
        lines.push(
          `- ${scenario.label}: ${format(parseISO(scenario.expiryDate), 'd MMMM yyyy')} (${scenario.riskBand.toUpperCase()} RISK) — ${scenario.basis}`
        );
      }
    }
    if (result.warnings.length > 0) {
      lines.push('');
      for (const w of result.warnings) {
        lines.push(`Warning: ${w}`);
      }
    }
  }

  lines.push('');
  lines.push('This is an informational legal-timing estimate, not legal advice.');
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
    <motion.button
      type="button"
      onClick={handleCopy}
      whileTap={{ scale: 0.9 }}
      className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300
        px-2.5 py-1.5 rounded-lg glass-hover transition-all duration-200 cursor-pointer border border-transparent hover:border-white/[0.06]"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="text-green-400"
          >
            <Check className="w-3.5 h-3.5" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Copy className="w-3.5 h-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="font-light">{copied ? 'Copied' : 'Copy'}</span>
    </motion.button>
  );
}
