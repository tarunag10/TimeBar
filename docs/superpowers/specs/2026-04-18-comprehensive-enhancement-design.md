# TimeBar Comprehensive Enhancement Design

**Date:** 2026-04-18
**Status:** Approved
**Audience:** Solo practitioners / small law firms (England & Wales)
**Monetization:** Architecture supports free or freemium (undecided)
**Jurisdictions:** England & Wales only (multi-jurisdiction deferred)

---

## Overview

A phased plan to make TimeBar a robust, professional-grade limitation calculator. Three phases, each shipping a usable improvement:

1. **Phase 1 — Trust & Foundation:** Professional output + technical hardening
2. **Phase 2 — Power User Features:** Capabilities that differentiate
3. **Phase 3 — Ecosystem & Polish:** Completeness + professional edge

This plan synthesizes the existing feature roadmap (FEATURE-ROADMAP.md) with 9 newly identified gaps: input auto-save, guided onboarding, save-as-template, deadline reminders, mobile responsiveness audit, WCAG 2.1 AA audit, API rate limiting, iCal improvements, and SEO/structured data.

---

## Phase 1 — Trust & Foundation

### Goal

Make TimeBar reliable enough that a lawyer would stake their workflow on it. Two pillars: output that looks professional, and infrastructure that doesn't break.

### 1.1 PDF Export

**What:** A styled, printable PDF report suitable for file notes.

**Architecture:**
- Dedicated `/report` route with print-optimized CSS (`@media print`)
- No additional dependency (`@react-pdf/renderer` rejected — heavier than needed, browser print-to-PDF is sufficient for this audience)
- Route receives state via URL search params (reuse existing `lz-string` share encoding)

**Content included:**
- Result summary (status, expiry date, days remaining, urgency, confidence)
- Scenario timelines (earliest risk, calculated, latest arguable)
- Reasoning trail (all explanation steps)
- Applied modifiers and warnings
- Procedural milestones with target dates
- Statute references
- Disclaimer: "This is not legal advice" — prominent, repeated in header/footer
- Generated timestamp and TimeBar version
- "Not legal advice" watermark (diagonal, low-opacity background text)

**Print stylesheet specifics:**
- White background, black text, no glassmorphism effects
- Header: TimeBar logo + "Limitation Period Report"
- Footer: disclaimer + page number + generated timestamp
- Hide: navigation, theme toggle, share/copy/calendar buttons
- Force page breaks before scenario timelines and procedural milestones sections

### 1.2 Input Auto-Save / Draft Recovery

**What:** Persist in-progress answers to localStorage so closing the tab doesn't lose work.

**Behavior:**
- On every answer change, debounce (500ms) and save `{ claimType, answers, timestamp }` to `localStorage` under key `timebar_draft`
- On page load, check for a draft. If found and less than 24 hours old, show a dismissible banner: "Resume your previous calculation?" with Restore / Dismiss buttons
- Restore hydrates claim type and answers into state
- Dismiss clears the draft from localStorage
- Draft is cleared when a calculation completes successfully (result is computed)
- Draft is NOT cleared when claim type changes (allows switching and comparing without losing work)

**Storage key:** `timebar_draft`
**Schema:** `{ claimType: string, answers: Record<string, string | boolean | undefined>, timestamp: number }`

### 1.3 Guided Onboarding

**What:** First-visit contextual help that explains claim type selection, what modifiers mean, and how to read results.

**Approach:** Lightweight — no tooltip library, no overlay tour. Instead:
- On first visit (check `localStorage` flag `timebar_onboarded`), show inline help cards:
  - Above ClaimSelector: "Start by choosing your claim type. Not sure? 'Simple contract' and 'Tort (non-PI)' are the most common."
  - Above DynamicQuestionnaire date input: "Enter the date the cause of action accrued — this is when the breach or harm occurred."
  - Above modifier toggles: "Modifiers can extend or restart the limitation period. Toggle any that apply to your facts."
- Help cards have a "Got it" dismiss button that hides them permanently (sets `timebar_onboarded` in localStorage)
- A "Show help" link in the Header resets the flag and re-shows the cards

**No tooltip library.** Simple conditional rendering with a `showOnboarding` state derived from localStorage.

### 1.4 E2E Tests with Playwright

**What:** End-to-end tests for critical user flows.

**Test cases:**
1. Select claim type → fill accrual date → get result → verify expiry date displayed
2. Toggle a modifier → verify adjusted expiry date changes
3. Share button → verify URL contains `?s=` parameter
4. Navigate to `/report` with share state → verify print layout renders
5. History: complete a calculation → verify it appears in CalculationHistory
6. Theme toggle: switch theme → verify `data-theme` attribute changes
7. Draft recovery: fill partially → reload → verify "Resume" banner appears
8. Error state: enter invalid date → verify error message shown

**Infrastructure:**
- Add `@playwright/test` as devDependency
- Add `playwright.config.ts` with `webServer` pointing to `npm run dev`
- Add `e2e/` directory at project root
- Add `npm run test:e2e` script
- Add Playwright to CI workflow (after build step)

### 1.5 Error Boundaries

**What:** React error boundaries so a crash in one section doesn't take down the page.

**Boundaries:**
- Wrap `ResultCard` — most complex component, most likely to hit edge cases
- Wrap `CalculationHistory` — depends on localStorage which can be corrupted
- Wrap `DynamicQuestionnaire` — dynamic rendering based on rule data
- Each boundary shows a friendly message: "Something went wrong with this section. Try refreshing the page." with a "Retry" button that resets the boundary

**Implementation:** Single reusable `ErrorBoundary` component in `components/ErrorBoundary.tsx`. Class component (error boundaries require class components in React).

### 1.6 Mobile Responsiveness Audit & Fixes

**What:** Verify and fix the glassmorphism UI on small screens.

**Audit checklist:**
- ClaimSelector dropdown usable on 320px width
- DynamicQuestionnaire date inputs don't overflow
- ResultCard: expiry date text scales down, action buttons stack vertically on mobile
- Timeline component: horizontal scroll or stacked layout on narrow screens
- Header: navigation items collapse to hamburger or stack
- Print button, share button, copy button: touch targets minimum 44x44px
- Modal/overlay content doesn't extend beyond viewport
- Test on: iPhone SE (375px), iPhone 14 (390px), iPad Mini (768px)

### 1.7 WCAG 2.1 AA Accessibility Audit

**What:** Ensure TimeBar meets WCAG 2.1 AA for professional use.

**Audit areas:**
- **Color contrast:** All text meets 4.5:1 ratio (both themes). Verify glassmorphism overlays don't reduce contrast below threshold
- **Focus management:** Tab order is logical through claim selector → questions → result. Focus moves to result card after calculation
- **Screen reader:** All form inputs have associated labels. Result status is announced via `aria-live` region. Timeline has `aria-label` descriptions
- **Keyboard:** All interactive elements reachable by keyboard. Escape closes any open accordions/modals
- **Skip links:** Verify existing skip-to-main-content link works
- **Motion:** Respect `prefers-reduced-motion` — disable Framer Motion animations

### 1.8 Input Validation Polish

**What:** Better error messages and date sanity checks.

**Improvements:**
- Date range validation: reject dates before 1900 or after 2100
- Accrual date cannot be in the future (with warning, not hard block — some claim types have future-dated accrual)
- Clear, specific error messages: "Enter the date the cause of action accrued" not "Required field"
- Required-field indicators: red asterisk + "Required" text for screen readers
- Inline validation on blur (not just on submit)
- Date format hint below input: "DD/MM/YYYY" (match legal convention, not US format)

---

## Phase 2 — Power User Features

### Goal

Turn TimeBar from a calculator into a workflow tool that solo practitioners choose over manual methods.

### 2.1 Side-by-Side Claim Comparison

**What:** Run two claim types on the same facts simultaneously.

**Use case:** Lawyers often don't know whether a claim is contract or tort upfront. They need to compare limitation periods for each classification.

**UI:**
- "Compare with another claim type" button on the ResultCard
- Splits the view: two ResultCards, each with its own claim type but sharing the same accrual date and common answers
- Modifier toggles are independent per claim type (disability may apply to one but not the other)
- Difference highlighting: if expiry dates differ, highlight the delta in days and show which is more favorable
- Mobile: stacked vertically with a separator. Desktop: side-by-side with a shared date column

**State:**
- `comparisonMode: boolean`
- `secondaryClaimType: Rule['claimType'] | null`
- `secondaryAnswers: Record<string, string | boolean | undefined>`
- `secondaryResult: CalculationResult | null`
- Shared answers (accrual date) sync between primary and secondary

**Exit comparison:** "Exit comparison" button returns to single-claim view

### 2.2 Batch Calculator (CSV Upload)

**What:** Upload a CSV of cases, get a table of limitation results.

**CSV format:**
```
claim_type,accrual_date,disability,fraud_concealment,acknowledgment,part_payment
simple_contract,2020-06-14,false,false,false,false
personal_injury,2021-03-01,true,false,false,false
```

**Flow:**
1. Upload CSV via file input (drag-and-drop optional)
2. Parse and validate each row (show errors per row)
3. Run calculation engine on each valid row
4. Display results table: claim type, accrual date, expiry date, status, days remaining, urgency
5. Sort/filter by status, urgency, or days remaining
6. Export results as CSV (same columns + result fields)

**Limits:**
- Max 100 rows per upload (prevent browser hang)
- Validation: reject unknown claim types, invalid dates
- Progress indicator for large batches

**Route:** New `/batch` page, linked from Header navigation

### 2.3 API Route (`/api/calculate`)

**What:** POST endpoint wrapping the calculation engine for programmatic access.

**Endpoint:** `POST /api/calculate`

**Request body:**
```json
{
  "claimType": "simple_contract",
  "answers": {
    "accrual_date": "2020-06-14",
    "disability": false,
    "fraud_concealment": false
  }
}
```

**Response:** Same shape as `CalculationResult` type, wrapped in:
```json
{
  "success": true,
  "result": { ... },
  "meta": {
    "ruleVersion": "1.0",
    "calculatedAt": "2026-04-18T10:30:00Z"
  }
}
```

**Error response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Unknown claim type: 'fake_type'",
    "details": [ ... ]
  }
}
```

**Validation:** Reuse existing Zod schema (`calculatorInputSchema` or equivalent)

**Rate limiting:** In-memory sliding window — 60 requests per minute per IP. Returns `429 Too Many Requests` with `Retry-After` header.

**Authentication:** Optional `X-API-Key` header. If no key configured, endpoint is open. This allows future freemium gating without changing the API shape.

**CORS:** Allow all origins (public API). Can be restricted later.

### 2.4 Keyboard Navigation Flow

**What:** Power-user keyboard shortcuts for fast operation.

**Shortcuts:**
| Key | Action |
|-----|--------|
| `Ctrl+K` / `Cmd+K` | Focus claim type selector |
| `Ctrl+Enter` | Calculate (submit current form) |
| `Ctrl+P` | Open PDF / print view |
| `Ctrl+Shift+S` | Copy share link |
| `Ctrl+Shift+C` | Copy result to clipboard |
| `?` | Toggle keyboard shortcut overlay |
| `Escape` | Close any open overlay/accordion |

**Implementation:**
- Global `useEffect` with `keydown` listener in `page.tsx`
- Shortcut overlay component: semi-transparent modal listing all shortcuts
- Shortcuts only active when no text input is focused (prevent conflicts)
- `aria-keyshortcuts` attributes on relevant buttons

### 2.5 Save as Template

**What:** Save a claim type + modifier combination for one-click reuse.

**Flow:**
1. After computing a result, show "Save as template" button
2. Modal: enter a template name (e.g., "Standard breach — no modifiers")
3. Saves to localStorage: `timebar_templates` array
4. Template stores: `{ id, name, claimType, defaultAnswers (modifiers only, not dates), createdAt }`
5. In ClaimSelector, show a "Templates" section above claim types with saved templates
6. Clicking a template pre-fills claim type and modifier toggles, user still enters dates

**Limits:**
- Max 20 templates
- Edit name, delete template from a templates management section (accessible from Header or About page)

### 2.6 Deadline Reminders

**What:** Browser notifications before a limitation date expires.

**Flow:**
1. After calculation shows a "live" result, show "Set reminder" button
2. User picks reminder intervals: 90 days, 30 days, 7 days, 1 day before expiry (checkboxes, multiple allowed)
3. Requests `Notification` API permission if not already granted
4. Stores reminder in localStorage: `timebar_reminders` array with `{ id, claimType, expiryDate, reminderDates[], fired[] }`
5. On each page load, check if any reminder date has passed and hasn't been fired — show notification
6. Notifications include: claim type, expiry date, days remaining, "Open TimeBar" action

**Limitations:**
- Only works if user visits the site (no push notifications without a service worker + push subscription — that's Phase 3 PWA territory)
- Clear messaging: "Reminders only trigger when you visit TimeBar"

### 2.7 Component Tests

**What:** React Testing Library tests for key UI components.

**Coverage targets:**
- `ClaimSelector` — renders all claim types, fires selection callback, keyboard navigation
- `DynamicQuestionnaire` — renders questions for a rule, conditional show/hide, date input validation
- `ResultCard` — renders all statuses (live, expired, expires_today, manual_review), displays correct dates, shows/hides modifiers
- `ShareButton` — generates share URL, copies to clipboard
- `CopyButton` — formats result text, copies to clipboard
- `StatusBadge` — renders correct variant for each status
- `Timeline` — renders with valid dates, handles edge cases (same day accrual/expiry)

### 2.8 iCal Export Improvements

**What:** Add VALARM reminders to the exported .ics file.

**Changes:**
- Add 3 VALARM components to the VEVENT: 30 days before, 7 days before, 1 day before
- Each alarm: `ACTION:DISPLAY`, `DESCRIPTION: TimeBar: [claim type] limitation expires in [X] days`
- Add `CATEGORIES:Legal,Limitation` to the event
- Add `PRIORITY:1` for urgent/critical urgency levels

### 2.9 SEO / Structured Data

**What:** Improve search engine discoverability.

**Changes:**
- Add JSON-LD `SoftwareApplication` schema to `layout.tsx`:
  - `name: "TimeBar"`, `applicationCategory: "LegalTechnology"`, `operatingSystem: "Web"`
  - `description`, `url`, `offers` (free)
- OpenGraph meta tags: `og:title`, `og:description`, `og:image` (screenshot of calculator), `og:type: website`
- Twitter card meta tags
- Canonical URL on all pages

---

## Phase 3 — Ecosystem & Polish

### Goal

Round out TimeBar into a fully mature product that feels complete and trustworthy.

### 3.1 PWA Install

**What:** Progressive Web App for offline use and native app feel.

**Implementation:**
- `next-pwa` or manual service worker registration
- Web app manifest: `name`, `short_name`, `icons` (192px, 512px), `theme_color`, `background_color`, `display: standalone`
- Service worker caches: app shell, CSS, JS, rule JSON files
- Offline support: serve cached rules for previously loaded claim types. Show "offline" badge. New claim types require network.
- "Add to home screen" prompt: show on 3rd visit if not already installed (respect `beforeinstallprompt` event)
- Push notification subscription (enhances Phase 2 deadline reminders): register push endpoint, send reminder notifications server-side via web push

### 3.2 Feedback / Report-an-Issue Widget

**What:** Lightweight in-app issue reporting.

**UI:** Floating button (bottom-right) with a slide-up form:
- Fields: issue type (Bug / Incorrect result / Suggestion / Other), free-text description, current page (auto-filled), current claim type (auto-filled if on calculator)
- Optional: screenshot upload (canvas capture of current view)
- Submit target: configurable — GitHub Issues API (preferred), email webhook, or localStorage queue for manual review

**Submission via GitHub Issues API:**
- Create issue with labels: `user-feedback`, `[issue-type]`
- Body includes: description, page, claim type, browser info, TimeBar version
- Requires a GitHub token (stored as env variable on Vercel, not exposed client-side)
- Client sends POST to `/api/feedback` Next.js route, which proxies to GitHub API

### 3.3 Rule Version Diff Viewer

**What:** Show what changed between rule JSON versions on the changelog page.

**Implementation:**
- Store historical rule versions alongside current: `lib/rules/history/[claimType]/v[X.Y].json`
- Each rule file already has a `version` field — use this as the version key
- Diff algorithm: custom shallow object comparison (no need for `jsondiffpatch` — rule objects are flat enough)
- Diff UI on changelog page:
  - Dropdown: select claim type, select version pair to compare
  - Color-coded: green for additions, red for removals, amber for changes
  - Fields shown: base period, start rule, longstop period, supported modifiers, questions, manual review triggers
  - Plain-English summary: "Base period changed from 3 years to 6 years"

### 3.4 Interactive Timeline

**What:** Visual, explorable timeline replacing the current static one.

**Design:**
- Horizontal axis: time from accrual date to furthest scenario expiry
- Plotted markers: accrual date, modifier events (acknowledgment date, etc.), base expiry, adjusted expiry, longstop date, procedural milestones
- Today marker: vertical dashed line
- Hover on any marker: tooltip with date, description, and days from today
- Zoom: mouse wheel or pinch to zoom into specific periods
- Risk bands: background color bands (green → amber → red) based on days remaining

**Implementation:**
- Canvas-based or SVG — no charting library to avoid bundle bloat
- SVG preferred for accessibility (elements can have `aria-label`)
- Responsive: on mobile, switch to vertical timeline (accrual at top, expiry at bottom)

### 3.5 Analytics Dashboard Improvements

**What:** Richer analytics for firms tracking usage patterns.

**New charts/metrics:**
- Claim type distribution (pie/donut chart)
- Usage over time (line chart, last 30 days)
- Most commonly applied modifiers (bar chart)
- Average days remaining at time of check (useful metric — are users checking early or late?)
- Status distribution (live vs expired vs manual review)

**Implementation:**
- SVG-based charts (no charting library — keep bundle small)
- Export analytics as CSV button
- Date range filter (7d, 30d, 90d, all time)

### 3.6 Performance Audit

**What:** Lighthouse CI and bundle optimization.

**Actions:**
- Add Lighthouse CI to GitHub Actions (run on PRs, fail if score drops below 90)
- Bundle analysis: identify and lazy-load heavy components
  - Framer Motion: dynamic import for animation-heavy components
  - Timeline/Interactive Timeline: lazy-load (not needed on initial paint)
  - CalculationHistory: lazy-load (below the fold)
- Image optimization: ensure favicon and any future images use next/image
- Font optimization: verify Manrope and display fonts are subset and preloaded

### 3.7 API Rate Limiting Hardening

**What:** More resilient rate limiting for the API route.

**Migration path:**
- Phase 2 ships with in-memory rate limiting (simple Map-based sliding window)
- Phase 3: if usage grows, migrate to Upstash Redis (`@upstash/ratelimit`)
  - Persistent across serverless cold starts
  - Distributed across Vercel edge functions
- Add usage logging: track API calls per key, per IP, per claim type
- Add `/api/health` endpoint returning uptime, version, rate limit status

### 3.8 Comprehensive Test Coverage

**What:** Target 80%+ coverage across engine, components, and API route.

**Additions:**
- API route tests (vitest): valid input, invalid input, rate limiting, auth
- Share/decode round-trip tests
- Playwright visual regression tests: capture screenshots of calculator in both themes, compare against baselines
- Coverage reporting in CI (vitest `--coverage`, fail PR if coverage drops below threshold)

---

## Cross-Cutting Concerns

### Data Storage Strategy

All user data remains in localStorage (no server-side storage). Keys:

| Key | Purpose | Max entries | Phase |
|-----|---------|-------------|-------|
| `timebar_history` | Calculation history | 10 | Existing |
| `timebar_analytics` | Usage events | 100 | Existing |
| `timebar_disclaimer_dismissed` | Disclaimer state | 1 flag | Existing |
| `timebar_draft` | Auto-saved in-progress work | 1 draft | Phase 1 |
| `timebar_onboarded` | First-visit help dismissed | 1 flag | Phase 1 |
| `timebar_templates` | Saved templates | 20 | Phase 2 |
| `timebar_reminders` | Deadline reminders | 50 | Phase 2 |

### New Routes

| Route | Purpose | Phase |
|-------|---------|-------|
| `/report` | Print-optimized PDF report view | Phase 1 |
| `/batch` | Batch CSV calculator | Phase 2 |
| `/api/calculate` | Calculation API endpoint | Phase 2 |
| `/api/feedback` | Feedback submission proxy | Phase 3 |
| `/api/health` | API health check | Phase 3 |

### New Components

| Component | Purpose | Phase |
|-----------|---------|-------|
| `ErrorBoundary` | Reusable error boundary wrapper | Phase 1 |
| `DraftRecoveryBanner` | "Resume your calculation?" banner | Phase 1 |
| `OnboardingCard` | Contextual first-visit help card | Phase 1 |
| `ComparisonView` | Side-by-side dual ResultCard layout | Phase 2 |
| `BatchUploader` | CSV upload + results table | Phase 2 |
| `KeyboardShortcutsOverlay` | Shortcut reference modal | Phase 2 |
| `TemplateManager` | Save/load/delete templates | Phase 2 |
| `ReminderPicker` | Deadline reminder interval selector | Phase 2 |
| `FeedbackWidget` | Floating feedback form | Phase 3 |
| `RuleDiffViewer` | Version comparison on changelog | Phase 3 |
| `InteractiveTimeline` | SVG-based explorable timeline | Phase 3 |
| `AnalyticsChart` | Reusable SVG chart component | Phase 3 |

### New Dependencies

| Package | Purpose | Phase |
|---------|---------|-------|
| `@playwright/test` | E2E testing | Phase 1 |
| `@upstash/ratelimit` (optional) | API rate limiting | Phase 3 |
| `web-push` (optional) | Push notifications for PWA | Phase 3 |

Minimal new dependencies — the design deliberately avoids adding libraries where browser APIs or custom implementations suffice.

### CI/CD Changes

| Change | Phase |
|--------|-------|
| Add Playwright E2E tests to CI | Phase 1 |
| Add coverage threshold check | Phase 3 |
| Add Lighthouse CI audit | Phase 3 |
| Add bundle size monitoring | Phase 3 |

---

## Success Criteria

### Phase 1
- A lawyer can generate a PDF report suitable for a case file note
- Closing and reopening the tab recovers in-progress work
- New users understand what to do without external documentation
- No Playwright test failures on the 8 critical flows
- Zero WCAG 2.1 AA violations on automated audit
- All layouts functional on 375px width

### Phase 2
- Two claim types can be compared side-by-side in under 10 seconds
- A CSV of 50 cases processes and displays results within 5 seconds
- API endpoint returns correct results for all 13 claim types
- Power users can complete a full calculation without touching the mouse
- Templates survive browser restart and are reusable

### Phase 3
- TimeBar installable as PWA on mobile
- Users can report issues without leaving the app
- Rule version changes are visible and understandable on the changelog
- Lighthouse performance score above 90
- Test coverage above 80%

---

## Build Order

Within each phase, the recommended build order is:

**Phase 1:**
1. Error boundaries (foundation for everything else)
2. Input validation polish (improves UX for all subsequent testing)
3. Mobile responsiveness audit & fixes
4. WCAG 2.1 AA accessibility audit
5. PDF export (depends on clean, accessible markup)
6. Input auto-save / draft recovery
7. Guided onboarding
8. E2E tests (covers all Phase 1 features once built)

**Phase 2:**
1. API route (foundational — batch calculator reuses it)
2. Side-by-side claim comparison
3. Batch calculator
4. Save as template
5. Keyboard navigation
6. Deadline reminders
7. iCal export improvements
8. SEO / structured data
9. Component tests

**Phase 3:**
1. PWA install
2. Rule version diff viewer
3. Interactive timeline
4. Analytics dashboard improvements
5. Feedback widget
6. Performance audit + Lighthouse CI
7. API rate limiting hardening
8. Comprehensive test coverage
