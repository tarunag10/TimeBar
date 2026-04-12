# TimeBar — Design Specification

## Overview

TimeBar is a client-side limitation period calculator for England & Wales. It helps lawyers quickly calculate likely limitation expiry dates for common civil claim types, with full statute references, reasoning trails, and explicit uncertainty handling.

**Brand:** TimeBar  
**Subtitle:** England & Wales Limitation Calculator  
**Visual style:** Dark & Precise (dark backgrounds, blue accents, sharp typography)  
**Deployment:** Vercel (static)

## Design Decisions

| Decision | Choice |
|----------|--------|
| Date counting | Exclusive (standard English law — accrual date excluded) |
| Date display | Show both primary and adjusted expiry dates |
| Copy on manual review | Allowed, with warning text included |
| Rule version visibility | Hidden from users (internal only) |
| Beta label | None — disclaimer suffices |
| Claim selector | Compact 2x2 grid, direct action (no intermediate detail panel) |
| Architecture | Single-page flow with animated transitions |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Date arithmetic:** date-fns
- **Validation:** Zod
- **Testing:** Vitest (unit), Playwright (e2e)
- **Deployment:** Vercel

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Calculator — single-page flow |
| `/about` | Methodology and approach explanation |
| `/coverage` | Supported claim types, explicit exclusions |
| `/changelog` | Legal review notes and rule update history |

## Architecture

### Separation of concerns

```
UI Layer (React components)
    ↓ calls
Calculation Engine (pure functions, no React)
    ↓ reads
Rule Data (versioned JSON files)
```

- **UI components** handle rendering, animation, and user interaction only
- **Calculation engine** is pure: same inputs always produce same outputs, no side effects
- **Rule data** is stored in versioned JSON files, never embedded in components

### Project structure

```
/app
  /page.tsx                    — calculator page
  /about/page.tsx              — methodology
  /coverage/page.tsx           — coverage & limitations
  /changelog/page.tsx          — legal review notes
  /layout.tsx                  — root layout with nav, disclaimer
/components
  ClaimSelector.tsx            — 2x2 compact grid
  DynamicQuestionnaire.tsx     — claim-specific form fields
  ResultCard.tsx               — expiry date, status badge, days remaining
  Timeline.tsx                 — visual timeline (accrual → today → expiry)
  ReasoningAccordion.tsx       — step-by-step explanation + statute refs
  DisclaimerBanner.tsx         — persistent legal disclaimer
  StatusBadge.tsx              — color-coded status indicator
  CopyButton.tsx               — copy result to clipboard
/lib
  /rules
    ew.simple-contract.v1.json
    ew.tort-non-pi.v1.json
    ew.personal-injury.v1.json
    ew.defamation.v1.json
  /engine
    calculate.ts               — main calculation orchestrator
    modifiers.ts               — disability, fraud, acknowledgment, part payment
    manualReview.ts            — manual review trigger evaluation
    explain.ts                 — reasoning trail generator
  /validation
    calculatorSchema.ts        — Zod schemas for all inputs
/types
  rules.ts                     — TypeScript types for rules, modifiers, results
/tests
  /unit                        — Vitest fixture-driven tests
  /e2e                         — Playwright flows
```

## Calculator Flow

### State 1: Claim Selection

- Header: "TimeBar" logo + nav links (About, Coverage, Changelog)
- Disclaimer banner: persistent, subtle, always visible
- Hero text: "England & Wales" (small caps) + "Limitation Calculator"
- Compact 2x2 grid of claim type cards:
  - Simple Contract — "6 yrs · breach"
  - Tort (Non-PI) — "6 yrs · accrual"
  - Personal Injury — "3 yrs"
  - Defamation — "1 yr · publication"
- Clicking a card transitions directly to the questionnaire (animated slide/fade)

### State 2: Questionnaire

- Header shows selected claim type + "← Back" link
- Dynamic form fields based on claim type (only relevant fields shown)
- Yes / No / Unsure toggle buttons for boolean questions
- Date inputs for accrual, knowledge, modifier dates
- Helper text (tooltip/info icon) for legal terms like "accrual" and "date of knowledge"
- No modifier toggles pre-checked by default

### State 3: Result

- Appears in real-time as user fills fields (no "Calculate" button needed — but include one as a fallback for clarity)
- **Result card** with gradient background matching status color:
  - Status badge: LIVE (green), EXPIRES TODAY (amber), EXPIRED (red), MANUAL REVIEW (blue)
  - Primary expiry date (large, prominent)
  - Adjusted expiry date (if modifiers changed it), shown alongside primary
  - Days remaining or days overdue
  - Base date label (e.g., "Base: 14 Jun 2026 · No modifiers")
- **Mini timeline** below result:
  - Accrual date (blue dot, left)
  - Today (amber dot, proportional position)
  - Expiry date (green/red dot, right)
  - Gradient line connecting them
  - Modifier event dates shown as intermediate dots if applicable
- **Reasoning accordion** below timeline:
  - Step-by-step explanation (selected claim → base period → start date → modifiers → final date → warnings)
  - Statute reference (act, section, label)
  - Expandable/collapsible
- **Copy button**: copies structured result summary to clipboard

## Data Model

### Rule object (JSON files)

```typescript
type Rule = {
  id: string;
  jurisdiction: 'england_wales';
  claimType: 'simple_contract' | 'tort_non_pi' | 'personal_injury' | 'defamation';
  title: string;
  statuteRef: {
    act: string;
    section: string;
    label: string;
  };
  version: string;
  lastReviewed: string;
  basePeriod: {
    unit: 'years' | 'months' | 'days';
    value: number;
  };
  startRule: 'accrual' | 'publication' | 'later_of_accrual_or_knowledge';
  supportedModifiers: ModifierKey[];
  questions: Question[];
  manualReviewTriggers: string[];
  notes?: string[];
};
```

### Modifier keys

```typescript
type ModifierKey =
  | 'disability'
  | 'fraud_concealment_mistake'
  | 'acknowledgment'
  | 'part_payment';
```

### Question definition

```typescript
type Question = {
  id: string;
  type: 'date' | 'boolean' | 'select';
  label: string;
  helpText?: string;
  required: boolean;
  showWhen?: {
    field: string;
    equals: string | boolean;
  };
};
```

### Calculation result

```typescript
type CalculationResult = {
  status: 'live' | 'expires_today' | 'expired' | 'manual_review';
  primaryExpiryDate?: string;
  adjustedExpiryDate?: string;
  daysRemaining?: number;
  statuteRefs: { act: string; section: string; label: string }[];
  explanationSteps: string[];
  warnings: string[];
  appliedModifiers: string[];
  ruleVersion: string;
};
```

## Supported Claim Types

### 1. Simple Contract

- Base: 6 years from accrual (date of breach)
- Modifiers: disability, fraud/concealment/mistake, acknowledgment, part payment
- Manual review triggers: disputed breach date, instalment obligations, continuing breach, deed vs simple contract confusion

### 2. Tort (Non-PI)

- Base: 6 years from accrual (date damage accrued)
- Modifiers: disability, fraud/concealment/mistake
- Manual review triggers: latent damage, continuing tort, nuisance vs negligence, concurrent contract/tort

### 3. Personal Injury

- Base: 3 years from later of accrual or date of knowledge
- Modifiers: disability, fraud/concealment/mistake (where relevant)
- Always shows warning: court may disapply time limit (s.33 discretion)
- Manual review triggers: disputed knowledge date, child claimant, lack of capacity, date mismatch

### 4. Defamation / Malicious Falsehood

- Base: 1 year from publication date
- Modifiers: limited support only
- Always shows warning: court may disapply time limit
- Manual review triggers: multiple publications, single publication rule issues, online republication

## Modifier Logic

### Disability

- Postponement-style: time does not run while claimant is under disability
- Ask: was claimant under disability at accrual? When did disability cease?
- If ongoing and no reliable end date → manual review or provisional state

### Fraud / Concealment / Mistake

- Modeled as postponement of start date (not "infinite time")
- Ask: discovery date or date facts were/could reasonably have been known
- If discovery date unknown or disputed → manual review

### Acknowledgment

- Fresh accrual from qualifying event (where rule supports it)
- Ask: event date + was it in writing and signed?
- If formal validity unconfirmed → manual review or unadjusted date with warning
- Acknowledgment date must not precede original accrual date

### Part Payment

- Fresh accrual from qualifying event (where rule supports it)
- Ask: payment date
- Part payment date must not precede original accrual date

## Validation Rules

- All dates must be real calendar dates
- Future accrual dates: blocked or warned
- Acknowledgment/part payment dates must not precede accrual date
- Discovery date must not precede underlying facts
- Cease-disability date must not precede disability start

## Visual Design

### Color palette

- Background: `#0f172a` (slate-900)
- Surface: `#1e293b` (slate-800)
- Border: `#334155` (slate-700)
- Text primary: `#e2e8f0` (slate-200)
- Text secondary: `#94a3b8` (slate-400)
- Text muted: `#64748b` (slate-500)
- Accent: `#3b82f6` (blue-500)
- Selected state: `#1e3a5f` bg + `#2563eb55` border
- Live/green: `#22c55e` / `#4ade80`
- Amber/today: `#f59e0b`
- Red/expired: `#ef4444`
- Blue/manual review: `#3b82f6`

### Typography

- System font stack (Inter if available via Google Fonts)
- Headings: semibold 600
- Labels: small caps, letter-spacing, uppercase
- Body: regular weight, high contrast against dark bg

### Animations (Framer Motion)

- Claim selection → questionnaire: slide + fade transition (~300ms)
- Result card appearance: fade up (~200ms)
- Timeline: animated gradient fill as dates change
- Status badge: subtle pulse on state change
- Accordion expand: smooth height animation
- Back navigation: reverse slide animation

### Responsive

- Desktop: centered max-width container (~640px)
- Mobile: full-width with proper touch targets (min 44px)
- Claim grid: 2x2 on all sizes (cards are small enough)

## Disclaimer

Persistent banner on calculator page:

> "This tool is an informational aid for calculating likely limitation periods under selected England & Wales rules. It is not legal advice. Limitation analysis depends on the facts, including accrual, knowledge, disability, concealment, acknowledgment, part payment, and whether a court may disapply a time limit. Always verify the result independently."

## Copy/Share Output

### Standard result format

```
TimeBar — Limitation Calculator
Selected claim: Simple Contract
Base period: 6 years from accrual
Accrual date: 14 June 2020
Modifiers: None applied
Likely expiry: 14 June 2026
Status: 63 days remaining
Statute: Limitation Act 1980, s.5

This is an informational calculation, not legal advice.
```

### Manual review format

```
TimeBar — Limitation Calculator
Selected claim: Tort (Non-PI)
MANUAL REVIEW REQUIRED
Reason: Possible latent damage indicated. This tool does not calculate the special latent damage regime in v1.
Base period (if standard rule applied): 6 years from accrual

This is an informational calculation, not legal advice.
```

## Testing Strategy

### Unit tests (Vitest, minimum 30)

- Straight-line case for each claim type (4 tests)
- Leap year date handling (2 tests)
- Expiry today boundary (1 test)
- Expired by one day (1 test)
- Disability on/off per claim type (4 tests)
- Fraud/concealment/mistake postponement (3 tests)
- Acknowledgment before/after expiry (2 tests)
- Part payment before/after expiry (2 tests)
- PI later-of date logic (3 tests)
- Manual review triggers for each claim type (4 tests)
- Defamation multiple publication warning (1 test)
- Tort latent damage warning (1 test)
- Validation: future dates, invalid dates, date ordering (3+ tests)

### E2E tests (Playwright)

- Complete each claim type flow end-to-end
- Verify statute reference and explanation visible
- Verify copy result works
- Verify manual review state appears when triggered

## Analytics (Minimal)

Track only:
- Selected claim type
- Result status (live/expired/manual review)
- Copy button usage

No user dates or facts tracked.

## Acceptance Criteria

- Calculator works for all 4 claim types
- All v1 modifiers functional where supported
- Rule engine is pure and fully tested (30+ tests)
- Statute reference on every result
- Manual review state implemented
- Disclaimer visible
- Timeline visible for calculable outcomes
- No backend dependency
- Keyboard navigable, accessible labels
- Mobile-friendly
