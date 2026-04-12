'use client';

import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <AnimatePresence mode="wait">
        {!selectedClaim ? (
          <motion.div
            key="selector"
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ClaimSelector onSelect={handleClaimSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              onClick={handleBack}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors mb-6 cursor-pointer"
            >
              &larr; Back to claim types
            </button>

            <div className="mb-6">
              <p className="text-[10px] tracking-[1.5px] uppercase text-slate-500">
                {rule?.title}
              </p>
              <h1 className="text-lg font-semibold text-slate-100 mt-1">
                Enter details
              </h1>
            </div>

            {rule && (
              <DynamicQuestionnaire
                rule={rule}
                answers={answers}
                onAnswerChange={handleAnswerChange}
              />
            )}

            <AnimatePresence>
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 space-y-3"
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
