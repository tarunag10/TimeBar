'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rule, Question } from '@/types/rules';

type Props = {
  rule: Rule;
  answers: Record<string, string | boolean | undefined>;
  onAnswerChange: (id: string, value: string | boolean | undefined) => void;
};

function BooleanInput({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: boolean | string | undefined;
  onChange: (val: boolean | string) => void;
}) {
  const options = [
    { label: 'Yes', val: true },
    { label: 'No', val: false },
    { label: 'Unsure', val: 'unsure' as const },
  ];

  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const isSelected = value === opt.val;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.val)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer
              ${
                isSelected
                  ? 'bg-slate-700 border-blue-500/50 text-slate-100 border'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 border hover:border-slate-600 hover:text-slate-300'
              }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function DateInput({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string | undefined;
  onChange: (val: string) => void;
}) {
  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200
        focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40
        transition-all duration-150 w-full sm:w-auto"
      aria-label={question.label}
    />
  );
}

function HelpTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block ml-1.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-slate-500 hover:text-slate-400 text-[10px] transition-colors cursor-pointer"
        aria-label="More information"
      >
        &#9432;
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 left-0 top-full mt-1 w-64 sm:w-80 bg-slate-700 border border-slate-600 rounded-lg p-3 shadow-xl"
          >
            <p className="text-[11px] text-slate-300 leading-relaxed">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function DynamicQuestionnaire({ rule, answers, onAnswerChange }: Props) {
  function shouldShow(question: Question): boolean {
    if (!question.showWhen) return true;
    const depValue = answers[question.showWhen.field];
    return depValue === question.showWhen.equals;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-5"
    >
      {rule.questions.map((q) => {
        if (!shouldShow(q)) return null;

        return (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <label className="block text-[11px] sm:text-xs text-slate-400 mb-1.5">
              {q.label}
              {q.helpText && <HelpTooltip text={q.helpText} />}
            </label>

            {q.type === 'boolean' && (
              <BooleanInput
                question={q}
                value={answers[q.id]}
                onChange={(val) => onAnswerChange(q.id, val)}
              />
            )}

            {q.type === 'date' && (
              <DateInput
                question={q}
                value={answers[q.id] as string | undefined}
                onChange={(val) => onAnswerChange(q.id, val)}
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
