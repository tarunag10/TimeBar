'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale, Check, AlertTriangle, X } from 'lucide-react';
import { claimCategories, getRule } from '@/lib/rules';

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
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span className="font-light">Back to calculator</span>
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-gradient mt-8 mb-3">
        Coverage &amp; Limitations
      </h1>
      <p className="text-sm text-slate-400 mb-10 leading-relaxed">
        All supported England &amp; Wales limitation claim types, their base periods, the
        modifiers available, and what is not yet covered in this version.
      </p>

      {/* Supported claim types */}
      <div className="space-y-8 mb-10">
        {claimCategories.map((category, ci) => (
          <div key={category.label}>
            <p className="text-[11px] tracking-[2px] uppercase text-slate-500 font-medium mb-3">
              {category.label}
            </p>
            <div className="space-y-2">
              {category.items.map((claim, i) => {
                const rule = getRule(claim.key);
                return (
                  <motion.div
                    key={claim.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (ci * 4 + i) * 0.05 }}
                    className="glass rounded-xl p-4 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-[#d5b06b]/20 flex items-center justify-center shrink-0">
                      <Scale className="w-3.5 h-3.5 text-[#e6c48d]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-slate-200">
                        {claim.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {claim.shortDesc}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300">
                          {rule.statuteRef.act}, {rule.statuteRef.section}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#d5b06b]/10 text-[#ecd2a4] border border-[#d5b06b]/20">
                          {rule.basePeriod.value} {rule.basePeriod.unit}
                        </span>
                        {rule.longstopPeriod && (
                          <span className="px-2 py-0.5 rounded-md bg-[#9fbff6]/10 text-[#9fbff6] border border-[#9fbff6]/20">
                            {rule.longstopPeriod.value} {rule.longstopPeriod.unit} longstop
                          </span>
                        )}
                        {rule.supportedModifiers.length > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-400">
                            +{rule.supportedModifiers.length} modifier{rule.supportedModifiers.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Supported modifiers */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-10"
      >
        <h2 className="text-sm font-medium text-slate-200 mb-4">Supported modifiers</h2>
        <div className="glass rounded-xl p-4 space-y-3">
          {modifiers.map((mod) => (
            <div key={mod.label} className="flex items-start gap-2.5">
              <Check className="w-3.5 h-3.5 text-emerald-400/60 mt-0.5 shrink-0" />
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
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-rose-400/60" />
          <h2 className="text-sm font-medium text-rose-400/80">Not covered in this version</h2>
        </div>
        <p className="text-[13px] text-slate-400 font-light leading-relaxed mb-4">
          The following claim types and scenarios are explicitly out of scope. If
          your matter involves any of these, a manual legal review is strongly recommended:
        </p>
        <div className="glass rounded-xl p-4 space-y-2">
          {excluded.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <X className="w-3 h-3 text-rose-400/40 mt-1 shrink-0" />
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
          The result is only as accurate as the facts you enter. Accrual dates, dates of knowledge,
          and modifier dates can all be legally contested. Where facts are disputed or legally
          complex, the tool is designed to flag manual review rather than provide a misleadingly
          precise answer.
        </p>
        <p className="text-[11px] text-slate-500 leading-relaxed font-light mt-3">
          All statute citations and section labels should be independently verified by a qualified
          legal professional before reliance. Rule files are versioned and carry a last-reviewed
          date for audit purposes.
        </p>
      </motion.div>
    </div>
  );
}
