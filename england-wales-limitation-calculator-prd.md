# England & Wales Limitation Period Calculator PRD

## Product
England & Wales Limitation Period Calculator

## Document Status
Draft v1

## Purpose
Build a lawyer-friendly web app that calculates likely limitation expiry dates for a selected England & Wales claim type, based on user-entered dates and selected modifiers. The product should be fast, clear, and conservative. It must never present ambiguous legal outcomes as certain.

This is a legal decision-support tool, not legal advice. The product should help users reach a better first-pass answer and identify when manual legal review is required.

## Product Goal
Create a clean, reliable, shareable limitation calculator for England & Wales that:
- handles the most common civil claim types in v1
- explains the statutory basis for the answer
- identifies common postponement and fresh-accrual scenarios
- warns when the result is uncertain and requires manual review
- is easy to extend later to India and additional claim types

## Non-Goals for v1
Do not include any of the following in v1:
- user accounts
- saved matters
- document upload or OCR
- AI-generated legal reasoning
- free-text fact analysis
- multi-jurisdiction support
- court rules, procedural deadlines, or service deadlines
- limitation rules outside the selected claim set
- case law summarization engine

## Target Users

### Primary users
- solicitors and barristers in England & Wales
- Indian lawyers handling England & Wales matters
- in-house legal teams
- paralegals and trainees

### Secondary users
- founders and operators doing initial issue spotting
- claims handlers
- law students

## Core User Problem
Lawyers repeatedly check the same limitation rules, especially for straightforward claims. Existing answers are scattered across statute pages, commentary, old blog posts, and memory. Users need a faster, cleaner, more trustworthy first-pass calculation.

## User Value Proposition
Within 30 to 60 seconds, a user should be able to:
- choose a claim type
- enter the key dates
- toggle common modifier scenarios
- see the likely expiry date
- understand the statute reference
- see remaining days or expired status
- see when the answer is uncertain and requires manual review

## Product Principles
1. Conservative over clever.
2. Explain every result.
3. Separate base rule from modifiers.
4. Never hide uncertainty.
5. Prefer a warning state over a false answer.
6. Keep the legal engine deterministic and testable.
7. Store legal rules in versioned data files, not inside UI components.

## v1 Scope

### Supported jurisdiction
- England & Wales only

### Supported claim types in v1
1. Simple contract
2. Tort, non-personal injury, standard six-year rule
3. Personal injury
4. Defamation / malicious falsehood

### Supported modifier categories in v1
1. Disability
2. Fraud / deliberate concealment / mistake postponement
3. Acknowledgment / part payment

### Supported output states
- Live and not yet expired
- Expires today
- Expired
- Cannot calculate confidently, manual review required

## Legal Coverage Model
The app must distinguish between:
- base limitation period
- accrual / start date rule
- postponement rule
- fresh accrual rule
- discretionary judicial override
- manual review trigger

The app must not flatten all of these into a single “extension” concept.

## Legal Rules Included in v1

### 1) Simple contract
- Base rule: 6 years from date cause of action accrued
- Typical start event: date of breach
- Possible modifiers in v1:
  - disability
  - fraud / concealment / mistake postponement
  - acknowledgment
  - part payment
- Common ambiguity triggers:
  - disputed breach date
  - instalment obligations
  - continuing breach
  - deed vs simple contract confusion

### 2) Tort, non-personal injury
- Base rule: 6 years from date cause of action accrued
- Typical start event: date damage accrued / cause accrued
- Possible modifiers in v1:
  - disability
  - fraud / concealment / mistake postponement
- Must flag manual review if the claim may fall within latent damage negligence rules instead of the standard rule
- Common ambiguity triggers:
  - latent damage
  - continuing tort
  - nuisance vs negligence classification issues
  - concurrent contract and tort claims with different analysis

### 3) Personal injury
- Base rule: 3 years
- Start event: later of accrual date or date of knowledge, depending on facts captured in questionnaire
- Possible modifiers in v1:
  - disability
  - fraud / concealment / mistake postponement only where legally relevant to the selected scenario
- Must include explicit warning that courts may disapply the time limit in some cases
- Common ambiguity triggers:
  - disputed date of knowledge
  - child claimant issues
  - lack of capacity issues
  - date of injury vs date of knowledge mismatch
  - fatal accident / dependency claim not covered in v1

### 4) Defamation / malicious falsehood
- Base rule: 1 year
- Typical start event: publication date
- Possible modifiers in v1:
  - limited support only
- Must include explicit warning that the court may disapply the time limit in some cases
- Common ambiguity triggers:
  - multiple publication events
  - single publication rule issues
  - online republication
  - jurisdiction and forum issues

## Legal Rules Explicitly Out of Scope for v1
These should return a warning and no calculated answer, or route to manual review:
- deeds and specialty claims
- land claims
- trusts and fraud claims as standalone claim categories
- latent damage negligence calculator under the special knowledge-based regime
- contribution claims
- fatal accidents / dependency claims
- product liability specific rules
- mortgage and secured debt timelines
- arbitration-specific time calculations
- insolvency effects
- limitation standstill agreements
- cross-border and conflict of laws issues
- claims requiring detailed case law analysis to identify accrual

## User Stories

### Primary journey
As a lawyer, I want to select a claim type and enter key dates so that I can see the likely limitation expiry date quickly.

### Modifier journey
As a lawyer, I want to apply common modifier scenarios so that I can see whether postponement or fresh accrual may affect the result.

### Trust journey
As a lawyer, I want to see the statute reference and reasoning trail so that I can trust and verify the answer.

### Safety journey
As a lawyer, I want the app to warn me when a result is uncertain so that I do not rely on an oversimplified answer.

## Functional Requirements

### FR1. Claim selection
The user must be able to choose:
- Jurisdiction: fixed to England & Wales in v1
- Claim type: one of the supported claim types

### FR2. Dynamic questionnaire
The app must show only the date fields and questions relevant to the chosen claim type.

Examples:
- Simple contract:
  - date of breach / accrual
  - was claimant under disability at accrual
  - fraud / concealment / mistake relevant
  - acknowledgment date
  - part payment date
- Personal injury:
  - date of injury / accrual
  - date of knowledge if different
  - whether claimant was under disability
  - whether user is unsure of date of knowledge

### FR3. Deterministic calculation engine
The app must calculate results from a pure rules engine with no backend dependency.

### FR4. Date handling
The app must use date-only arithmetic.
- No times
- No timezone-sensitive timestamps
- All dates treated as local calendar dates

### FR5. Result card
The app must show:
- primary expiry date
- adjusted expiry date, if modifiers change the result
- status badge: live / expires today / expired / manual review
- days remaining or days overdue
- statute reference
- short explanation in plain English

### FR6. Reason trail
The app must show a step-by-step explanation such as:
1. Selected claim type
2. Base period applied
3. Start date used
4. Modifier applied or not applied
5. Final date calculation
6. Warning notes

### FR7. Manual review states
The app must support warning states where it does not output a definitive answer.

Triggers include:
- user selects “I am unsure” on a legally material question
- claim type falls outside supported rules
- latent damage possibility is indicated
- multiple competing start dates are possible
- judicial discretion may be central to the outcome

### FR8. Statute references
Every supported rule must display:
- statute name
- section number
- short label

### FR9. Legal disclaimer
The app must display:
- not legal advice
- informational decision-support only
- verify accrual, knowledge, and exceptions independently
- seek professional review where facts are disputed or complex

### FR10. Rule versioning
Each rule file must include:
- rule id
- jurisdiction
- version number
- effective status
- statute reference
- last reviewed date
- author / reviewer field
- notes

### FR11. Copy/share
The user must be able to:
- copy result summary to clipboard
- copy the statute reference and reasoning trail

### FR12. Timeline view
The app should show a simple timeline with:
- accrual or start date
- modifier event dates
- today
- expiry date

## Non-Functional Requirements

### NFR1. Performance
- First calculation under 100 ms on client side for normal cases
- Fast enough to feel instant

### NFR2. Reliability
- deterministic outputs from the same inputs
- no silent fallbacks
- no hidden AI logic in calculations

### NFR3. Maintainability
- rules stored outside UI
- reusable calculator functions
- easy to add new claim types and jurisdictions later

### NFR4. Auditability
- each output should be reproducible from explicit inputs
- each rule should be traceable to a statute reference and rule version

### NFR5. Accessibility
- keyboard navigable
- labels on all inputs
- high-contrast status badges
- readable on desktop and mobile

## UX Requirements

### Main screen layout
1. Header
2. Disclaimer banner
3. Claim selection panel
4. Dynamic fact questionnaire
5. Calculate button
6. Result panel
7. Timeline
8. Statute / reasoning details accordion

### Interaction rules
- show helper text for legal terms like “accrual” and “date of knowledge”
- do not pre-check modifier toggles by default
- use explicit yes / no / unsure controls
- when user chooses “unsure,” shift toward manual review rather than forced calculation

### Tone
- professional
- plain English
- cautious
- no theatrical alerts
- no fake confidence

## Suggested Information Architecture

### Pages
1. Home / calculator
2. About methodology
3. Coverage and limitations
4. Changelog / legal review notes

## Data Model

### Rule object
```ts
export type Rule = {
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

### Modifier object
```ts
export type ModifierKey =
  | 'disability'
  | 'fraud_concealment_mistake'
  | 'acknowledgment'
  | 'part_payment';
```

### Questionnaire field
```ts
export type Question = {
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

### Calculation output
```ts
export type CalculationResult = {
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

## Calculation Logic Requirements

### General rules
- inputs must be validated before calculation
- invalid or incomplete date combinations must show user-friendly errors
- engine must not infer facts the user did not provide
- when multiple dates could legally matter and the user cannot resolve them, return manual review

### Disability
- support disability as a postponement-style rule where applicable to the selected claim type
- ask when disability ceased, if relevant
- if disability is ongoing and the rule cannot produce a reliable end date, return manual review or a clearly labeled provisional state

### Fraud / concealment / mistake
- model as postponement of start date, not “infinite time”
- ask for discovery date or date when facts were known / could reasonably have been known, where needed for the supported rule
- if discovery date is unknown or disputed, return manual review

### Acknowledgment / part payment
- model as fresh accrual from qualifying event where the selected rule supports it
- ask for event date
- do not assume a valid acknowledgment unless the user confirms that it was in writing and signed
- if user cannot confirm formal validity, return manual review or show unadjusted date plus warning

### Personal injury date of knowledge
- support “later of accrual or date of knowledge” logic for the v1 PI flow
- if the user cannot identify date of knowledge with reasonable confidence, return manual review
- always show warning that the court may have discretion in some cases

### Defamation
- support a base one-year calculation from publication date for straightforward cases
- if user indicates multiple publications, republication, or online repeat publication issues, return manual review
- always show warning that the court may have discretion in some cases

## Validation Rules
- all dates must be real calendar dates
- future accrual dates should be blocked or warned depending on context
- acknowledgment date must not precede original accrual date if used as a fresh-accrual event
- part payment date must not precede original accrual date if used
- discovery date used for postponement must not precede the underlying facts in a logically impossible way
- cease-disability date must not precede disability start state

## Content Requirements

### On-page disclaimer text
Draft baseline:

“This tool is an informational aid for calculating likely limitation periods under selected England & Wales rules. It is not legal advice. Limitation analysis depends on the facts, including accrual, knowledge, disability, concealment, acknowledgment, part payment, and whether a court may disapply a time limit. Always verify the result independently.”

### Coverage page text
Must explain:
- what claim types are covered
- what is not covered
- that accrual and knowledge may be legally contestable
- that the result is only as accurate as the inputs

## Analytics Requirements
Keep analytics minimal in v1.

Track only:
- selected claim type
- whether result was live / expired / manual review
- whether copy result was used

Do not track user-entered dates or facts unless a privacy policy and deliberate storage strategy exist.

## Tech Stack Recommendation
- Next.js
- TypeScript
- Tailwind CSS
- date-fns for date arithmetic
- Zod for input validation
- Vitest for rule engine tests
- Playwright for basic end-to-end flows
- Vercel for deployment

## Suggested Project Structure

```text
/app
  /page.tsx
  /about/page.tsx
  /coverage/page.tsx
  /changelog/page.tsx
/components
  ClaimSelector.tsx
  DynamicQuestionnaire.tsx
  ResultCard.tsx
  Timeline.tsx
  StatuteAccordion.tsx
  DisclaimerBanner.tsx
/lib
  /rules
    ew.simple-contract.v1.json
    ew.tort-non-pi.v1.json
    ew.personal-injury.v1.json
    ew.defamation.v1.json
  /engine
    calculate.ts
    modifiers.ts
    manualReview.ts
    explain.ts
  /validation
    calculatorSchema.ts
/types
  rules.ts
/tests
  /unit
  /e2e
```

## Example Result Copy

### Straightforward result
“Selected claim: simple contract. Base period: 6 years from accrual. Accrual date entered: 14 June 2020. No modifier changed the start date. Likely expiry date: 14 June 2026. Status: 63 days remaining.”

### Manual review result
“Selected claim: non-personal injury tort. A standard 6-year rule may apply, but you indicated possible latent damage. This tool does not calculate the special latent damage regime in v1. Manual review required.”

## Testing Strategy

### Unit tests
Create a fixture-driven test suite for every rule.

Minimum coverage:
- simple straight-line case for each claim type
- leap year date handling
- expiry today boundary
- expired by one day
- disability on and off
- fraud / concealment / mistake postponement
- acknowledgment before expiry
- acknowledgment after expiry
- part payment before expiry
- part payment after expiry
- PI later-of date logic
- manual review paths for uncertainty
- defamation multiple publication warning path
- tort latent damage warning path

### End-to-end tests
- user can complete each supported calculator flow
- user sees statute reference and explanation
- user can copy result summary
- manual review state appears when triggered

## Acceptance Criteria

### Must-have for launch
- calculator works for all 4 supported claim types
- all v1 modifiers work where supported
- rule engine is pure and covered by tests
- statute reference shown on every supported result
- manual review state implemented
- disclaimer visible on calculator page
- timeline visible for calculable outcomes
- no backend required

### Quality bar
- at least 30 robust unit tests before public launch
- no known failing tests in CI
- all rule files reviewed manually against statute before deploy

## Risks

### Legal risk
The app may be relied on too heavily despite disclaimers.

Mitigation:
- narrow v1 scope
- show warnings aggressively
- show statute references
- show manual review states generously

### Product risk
Users may expect every claim type.

Mitigation:
- be explicit about coverage
- add coverage page
- add “not covered yet” list

### Engineering risk
Rule logic may become tangled inside the UI.

Mitigation:
- keep pure rule engine
- keep legal data in separate files
- require test updates for every rule change

## Future Roadmap

### v1.1
- deeds / specialty claims
- latent damage negligence module
- fatal accident dependencies
- printable result sheet

### v1.2
- saved calculations
- shareable links
- changelog with legal review versions

### v2
- India support
- more claim types
- side-by-side jurisdiction comparison

## Build Prompt for Claude Code

```text
Build a production-ready web app called “England & Wales Limitation Period Calculator” using Next.js, TypeScript, Tailwind, Zod, date-fns, Vitest, and Playwright.

Requirements:
- No backend.
- Store legal rules in versioned JSON files under /lib/rules.
- Implement 4 claim types only:
  1. simple contract
  2. tort, non-personal injury
  3. personal injury
  4. defamation / malicious falsehood
- Implement modifiers only where supported:
  - disability
  - fraud / concealment / mistake
  - acknowledgment
  - part payment
- Build a pure calculation engine separate from UI.
- Use date-only arithmetic.
- Add dynamic forms based on claim type.
- Add a result card with:
  - primary expiry date
  - adjusted expiry date if applicable
  - status badge
  - days remaining / overdue
  - statute reference
  - reasoning trail
  - warnings
- Add manual-review states instead of giving false certainty.
- Add a simple visual timeline.
- Add accessible labels and mobile-friendly layout.
- Add About, Coverage, and Changelog pages.
- Add at least 30 meaningful tests covering straight-line cases, edge cases, and manual-review states.
- Seed the app with mock rule files and TODO markers where legal review is needed.
- Do not use AI to infer legal facts from free text.
- Do not add a database, auth, or analytics beyond minimal event hooks.

Engineering constraints:
- calculations must be deterministic
- no logic hidden inside components
- all supported outputs traceable to explicit inputs and a rule version
- prefer manual review over silent assumption
```

## Legal Review Checklist Before Launch
- verify each statute citation and section label
- verify each claim type start-date wording
- verify modifier support per claim type
- verify questionnaire language does not misstate the law
- verify manual review triggers are broad enough
- verify no unsupported category accidentally returns a confident date
- verify result copy does not imply legal advice

## Founder Decision Checklist
Before coding, decide:
1. whether to show inclusive or exclusive counting language in the UI
2. whether to display both primary and adjusted dates together or only adjusted output with reasoning below
3. whether “manual review” blocks copy/share or still allows copying a warning summary
4. whether to expose rule version numbers publicly on the result card
5. whether to launch with a visible “beta” label
