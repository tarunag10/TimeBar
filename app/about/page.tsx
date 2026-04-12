'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, Cpu, Calendar, AlertTriangle, BookOpen } from 'lucide-react';

const sections = [
  {
    icon: Info,
    title: 'What is this tool?',
    content:
      'TimeBar is an informational decision-support tool that estimates limitation deadlines for common England & Wales civil claim types. It is designed for legal professionals and non-lawyers who need a clear, structured first-pass view of timing risk.',
  },
  {
    icon: Cpu,
    title: 'How does it work?',
    content:
      'The calculator uses a deterministic rules engine. You choose a claim type, enter key dates, and select any relevant modifiers (for example disability, fraud/concealment, acknowledgment, or part payment). The engine applies the selected legal rules and returns an estimated deadline with a full reasoning trail in plain English.',
    extra:
      'All calculations happen in your browser. No data is sent to any server. No dates or facts you enter are stored or tracked.',
  },
  {
    icon: BookOpen,
    title: 'Methodology',
    content:
      'Each supported claim type is defined by a versioned rule file containing the base limitation period, the accrual/start rule, supported modifiers, and manual review triggers.',
    steps: [
      'Determines the start date based on the claim type\u2019s start rule',
      'Calculates the base expiry by adding the limitation period',
      'Applies any modifier adjustments (postponement or fresh accrual)',
      'Checks for manual review triggers',
      'Returns the result with a step-by-step explanation',
    ],
  },
  {
    icon: Calendar,
    title: 'Date counting',
    content:
      'TimeBar uses exclusive date counting, which is the standard convention in English law. The date of accrual itself is excluded from the limitation period. For example, if a breach occurs on 14 June 2020 with a 6-year period, the expiry is 14 June 2026.',
  },
  {
    icon: AlertTriangle,
    title: 'Important limitations',
    content:
      'This tool is not legal advice. Limitation analysis depends on the specific facts of each case, including accrual, date of knowledge, disability, concealment, and whether a court may exercise discretion to disapply a time limit. The result is only as accurate as the inputs provided and should be independently verified.',
  },
];

export default function AboutPage() {
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
        About TimeBar
      </h1>

      <div className="space-y-6">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass rounded-xl p-5"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <Icon className="w-4 h-4 text-blue-400/70" />
                <h2 className="text-sm font-medium text-slate-200">{section.title}</h2>
              </div>
              <p className="text-[13px] text-slate-400 font-light leading-relaxed">
                {section.content}
              </p>
              {section.extra && (
                <p className="text-[13px] text-slate-400 font-light leading-relaxed mt-2">
                  {section.extra}
                </p>
              )}
              {section.steps && (
                <ol className="mt-3 space-y-1.5">
                  {section.steps.map((step, j) => (
                    <li key={j} className="flex gap-2.5 text-[12px] text-slate-400 font-light leading-relaxed">
                      <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-white/[0.04] text-slate-500 text-[10px] font-medium shrink-0 mt-0.5">
                        {j + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
