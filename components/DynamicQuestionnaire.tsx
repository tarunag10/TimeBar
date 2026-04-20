'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, HelpCircle } from 'lucide-react';
import { Rule, Question, SelectOption } from '@/types/rules';
import { validateDateInline, validateDateRange } from '@/lib/validation/calculatorSchema';

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
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border
              ${
                isSelected
                  ? 'bg-[var(--accent-soft)] border-[var(--accent)]/45 text-[var(--accent-text)] shadow-[0_0_18px_-5px_rgba(213,176,107,0.35)]'
                  : 'glass border-white/[0.08] text-slate-300 hover:text-slate-100 hover:border-[var(--accent)]/35 hover:bg-[var(--surface-hover)]'
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
  const hintId = `${question.id}-hint`;
  return (
    <div>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--accent)]/70 pointer-events-none" />
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          min="1900-01-01"
          max="2100-12-31"
          className={`w-full sm:w-auto pl-9 pr-3 h-12 rounded-xl text-sm text-slate-100 min-h-[44px]
            glass border ${error ? 'border-rose-500/60' : 'border-[var(--accent)]/25'}
            shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]
            focus:outline-none focus:border-[var(--accent)]/55 focus:bg-[var(--surface-hover)] focus:shadow-[0_0_20px_-6px_rgba(213,176,107,0.35),inset_0_1px_3px_rgba(0,0,0,0.2)]
            transition-all duration-200 placeholder:text-slate-500`}
          aria-label={question.label}
          aria-invalid={!!error}
          aria-describedby={`${error ? errorId : ''} ${hintId}`.trim() || undefined}
        />
      </div>
      {!error && (
        <p id={hintId} className="mt-1.5 text-[10px] text-slate-500">DD/MM/YYYY</p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-[11px] text-rose-400">{error}</p>
      )}
    </div>
  );
}

function SelectInput({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string | undefined;
  onChange: (val: string) => void;
}) {
  const options: SelectOption[] = question.options ?? [];
  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-auto pl-3 pr-8 h-12 rounded-xl text-sm text-slate-100 appearance-none
          glass border border-[var(--accent)]/25 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]
          focus:outline-none focus:border-[var(--accent)]/55 focus:bg-[var(--surface-hover)] focus:shadow-[0_0_20px_-6px_rgba(213,176,107,0.35)]
          transition-all duration-200 cursor-pointer bg-no-repeat bg-[right_0.5rem_center]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")` }}
        aria-label={question.label}
      >
        <option value="" disabled className="bg-[var(--option-bg)] text-slate-400">Select…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[var(--option-bg)] text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
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
        className="text-slate-500 hover:text-[var(--accent)] transition-colors duration-200 cursor-pointer"
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
              className="absolute z-30 left-0 top-full mt-2 w-72 sm:w-80 glass-strong rounded-xl p-3.5 shadow-2xl border border-[var(--accent)]/25"
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

    // Check date range first (1900–2100)
    const rangeError = validateDateRange(value);
    if (rangeError) {
      setErrors((prev) => ({ ...prev, [questionId]: rangeError }));
      return;
    }

    // Comprehensive inline validation (future + ordering)
    const options = DATE_FIELDS_AFTER_ACCRUAL.has(questionId)
      ? { mustBeAfter: answers.accrual_date as string | undefined, afterLabel: 'the accrual date' }
      : undefined;

    // Only pass ordering options if mustBeAfter is defined
    const error = validateDateInline(
      value,
      options?.mustBeAfter ? { mustBeAfter: options.mustBeAfter, afterLabel: options.afterLabel } : undefined
    );
    setErrors((prev) => ({ ...prev, [questionId]: error }));
  }, [answers]);

  function shouldShow(question: Question): boolean {
    if (!question.showWhen) return true;
    const depValue = answers[question.showWhen.field];
    return depValue === question.showWhen.equals;
  }

  const visibleQuestions = rule.questions.filter((q) => shouldShow(q));
  const answeredCount = visibleQuestions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== '').length;
  const totalCount = visibleQuestions.length;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between">
        <div className="h-[3px] flex-1 rounded-full bg-[var(--overlay-white-4)] overflow-hidden">
          <motion.div
            className="progress-bar h-full"
            initial={{ width: '0%' }}
            animate={{ width: totalCount > 0 ? `${(answeredCount / totalCount) * 100}%` : '0%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
        <span className="ml-3 text-[11px] text-slate-500 tabular-nums shrink-0">
          {answeredCount} of {totalCount}
        </span>
      </div>

      {/* Questions */}
      {rule.questions.map((q, i) => {
        if (!shouldShow(q)) return null;

        return (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-2xl border border-white/[0.06] bg-[var(--overlay-subtle)] p-4 glass-card"
          >
            <label className="flex items-center text-[13px] tracking-[-0.02em] text-slate-200 font-medium mb-2.5 leading-relaxed">
              <span>{q.label}</span>
              {q.required && (
                <span className="ml-1 text-rose-400" aria-label="required">*</span>
              )}
              {q.required && (
                <span className="sr-only">(required)</span>
              )}
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

            {q.type === 'select' && (
              <SelectInput
                question={q}
                value={answers[q.id] as string | undefined}
                onChange={(val) => onAnswerChange(q.id, val)}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
