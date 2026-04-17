# TimeBar — Feature Roadmap

> Current as of April 2026. Based on codebase audit, PRD review, and gap analysis.
> All 26 audit issues resolved. 13 claim types supported. Production build passing.

---

## 🔥 Tier 1 — High Impact, Should Build Next

### 1. Shareable Links (URL-encoded state)

Encode claim type + answers into URL query params so users can share a direct link to a pre-filled calculation. Lawyers live by sharing links in emails.

- **Effort:** Small — serialize answers to URL params, hydrate on page load
- **Impact:** Very high — makes the tool collaborative by default
- **Implementation notes:**
  - Use `URLSearchParams` to serialize the `answers` object + `claimType` into the URL
  - On page load, detect query params and pre-populate state via `handleRestore`
  - Add a "Share" button next to Copy/Calendar export in the ResultCard
  - Consider compressing params with `lz-string` if URLs get long

### 2. PDF Export (professional report)

Lawyers need file notes. A styled PDF with the result card, reasoning trail, scenario timelines, disclaimer, and statute references. More professional than "print".

- **Effort:** Medium — use `@react-pdf/renderer` or browser print-to-PDF with a dedicated print stylesheet
- **Impact:** Very high — this is what makes it a daily-use tool vs. a one-time check
- **Implementation notes:**
  - Option A: `@react-pdf/renderer` for full control over PDF layout
  - Option B: Dedicated `/report` route with print-optimized CSS (`@media print`)
  - Include: result summary, scenario timelines, reasoning trail, statute refs, procedural milestones, disclaimer, generated timestamp
  - Add header/footer with TimeBar branding and "not legal advice" watermark

### 3. ~~Dark/Light Theme Toggle~~ ✅ COMPLETED

Implemented April 2026. Full dual-theme system with `next-themes`, CSS variable palette for both dark and light modes, FOUC prevention, hydration-safe toggle, and all 12+ components updated.

- **Effort:** Small → Medium (escalated due to comprehensive variable system)
- **Impact:** High — removes a common barrier to adoption
- **What was built:**
  - `next-themes` with `data-theme` attribute + `ThemeProvider` wrapper
  - 80+ CSS custom properties covering both themes (glass, gradients, overlays, badges, priorities, scrollbars)
  - Inline `<script>` in `<head>` to prevent FOUC (reads localStorage before first paint)
  - `mounted` state guard in Header toggle to prevent hydration mismatch
  - Sun/Moon toggle button in Header navigation
  - Timeline gradient reads `--accent` dynamically via `getComputedStyle`
  - All Tailwind v4 opacity-class overrides replaced with CSS variables for reliability

### 4. Side-by-Side Claim Comparison

Run two claim types on the same facts simultaneously (e.g., "is this contract or tort?"). This is a real lawyer need — they often don't know the exact classification upfront.

- **Effort:** Medium — refactor page state to support dual calculation, split-pane UI
- **Impact:** High — unique differentiator no other calculator offers
- **Implementation notes:**
  - Add "Compare with another claim type" button in ResultCard
  - Store a secondary `claimType` + shared `answers` in state
  - Render dual ResultCards side-by-side (or stacked on mobile)
  - Highlight differences in expiry date, modifiers, and warnings
  - Allow independent modifier toggles per claim type

---

## 🟡 Tier 2 — Strong Impact, Build Soon

### 5. Batch Calculator (CSV upload)

Upload a CSV of accrual dates and claim types → get bulk limitation results. Claims handlers and paralegals manage dozens of matters.

- **Effort:** Medium
- **Impact:** High — unlocks a completely different user segment
- **Implementation notes:**
  - Add `/batch` route with file upload component
  - CSV format: `claim_type, accrual_date, knowledge_date, ...`
  - Run `calculate()` for each row, display results table
  - Export results as CSV with added columns (expiry date, status, days remaining)
  - Add validation for row-level errors (invalid dates, unsupported claim types)

### 6. Rule Version Diff Viewer

On the changelog page, show what changed between rule JSON versions. Lawyers need to know if a rule update affects their active cases.

- **Effort:** Small–Medium — JSON diff + nice UI
- **Impact:** Medium–High — builds trust and auditability
- **Implementation notes:**
  - Store historical rule versions alongside current (e.g., `ew.simple-contract.v1.0.json`, `v1.1.json`)
  - Use `jsondiffpatch` or custom diff to show additions, removals, and changes
  - Render diff on the Changelog page with color-coded additions/removals
  - Show which fields changed (base period, questions, manual review triggers, etc.)

### 7. Feedback / Report-an-Issue Widget

Let users flag potentially incorrect results for legal review. Currently there's no feedback loop.

- **Effort:** Small — form → email/API or localStorage queue
- **Impact:** Medium — critical for trust and continuous improvement
- **Implementation notes:**
  - Add "Report an issue" button in ResultCard or ReasoningAccordion
  - Pre-populate with claim type, inputs, and result summary
  - Submit via `mailto:` link (no backend needed) or store locally for later review
  - If adding an API later, POST to `/api/feedback`

### 8. PWA Install (mobile app-like experience)

Add a manifest + service worker so lawyers can "install" TimeBar on their phone for quick checks in court or at client meetings.

- **Effort:** Small — `next-pwa` or custom manifest
- **Impact:** Medium — convenience for mobile users
- **Implementation notes:**
  - Add `app/manifest.ts` (Next.js Metadata API) with name, icons, theme color
  - Add service worker via `next-pwa` or `@serwist/next` for offline caching
  - Ensure all static assets and rule JSONs are cached
  - Add install prompt CTA on first visit

---

## 🟢 Tier 3 — Polish & Completeness

### 9. Interactive Timeline with Modifier Events

The current timeline shows accrual → today → expiry. Add dots for modifier events (discovery date, acknowledgment date, disability cessation) with tooltips.

- **Effort:** Small
- **Impact:** Medium — makes the timeline much more informative
- **Implementation notes:**
  - Accept `modifierDates?: { date: string; label: string }[]` prop (already defined in Timeline type but unused)
  - Render intermediate dots with hover tooltips
  - Differentiate modifier dot colors by type (discovery = amber, acknowledgment = green, etc.)

### 10. Keyboard-Navigation Flow (power-user mode)

Tab-through the entire calculator flow with keyboard shortcuts. Power users (solicitors doing rapid checks) would benefit greatly.

- **Effort:** Small
- **Impact:** Medium
- **Implementation notes:**
  - Ensure all interactive elements have `tabIndex` and focus styles
  - Add keyboard shortcuts: `Escape` = back, `Enter` on claim card = select
  - Add focus management after route transitions (focus first input in questionnaire)

### 11. Expand to Scotland / India Jurisdiction

The PRD already plans India for v2. Scotland has different limitation rules (Prescription and Limitation (Scotland) Act 1973). Multi-jurisdiction support is the long-term differentiator.

- **Effort:** Large — new rule files, different legal frameworks
- **Impact:** Very high long-term, but large scope
- **Implementation notes:**
  - Add jurisdiction selector to ClaimSelector (or a pre-selector step)
  - Create `lib/rules/sc.*.json` for Scotland and `lib/rules/in.*.json` for India
  - Update `Rule` type to support `jurisdiction: 'england_wales' | 'scotland' | 'india'`
  - Ensure calculation engine handles jurisdiction-specific rules (e.g., Scotland uses 5-year negative prescription)

### 12. API Route (`/api/calculate`)

Expose the calculation engine as an API for integration with case management systems (Clio, Leap, etc.).

- **Effort:** Small–Medium — wrap `calculate()` in a Next.js API route
- **Impact:** High — opens B2B integration channel
- **Implementation notes:**
  - Create `app/api/calculate/route.ts` with POST handler
  - Validate input with existing `calculatorInputSchema`
  - Return JSON result (same shape as `CalculationResult`)
  - Add rate limiting (e.g., `@upstash/ratelimit` or simple in-memory)
  - Add API key authentication if needed for B2B use

### 13. E2E Tests with Playwright

The PRD calls for this and it's missing. Critical for confidence before adding more features.

- **Effort:** Medium
- **Impact:** Medium — prevents regressions as complexity grows
- **Implementation notes:**
  - Install `@playwright/test`
  - Test flows: select claim type → fill questionnaire → verify result card appears
  - Test copy button, calendar export, print button
  - Test manual review triggers (e.g., select "unsure" on a key question)
  - Test mobile responsive layout
  - Add to CI pipeline (`.github/workflows/ci.yml`)

---

## ⚡ Quick Wins (under 2 hours each)

| Feature | Why | Priority |
|---|---|---|
| Shareable links (#1) | Highest ROI — small effort, massive utility | 🔴 Do first |
| ~~Light/dark toggle (#3)~~ ✅ | Removes adoption barrier | ✅ Done |
| PWA manifest (#8) | "Install" on phone = daily use | 🟠 Soon |
| Feedback widget (#7) | Closes the quality loop | 🟠 Soon |
| Interactive modifier dots (#9) | Visual completeness | 🟡 Nice-to-have |

---

## 🎯 Recommended Build Order

1. **Shareable Links** — highest ROI, unlocks collaboration
2. ~~**Light/Dark Toggle**~~ ✅ — removes accessibility barrier (DONE)
3. **PDF Export** — professional output, daily-use driver
4. **Side-by-Side Comparison** — unique differentiator
5. **PWA Install** — mobile adoption
6. **Batch Calculator** — new user segment
7. **Playwright E2E** — regression safety before scaling
8. **API Route** — B2B integration channel
9. **Rule Diff Viewer** — trust & auditability
10. **Multi-Jurisdiction** — long-term strategic value

---

## 📊 Effort vs. Impact Matrix

```
Impact
  ▲
  │  ★ Shareable links        ★ PDF export
  │  ★ Light/dark toggle      ★ Side-by-side compare
  │
  │  ★ Batch calculator       ★ API route
  │  ★ PWA install            ★ Multi-jurisdiction
  │
  │  ★ Feedback widget        ★ Rule diff viewer
  │  ★ Timeline modifiers     ★ Keyboard nav
  │  ★ Playwright E2E
  │
  └──────────────────────────────────────────► Effort
     Small                    Medium           Large
```

---

## 🔗 Related Documents

- [PRD](../england-wales-limitation-calculator-prd.md) — original product requirements
- [ENHANCEMENTS.md](../ENHANCEMENTS.md) — earlier enhancement list
- [Audit Report](./audit/2026-04-16-codebase-audit.md) — all 26 issues resolved
- [Design Spec](./superpowers/specs/2026-04-12-timebar-design.md) — visual & architectural decisions
