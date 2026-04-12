'use client';

import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Rule, CalculationResult } from '@/types/rules';
import { getRule } from '@/lib/rules';
import { calculate } from '@/lib/engine/calculate';
import ClaimSelector from '@/components/ClaimSelector';
import DynamicQuestionnaire from '@/components/DynamicQuestionnaire';
import ResultCard from '@/components/ResultCard';
import ReasoningAccordion from '@/components/ReasoningAccordion';

export default function HomePage() {
  const [selectedClaim, setSelectedClaim] = useState<Rule['claimType'] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | boolean | undefined>>({});

  const rule = selectedClaim ? getRule(selectedClaim) : null;

  const handleClaimSelect = useCallback((claimType: Rule['claimType']) => {
    setSelectedClaim(claimType);
    setAnswers({});
  }, []);

  const handleBack = useCallback(() => {
    setSelectedClaim(null);
    setAnswers({});
  }, []);

  const handleAnswerChange = useCallback((id: string, value: string | boolean | undefined) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const result: CalculationResult | null = useMemo(() => {
    if (!selectedClaim) return null;
    const accrualDate = answers.accrual_date;
    if (!accrualDate) return null;
    return calculate({ claimType: selectedClaim, answers });
  }, [selectedClaim, answers]);

  const accrualDate = answers.accrual_date as string | undefined;

  return (
    <div className="max-w-lg mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <AnimatePresence mode="wait">
        {!selectedClaim ? (
          <motion.div
            key="selector"
            exit={{ opacity: 0, x: -24, filter: 'blur(4px)' }}
            transition={{ duration: 0.25 }}
          >
            <ClaimSelector onSelect={handleClaimSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, x: 24, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 24, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Back button */}
            <motion.button
              type="button"
              onClick={handleBack}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-blue-400 transition-colors mb-8 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="font-light">Back</span>
            </motion.button>

            {/* Claim header */}
            <div className="mb-8">
              <p className="text-[11px] tracking-[2px] uppercase text-slate-500 font-light">
                {rule?.title}
              </p>
              <h1 className="text-xl font-semibold text-slate-100 tracking-tight mt-1.5">
                Enter details
              </h1>
            </div>

            {/* Questionnaire */}
            {rule && (
              <DynamicQuestionnaire
                rule={rule}
                answers={answers}
                onAnswerChange={handleAnswerChange}
              />
            )}

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-10 space-y-3"
                >
                  <ResultCard
                    result={result}
                    claimType={selectedClaim}
                    accrualDate={accrualDate || ''}
                  />
                  <ReasoningAccordion result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
