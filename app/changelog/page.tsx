'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag, AlertTriangle } from 'lucide-react';

const features = [
  'Simple contract limitation calculator (s.5)',
  'Tort non-personal injury calculator (s.2)',
  'Personal injury calculator with date of knowledge (s.11/s.14)',
  'Defamation / malicious falsehood calculator (s.4A)',
  'Disability postponement modifier (s.28)',
  'Fraud / concealment / mistake postponement modifier (s.32)',
  'Acknowledgment fresh accrual modifier (s.29)',
  'Part payment fresh accrual modifier (s.29)',
  'Manual review states for uncertain scenarios',
  'Step-by-step reasoning trail with statute references',
  'Visual timeline',
  'Copy result to clipboard',
];

export default function ChangelogPage() {
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
        Changelog
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Version entry */}
        <div className="relative pl-6 border-l border-blue-500/20">
          {/* Version dot */}
          <div className="absolute -left-[5px] top-0 w-[10px] h-[10px] rounded-full bg-blue-500 ring-4 ring-[var(--bg-deep)]" />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--changelog-badge-bg)] border border-[var(--changelog-badge-border)]">
              <Tag className="w-3 h-3 text-blue-400" />
              <span className="text-[12px] font-medium text-blue-300">v1.0.0</span>
            </div>
            <span className="text-[11px] text-slate-500 font-light">April 2026</span>
          </div>

          <div className="glass rounded-xl p-5 mb-5">
            <p className="text-sm font-medium text-slate-200 mb-3">Initial release</p>
            <div className="space-y-2">
              {features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="w-1 h-1 rounded-full bg-blue-400/40 mt-1.5 shrink-0" />
                  <p className="text-[12px] text-slate-400 font-light">{feature}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legal review note */}
          <div className="glass rounded-xl p-4 border-amber-500/[0.08]">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500/60" />
              <p className="text-[10px] uppercase tracking-wider text-amber-500/60 font-medium">
                Legal review note
              </p>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-light">
              All statute citations and section labels should be independently verified by a
              qualified legal professional before reliance. Rule files are marked with a
              last-reviewed date for audit purposes.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
