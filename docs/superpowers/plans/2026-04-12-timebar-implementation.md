# TimeBar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a client-side limitation period calculator for England & Wales with 4 claim types, modifiers, and a polished dark UI.

**Architecture:** Next.js 14 App Router, fully static (no backend). Pure calculation engine reads versioned JSON rule files. Framer Motion for transitions. Tailwind for dark theme styling.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, date-fns, Zod, Vitest, Playwright

---

## File Structure

```
/app
  layout.tsx                    — root layout, dark theme, nav, disclaimer
  page.tsx                      — calculator page (main SPA flow)
  globals.css                   — Tailwind + custom dark theme vars
  /about/page.tsx               — methodology page
  /coverage/page.tsx            — coverage & limitations page
  /changelog/page.tsx           — legal review notes page
/components
  Header.tsx                    — nav bar with logo + links
  DisclaimerBanner.tsx          — persistent legal disclaimer
  ClaimSelector.tsx             — 2x2 compact grid
  DynamicQuestionnaire.tsx      — claim-specific form fields
  ResultCard.tsx                — expiry date, status badge, days
  Timeline.tsx                  — visual accrual→today→expiry
  ReasoningAccordion.tsx        — step-by-step explanation
  StatusBadge.tsx               — color-coded status pill
  CopyButton.tsx                — copy result to clipboard
/lib
  /rules
    index.ts                    — rule loader
    ew.simple-contract.v1.json
    ew.tort-non-pi.v1.json
    ew.personal-injury.v1.json
    ew.defamation.v1.json
  /engine
    calculate.ts                — main orchestrator
    modifiers.ts                — modifier application logic
    manualReview.ts             — manual review trigger checks
    explain.ts                  — reasoning trail builder
  /validation
    calculatorSchema.ts         — Zod schemas
/types
  rules.ts                      — all TypeScript types
/tests
  /unit
    calculate.test.ts
    modifiers.test.ts
    manualReview.test.ts
    explain.test.ts
    validation.test.ts
```

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

- [ ] **Step 1:** Initialize Next.js project with TypeScript and Tailwind
- [ ] **Step 2:** Install dependencies: `date-fns`, `zod`, `framer-motion`
- [ ] **Step 3:** Install dev dependencies: `vitest`, `@testing-library/react`, `playwright`
- [ ] **Step 4:** Configure Tailwind with dark theme palette colors
- [ ] **Step 5:** Create root layout with dark background, Inter font
- [ ] **Step 6:** Create placeholder home page
- [ ] **Step 7:** Verify dev server runs
- [ ] **Step 8:** Commit

---

### Task 2: Types & Rule Data

**Files:**
- Create: `types/rules.ts`, `lib/rules/ew.simple-contract.v1.json`, `lib/rules/ew.tort-non-pi.v1.json`, `lib/rules/ew.personal-injury.v1.json`, `lib/rules/ew.defamation.v1.json`, `lib/rules/index.ts`

- [ ] **Step 1:** Define all TypeScript types (Rule, ModifierKey, Question, CalculationResult)
- [ ] **Step 2:** Create Simple Contract rule JSON with all questions, statute refs, modifiers, manual review triggers
- [ ] **Step 3:** Create Tort (Non-PI) rule JSON
- [ ] **Step 4:** Create Personal Injury rule JSON
- [ ] **Step 5:** Create Defamation rule JSON
- [ ] **Step 6:** Create rule loader (index.ts) that exports all rules
- [ ] **Step 7:** Commit

---

### Task 3: Validation Schemas

**Files:**
- Create: `lib/validation/calculatorSchema.ts`, `tests/unit/validation.test.ts`

- [ ] **Step 1:** Write Zod schemas for calculator inputs (dates, booleans, claim type selection)
- [ ] **Step 2:** Write validation tests: valid dates, invalid dates, future accrual dates, date ordering constraints
- [ ] **Step 3:** Run tests, verify pass
- [ ] **Step 4:** Commit

---

### Task 4: Calculation Engine — Base Cases

**Files:**
- Create: `lib/engine/calculate.ts`, `lib/engine/explain.ts`, `tests/unit/calculate.test.ts`

- [ ] **Step 1:** Write failing tests for straight-line calculation of each claim type (4 tests)
- [ ] **Step 2:** Write failing tests for edge cases: leap year, expiry today, expired by one day (3 tests)
- [ ] **Step 3:** Implement `calculate()` function for base period calculation (no modifiers)
- [ ] **Step 4:** Implement `explain()` function that builds reasoning trail steps
- [ ] **Step 5:** Run tests, verify pass
- [ ] **Step 6:** Commit

---

### Task 5: Calculation Engine — Modifiers

**Files:**
- Create: `lib/engine/modifiers.ts`, `tests/unit/modifiers.test.ts`
- Modify: `lib/engine/calculate.ts`

- [ ] **Step 1:** Write failing tests for disability modifier on/off (4 tests, one per claim type)
- [ ] **Step 2:** Write failing tests for fraud/concealment postponement (3 tests)
- [ ] **Step 3:** Write failing tests for acknowledgment before/after expiry (2 tests)
- [ ] **Step 4:** Write failing tests for part payment before/after expiry (2 tests)
- [ ] **Step 5:** Write failing test for PI later-of-accrual-or-knowledge logic (3 tests)
- [ ] **Step 6:** Implement modifier functions: `applyDisability()`, `applyFraudPostponement()`, `applyAcknowledgment()`, `applyPartPayment()`
- [ ] **Step 7:** Integrate modifiers into main `calculate()` function
- [ ] **Step 8:** Run all tests, verify pass
- [ ] **Step 9:** Commit

---

### Task 6: Manual Review Logic

**Files:**
- Create: `lib/engine/manualReview.ts`, `tests/unit/manualReview.test.ts`
- Modify: `lib/engine/calculate.ts`

- [ ] **Step 1:** Write failing tests for manual review triggers: unsure answers, latent damage, multiple publications, disputed knowledge date (4+ tests)
- [ ] **Step 2:** Implement `checkManualReview()` that evaluates all triggers
- [ ] **Step 3:** Integrate into `calculate()` — manual review overrides confident result
- [ ] **Step 4:** Run all tests, verify pass
- [ ] **Step 5:** Commit

---

### Task 7: UI Shell — Layout, Header, Disclaimer

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`
- Create: `components/Header.tsx`, `components/DisclaimerBanner.tsx`

- [ ] **Step 1:** Build Header component (TimeBar logo, nav links: About, Coverage, Changelog)
- [ ] **Step 2:** Build DisclaimerBanner component (persistent, subtle dark banner)
- [ ] **Step 3:** Wire into root layout
- [ ] **Step 4:** Verify renders correctly in browser
- [ ] **Step 5:** Commit

---

### Task 8: Claim Selector Component

**Files:**
- Create: `components/ClaimSelector.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1:** Build compact 2x2 grid with claim type cards
- [ ] **Step 2:** Add hover/active states with blue accent borders
- [ ] **Step 3:** Wire click handler to set selected claim type in page state
- [ ] **Step 4:** Add Framer Motion fade/slide transition when selection made
- [ ] **Step 5:** Verify in browser
- [ ] **Step 6:** Commit

---

### Task 9: Dynamic Questionnaire Component

**Files:**
- Create: `components/DynamicQuestionnaire.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1:** Build form renderer that reads questions from selected rule JSON
- [ ] **Step 2:** Implement date input fields (styled dark inputs)
- [ ] **Step 3:** Implement Yes/No/Unsure toggle button groups
- [ ] **Step 4:** Implement conditional field display (showWhen logic)
- [ ] **Step 5:** Add helper text tooltips for legal terms
- [ ] **Step 6:** Wire form state into page, pass to calculation engine
- [ ] **Step 7:** Verify each claim type shows correct fields
- [ ] **Step 8:** Commit

---

### Task 10: Result Card & Status Badge

**Files:**
- Create: `components/ResultCard.tsx`, `components/StatusBadge.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1:** Build StatusBadge (green LIVE, amber EXPIRES TODAY, red EXPIRED, blue MANUAL REVIEW)
- [ ] **Step 2:** Build ResultCard with gradient background matching status color
- [ ] **Step 3:** Show primary + adjusted expiry dates, days remaining/overdue
- [ ] **Step 4:** Wire real-time calculation: result updates as form fields change
- [ ] **Step 5:** Add Framer Motion fade-up entrance animation
- [ ] **Step 6:** Verify all 4 status states render correctly
- [ ] **Step 7:** Commit

---

### Task 11: Timeline Component

**Files:**
- Create: `components/Timeline.tsx`
- Modify: `components/ResultCard.tsx`

- [ ] **Step 1:** Build horizontal timeline: accrual dot (blue), today dot (amber), expiry dot (green/red)
- [ ] **Step 2:** Calculate proportional positions based on date ranges
- [ ] **Step 3:** Add gradient fill line between dots
- [ ] **Step 4:** Add modifier event dots if applicable
- [ ] **Step 5:** Add date labels below dots
- [ ] **Step 6:** Add Framer Motion animation on timeline changes
- [ ] **Step 7:** Verify with different date ranges
- [ ] **Step 8:** Commit

---

### Task 12: Reasoning Accordion & Copy Button

**Files:**
- Create: `components/ReasoningAccordion.tsx`, `components/CopyButton.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1:** Build collapsible accordion showing explanation steps and statute refs
- [ ] **Step 2:** Add smooth height animation for expand/collapse
- [ ] **Step 3:** Build CopyButton that formats result as structured text
- [ ] **Step 4:** Handle manual review copy format (includes warning prominently)
- [ ] **Step 5:** Verify copy works for all result states
- [ ] **Step 6:** Commit

---

### Task 13: Static Pages (About, Coverage, Changelog)

**Files:**
- Create: `app/about/page.tsx`, `app/coverage/page.tsx`, `app/changelog/page.tsx`

- [ ] **Step 1:** Build About page (methodology, approach, how the tool works)
- [ ] **Step 2:** Build Coverage page (supported claim types, explicit exclusions list, input accuracy note)
- [ ] **Step 3:** Build Changelog page (initial version entry, legal review notes)
- [ ] **Step 4:** Verify navigation from header works
- [ ] **Step 5:** Commit

---

### Task 14: Responsive & Accessibility

**Files:**
- Modify: all components as needed

- [ ] **Step 1:** Test and fix mobile layout (full-width, touch targets ≥44px)
- [ ] **Step 2:** Add proper ARIA labels to all form inputs
- [ ] **Step 3:** Verify keyboard navigation through entire flow
- [ ] **Step 4:** Test high-contrast status badges
- [ ] **Step 5:** Commit

---

### Task 15: Polish & Final Integration

**Files:**
- Modify: `app/page.tsx`, various components

- [ ] **Step 1:** Add page transition animations (claim select → questionnaire → result)
- [ ] **Step 2:** Add "← Back" navigation with reverse animation
- [ ] **Step 3:** Add subtle hover effects on interactive elements
- [ ] **Step 4:** Final visual review — spacing, typography, color consistency
- [ ] **Step 5:** Commit

---

### Task 16: Deployment Configuration

**Files:**
- Create/modify: `next.config.js`, `vercel.json` (if needed)

- [ ] **Step 1:** Configure Next.js for static export if needed
- [ ] **Step 2:** Verify build succeeds: `npm run build`
- [ ] **Step 3:** Verify production build locally: `npm run start`
- [ ] **Step 4:** Commit final
