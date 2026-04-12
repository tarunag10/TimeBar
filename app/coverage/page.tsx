'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Briefcase,
  Check,
  FileText,
  Gavel,
  Heart,
  House,
  Landmark,
  MessageSquare,
  Percent,
  Scale,
  Shield,
  Stamp,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { claimCategories } from '@/lib/rules';
import { Rule } from '@/types/rules';

const claimIcons: Record<Rule['claimType'], LucideIcon> = {
  simple_contract: FileText,
  tort_non_pi: Shield,
  personal_injury: Heart,
  defamation: MessageSquare,
  deed_specialty: Stamp,
  professional_negligence: Briefcase,
  debt_recovery: Banknote,
  contribution: Scale,
  recovery_of_land: Landmark,
  breach_of_trust: Users,
  judgment_enforcement: Gavel,
  mortgage_principal: House,
  mortgage_interest: Percent,
};

const modifiers = [
  { label: 'Disability', detail: 'postponement under s.28' },
  { label: 'Fraud / concealment / mistake', detail: 'postponement under s.32' },
  { label: 'Acknowledgment', detail: 'fresh accrual under s.29' },
  { label: 'Part payment', detail: 'fresh accrual under s.29' },
];

const excluded = [
  'Standstill agreements and bespoke contractual tolling',
  'Foreign limitation rules and conflict of laws',
  'Arbitration-specific and adjudication-specific deadlines',
  'Insolvency stays and insolvency-specific timeline effects',
  'Detailed CPR service/procedural deadlines',
  'Detailed adverse possession regimes under Land Registration Act 2002',
  'Complex trust claims against third parties (knowing receipt/dishonest assistance)',
  'Complex mortgage possession proceedings strategy',
  'Fatal accidents and dependency claims',
  'Product liability specific rules',
];

export default function CoveragePage() {
  return (
    <div className="max-w-lg mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span className="font-light">Back to calculator</span>
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-gradient mt-8 mb-10">
        Coverage &amp; Limitations
      </h1>

      {/* Supported claim types */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-sm font-medium text-slate-200 mb-4">Supported claim types</h2>
        <div className="space-y-2">
          {claimCategories.map((category, i) => (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="glass rounded-xl p-4"
            >
              <p className="text-[11px] uppercase tracking-[2px] text-slate-500 mb-2.5">{category.label}</p>
              <div className="space-y-2">
                {category.items.map((ct) => {
                  const Icon = claimIcons[ct.key];
                  return (
                    <div key={ct.key} className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-blue-400/60 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[13px] text-slate-200 font-medium">{ct.title}</p>
                        <p className="text-[11px] text-slate-500 font-light mt-0.5">{ct.shortDesc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Supported modifiers */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-sm font-medium text-slate-200 mb-4">Supported modifiers</h2>
        <div className="glass rounded-xl p-4 space-y-3">
          {modifiers.map((mod) => (
            <div key={mod.label} className="flex items-start gap-2.5">
              <Check className="w-3.5 h-3.5 text-green-400/60 mt-0.5 shrink-0" />
              <p className="text-[13px] font-light">
                <span className="text-slate-300">{mod.label}</span>
                <span className="text-slate-500"> — {mod.detail}</span>
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Not covered */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-400/60" />
          <h2 className="text-sm font-medium text-red-400/80">Not covered in this version</h2>
        </div>
        <p className="text-[13px] text-slate-400 font-light leading-relaxed mb-4">
          The following claim types and scenarios are explicitly out of scope. If your matter
          involves any of these, manual legal review is required:
        </p>
        <div className="glass rounded-xl p-4 space-y-2">
          {excluded.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <X className="w-3 h-3 text-red-400/40 mt-1 shrink-0" />
              <p className="text-[12px] text-slate-500 font-light">{item}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Accuracy */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-xl p-5"
      >
        <h2 className="text-sm font-medium text-slate-200 mb-2">Accuracy of results</h2>
        <p className="text-[13px] text-slate-400 font-light leading-relaxed">
          The result is only as accurate as the inputs you provide. Accrual dates and dates of
          knowledge may be legally contestable. Where the facts are disputed or complex, the
          tool will flag the need for manual review rather than provide a potentially misleading
          answer.
        </p>
      </motion.div>
    </div>
  );
}
