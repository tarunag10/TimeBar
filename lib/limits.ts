export const TIMEBAR_LIMITS = {
  shareParamMaxLength: 4096,
  shareJsonMaxLength: 12000,
  answerKeyMaxLength: 80,
  answerStringMaxLength: 120,
  answerMaxCount: 40,
  historyMaxEntries: 10,
  analyticsMaxEvents: 100,
  draftMaxAgeMs: 24 * 60 * 60 * 1000,
} as const;
