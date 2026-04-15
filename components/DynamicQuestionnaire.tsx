'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, HelpCircle } from 'lucide-react';
import { Rule, Question } from '@/types/rules';
import { validateDateNotFuture, validateDateOrder } from '@/lib/validation/calculatorSchema';

type Props = {
  rule: Rule;
  answers: Record<string, string | boolean | undefined>;
  onAnswerChange: (id: string, value: string | boolean | undefined) => void;
};

function BooleanInput({
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
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = value === opt.val;
        return (
          <motion.button
            key={opt.label}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt.val)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border
              ${
                isSelected
                  ? 'bg-[#d5b06b]/15 border-[#d5b06b]/45 text-[#f2deb8] shadow-[0_0_18px_-5px_rgba(213,176,107,0.35)]'
                  : 'glass border-white/[0.08] text-slate-300 hover:text-slate-100 hover:border-[#d5b06b]/35 hover:bg-white/[0.06]'
              }`}
          >
            {opt.label}
          </motion.button>
        );
      })}
    </div>
  );
}

function DateInput({
  question,
  value,
  onChange,
  error,
  onBlur,
}: {
  question: Question;
  value: string | undefined;
  onChange: (val: string) => void;
  error: string | null;
  onBlur: () => void;
}) {
  const errorId = `${question.id}-error`;
  return (
    <div>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#d5b06b]/70 pointer-events-none" />
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full sm:w-auto pl-9 pr-3 py-2.5 rounded-xl text-sm text-slate-100
            glass border ${error ? 'border-rose-500/60' : 'border-[#d5b06b]/25'}
            focus:outline-none focus:border-[#d5b06b]/55 focus:bg-white/[0.05] focus:shadow-[0_0_20px_-6px_rgba(213,176,107,0.35)]
            transition-all duration-200 placeholder:text-slate-500`}
          aria-label={question.label}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-[11px] text-rose-400">{error}</p>
      )}
    </div>
  );
}

function HelpTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block ml-1.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-slate-500 hover:text-[#d5b06b] transition-colors duration-200 cursor-pointer"
        aria-label="More information"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute z-30 left-0 top-full mt-2 w-72 sm:w-80 glass-strong rounded-xl p-3.5 shadow-2xl border border-[#d5b06b]/25"
            >
              <p className="text-[11px] text-slate-200 leading-relaxed">{text}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </span>
  );
}

const DATE_FIELDS_AFTER_ACCRUAL = new Set([
  'knowledge_date',
  'discovery_date',
  'disability_ceased_date',
  'acknowledgment_date',
  'part_payment_date',
]);

export default function DynamicQuestionnaire({ rule, answers, onAnswerChange }: Props) {
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const validateField = useCallback((questionId: string) => {
    const value = answers[questionId] as string | undefined;
    if (!value) {
      setErrors((prev) => ({ ...prev, [questionId]: null }));
      return;
    }

    // Check future date
    const futureError = validateDateNotFuture(value);
    if (futureError) {
      setErrors((prev) => ({ ...prev, [questionId]: futureError }));
      return;
    }

    // Check date ordering (secondary dates must be >= accrual_date)
    if (DATE_FIELDS_AFTER_ACCRUAL.has(questionId)) {
      const accrualDate = answers.accrual_date as string | undefined;
      if (accrualDate) {
        const orderError = validateDateOrder(accrualDate, value, 'This date must not be before the accrual date');
        if (orderError) {
          setErrors((prev) => ({ ...prev, [questionId]: orderError }));
          return;
        }
      }
    }

    setErrors((prev) => ({ ...prev, [questionId]: null }));
  }, [answers]);

  function shouldShow(question: Question): boolean {
    if (!question.showWhen) return true;
    const depValue = answers[question.showWhen.field];
    return depValue === question.showWhen.equals;
  }

  return (
    <div className="space-y-4">
      {rule.questions.map((q, i) => {
        if (!shouldShow(q)) return null;

        return (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <label className="flex items-center text-[12px] text-slate-200 font-medium mb-2.5 leading-relaxed">
              <span>{q.label}</span>
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
                error={errors[q.id] ?? null}
                onBlur={() => validateField(q.id)}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
