'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, BadgeCheck, BookOpenText, Sparkles } from 'lucide-react';
import { Rule, CalculationResult } from '@/types/rules';
import { getRule } from '@/lib/rules';
import { calculate } from '@/lib/engine/calculate';
import ClaimSelector from '@/components/ClaimSelector';
import DynamicQuestionnaire from '@/components/DynamicQuestionnaire';
import ResultCard from '@/components/ResultCard';
import ReasoningAccordion from '@/components/ReasoningAccordion';
import CalculationHistory from '@/components/CalculationHistory';
import { claimTypes } from '@/lib/rules';
import { addHistoryEntry, trackEvent } from '@/lib/storage';

export default function HomePage() {
  const [selectedClaim, setSelectedClaim] = useState<Rule['claimType'] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | boolean | undefined>>({});

  const rule = selectedClaim ? getRule(selectedClaim) : null;

  const handleClaimSelect = useCallback((claimType: Rule['claimType']) => {
    setSelectedClaim(claimType);
    setAnswers({});
    trackEvent({ type: 'claim_selected', claimType });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedClaim(null);
    setAnswers({});
  }, []);

  const handleRestore = useCallback((claimType: Rule['claimType'], restoredAnswers: Record<string, string | boolean | undefined>) => {
    setSelectedClaim(claimType);
    setAnswers(restoredAnswers);
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

  // Save to history and track analytics when result changes
  useEffect(() => {
    if (!result || !selectedClaim) return;
    const accrual = answers.accrual_date as string | undefined;
    if (!accrual) return;
    addHistoryEntry({
      claimType: selectedClaim,
      accrualDate: accrual,
      status: result.status,
      expiryDate: result.adjustedExpiryDate || result.primaryExpiryDate || null,
      answers,
    });
    trackEvent({ type: 'result_computed', claimType: selectedClaim, status: result.status });
  }, [result?.status, result?.primaryExpiryDate, selectedClaim]); // eslint-disable-line react-hooks/exhaustive-deps

  const accrualDate = answers.accrual_date as string | undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
      <AnimatePresence mode="wait">
        {!selectedClaim ? (
          <motion.div
            key="selector"
            exit={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            transition={{ duration: 0.28 }}
            className="space-y-8"
          >
            <section className="panel-shell overflow-hidden">
              <div className="p-6 sm:p-8 lg:p-10 relative">
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#d5b06b]/15 blur-3xl" />
                <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-[#86a6eb]/14 blur-3xl" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d5b06b]/35 bg-[#d5b06b]/10 text-[11px] tracking-[1.5px] uppercase text-[#ecd2a4]">
                    <Sparkles className="w-3 h-3" />
                    Legal Timing Intelligence
                  </div>
                  <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl leading-[0.95] text-gradient display-serif">
                    TimeBar
                  </h1>
                  <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                    A premium England & Wales limitation calculator with statute-grounded rules,
                    plain-English prompts, and defensible reasoning for each date outcome.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2.5 text-[12px]">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/12 bg-white/5 text-slate-200">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#d5b06b]" />
                      {claimTypes.length} supported claim types
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/12 bg-white/5 text-slate-200">
                      <BookOpenText className="w-3.5 h-3.5 text-[#9fbff6]" />
                      Transparent statute references
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel-shell p-5 sm:p-7">
              <ClaimSelector onSelect={handleClaimSelect} />
            </section>

            <CalculationHistory onRestore={handleRestore} />
          </motion.div>
        ) : (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.button
              type="button"
              onClick={handleBack}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-[#d5b06b] transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="font-medium">Back to Claim Types</span>
            </motion.button>

            <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-5 lg:gap-6 items-start">
              <section className="panel-shell p-5 sm:p-7">
                <div className="mb-7">
                  <p className="text-[11px] tracking-[2px] uppercase text-slate-500 font-medium">
                    {rule?.title}
                  </p>
                  <h1 className="text-2xl sm:text-3xl display-serif text-gradient mt-1">
                    Build the Limitation Timeline
                  </h1>
                  <p className="text-sm text-slate-400 mt-2">
                    Answer each question to generate an evidence-aligned deadline estimate.
                  </p>
                </div>

                {rule && (
                  <DynamicQuestionnaire
                    rule={rule}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                  />
                )}
              </section>

              <div className="space-y-4 lg:sticky lg:top-20">
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div
                      key="result-loaded"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <ResultCard
                        result={result}
                        claimType={selectedClaim}
                        accrualDate={accrualDate || ''}
                      />
                      <ReasoningAccordion result={result} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result-empty"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="panel-shell p-5 sm:p-6"
                    >
                      <h3 className="text-sm uppercase tracking-[2px] text-slate-500 mb-2">
                        Live Analysis
                      </h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        Your deadline estimate and statute reasoning will appear here as soon as the
                        required dates are entered.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="print-footer hidden text-center text-[9pt] text-gray-500 mt-8 pt-4 border-t border-gray-300">
        Generated by TimeBar — England &amp; Wales Limitation Calculator | This is not legal advice. Verify all dates independently.
      </div>
    </div>
  );
}
