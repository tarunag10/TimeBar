# 🔍 TimeBar Codebase Audit Report

**Date:** 2026-04-16  
**Auditor:** Codebuff Automated Audit  
**Scope:** Full codebase — security, logic correctness, code quality, architecture, and feature gaps

---

## Static Analysis Results

| Check | Result |
|-------|--------|
| TypeScript (`tsc --noEmit`) | ✅ No errors |
| ESLint | ❌ 4 issues (3 errors, 1 warning) |
| Vitest | ❌ 77/78 pass — 1 failure in `validateDateNotFuture` |
| npm audit | ✅ 0 dependency vulnerabilities |

---

## 🔴 Critical Issues

### 1. Professional Negligence Longstop Baseline is Legally Incorrect

- **File:** `lib/engine/calculate.ts`
- **Description:** The s.14B 15-year longstop runs from the **date of the act or omission** that constituted the negligence — **not** the accrual/damage date. The code uses `answers.accrual_date` for the longstop calculation. These dates can differ significantly (e.g., negligent advice given in 2010, damage discovered in 2018). This could produce **dangerously wrong deadline estimates** for professional negligence claims.
- **Fix:** Add a separate `act_or_omission_date` question to the professional negligence rule JSON and use that date for the longstop calculation instead of `accrual_date`.

### 2. Zod Validation Schema is Never Used

- **File:** `lib/validation/calculatorSchema.ts`
- **Description:** `calculatorInputSchema` is defined with Zod but **never invoked** anywhere in the app. The `calculate()` function and `DynamicQuestionnaire` accept raw unvalidated input. Any malformed or unexpected data passes straight to the engine.
- **Fix:** Call `calculatorInputSchema.parse(input)` (or `.safeParse`) in the `calculate()` function entry point, and/or validate in the UI before calling `calculate()`.

---

## 🟠 High Severity Issues

### 3. Disability Modifier Uses `addYears` Instead of `addPeriod`

- **File:** `lib/engine/modifiers.ts` (line ~24)
- **Description:**
  ```ts
  const disabilityExpiry = addYears(ceasedDate, rule.basePeriod.value);
  ```
  This hardcodes `addYears` even if `rule.basePeriod.unit` is `'months'` or `'days'`. Currently all rules use `years`, but this is a latent bug that would silently produce wrong results if any rule were added with a non-year base period.
- **Fix:** Replace with:
  ```ts
  const disabilityExpiry = addPeriod(ceasedDate, rule.basePeriod);
  ```
  (Import or extract `addPeriod` from `calculate.ts`.)

### 4. Timezone Bug in `validateDateNotFuture`

- **File:** `lib/validation/calculatorSchema.ts`
- **Description:** `new Date(dateStr)` parses `'YYYY-MM-DD'` as **midnight UTC**, while `today` is set to **midnight local time**. Users in timezones behind UTC (e.g., US afternoon) will have `date > today` be `true` for today's date, **rejecting valid "today" dates**. This is the cause of the failing test.
- **Fix:** Use `parseISO` + `startOfDay` from date-fns for both dates, or compare date strings lexicographically (`dateStr <= todayStr`):
  ```ts
  export function validateDateNotFuture(dateStr: string): string | null {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (dateStr > today) {
      return 'Date cannot be in the future for an accrual event that has already occurred.';
    }
    return null;
  }
  ```

### 5. `glow-*` CSS Classes Missing

- **File:** `components/ResultCard.tsx` — references `glow-green`, `glow-amber`, `glow-red`, `glow-blue`
- **File:** `app/globals.css` — none of these classes are defined
- **Description:** Result cards are missing their intended glow/shadow effects for each status type.
- **Fix:** Add the following CSS classes to `globals.css`:
  ```css
  .glow-green { box-shadow: 0 0 20px -6px rgba(52, 211, 153, 0.3); }
  .glow-amber { box-shadow: 0 0 20px -6px rgba(251, 191, 36, 0.3); }
  .glow-red { box-shadow: 0 0 20px -6px rgba(251, 113, 133, 0.3); }
  .glow-blue { box-shadow: 0 0 20px -6px rgba(96, 165, 250, 0.3); }
  ```

### 6. `/coverage` Route Does Not Exist

- **File:** `components/Header.tsx` — links to `/coverage`
- **Description:** No `app/coverage/page.tsx` exists. Users clicking "Coverage" in the nav will see a 404.
- **Fix:** Either create `app/coverage/page.tsx` with a coverage/claim types overview page, or change the link to point to an existing route (e.g., `/about` or `/changelog`).

---

## 🟡 Medium Severity Issues

### 7. Judgment Enforcement Leap Year Bug

- **File:** `lib/engine/manualReview.ts` (line ~92)
- **Description:**
  ```ts
  if (daysSinceJudgment > (6 * 365)) {
  ```
  6 years includes 1–2 leap days, so `6 * 365 = 2190` is off by 1–2 days. This could trigger the manual review warning slightly too early or too late.
- **Fix:** Use proper date arithmetic:
  ```ts
  const sixYearDate = addYears(parseISO(accrualStr), 6);
  if (today > sixYearDate) { ... }
  ```

### 8. `select` Question Type Has No UI Implementation

- **File:** `components/DynamicQuestionnaire.tsx`
- **Description:** The `Question` type supports `'select'`, but the questionnaire only renders `'date'` and `'boolean'`. If any rule JSON uses a `select` question, nothing renders — the user can't answer it.
- **Fix:** Add a `SelectInput` component in `DynamicQuestionnaire.tsx` that renders a `<select>` element with options from the question definition. This will require adding an `options` field to the `Question` type.

### 9. Rule JSONs Cast `as Rule` Without Runtime Validation

- **File:** `lib/rules/index.ts`
- **Description:** All 13 JSON rule files are cast with `as Rule` with no runtime validation. A malformed JSON (wrong field name, missing required field) will cause **silent runtime errors** or incorrect calculations.
- **Fix:** Create a Zod schema for `Rule` and parse each JSON at load time:
  ```ts
  const ruleSchema = z.object({ ... }); // mirror the Rule type
  export const rules = Object.fromEntries(
    Object.entries(rawRules).map(([key, json]) => [key, ruleSchema.parse(json)])
  );
  ```

### 10. localStorage Data Without Encryption

- **File:** `lib/storage.ts`
- **Description:** History entries store claim types, accrual dates, answers, and expiry dates in `localStorage` as plain JSON. Any script on the same origin (or browser extension) can read this potentially sensitive legal data.
- **Fix:** For a client-side tool this is acceptable, but consider:
  - Adding a note in the About/Privacy page
  - Optionally encrypting data before storage (using Web Crypto API)
  - Adding a "clear all data" option prominently

### 11. No Error Boundaries or 404 Page

- **Files:** `app/` directory — missing `app/error.tsx` and `app/not-found.tsx`
- **Description:** Unhandled React errors will crash the entire page instead of showing a graceful fallback. Non-existent routes show the default Next.js 404.
- **Fix:** Create:
  - `app/error.tsx` — React error boundary with retry button
  - `app/not-found.tsx` — branded 404 page with link back to home

### 12. `navigator.clipboard.writeText` Requires Secure Context

- **File:** `components/CopyButton.tsx`
- **Description:** The Clipboard API requires HTTPS (or localhost). On HTTP, `navigator.clipboard` is `undefined` and the copy button will throw an unhandled error.
- **Fix:** Add a fallback:
  ```ts
  async function handleCopy() {
    const text = formatCopyText(result, claimType);
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for non-secure contexts
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }
  ```

---

## 🟢 Low Severity Issues

### 13. `addPeriod` Function Duplicated

- **Files:** `lib/engine/calculate.ts`, `lib/engine/scenarios.ts`
- **Description:** Identical `addPeriod` helper defined in both files.
- **Fix:** Extract to a shared utility file (e.g., `lib/engine/utils.ts`) and import in both places.

### 14. ESLint: `let baseExpiry` Should Be `const`

- **File:** `lib/engine/calculate.ts` (line ~190)
- **Description:** `baseExpiry` is never reassigned; should use `const`.
- **Fix:** Change `let baseExpiry =` to `const baseExpiry =`.

### 15. ESLint: `setState` in `useEffect` Synchronous Body

- **Files:** `app/analytics/AnalyticsDashboard.tsx`, `components/CalculationHistory.tsx`
- **Description:** `setEvents(getAnalyticsEvents())` and `setEntries(getHistory())` inside `useEffect` can cause cascading renders.
- **Fix:** Use lazy initializer instead:
  ```ts
  const [entries, setEntries] = useState<HistoryEntry[]>(() => getHistory());
  ```
  Then remove the `useEffect`.

### 16. Unused `yearsAgo` Function in Tests

- **File:** `lib/engine/__tests__/calculate.test.ts` (line ~7)
- **Description:** `yearsAgo` is defined but never called.
- **Fix:** Remove the unused function.

### 17. `font-weight: 420` in CSS

- **File:** `app/globals.css`
- **Description:** While variable fonts can accept arbitrary weight values, `420` is unusual. Standard weights are multiples of 100 (400=normal, 500=medium). This may render as 400 in some browsers.
- **Fix:** Change to `font-weight: 400` (normal) or `font-weight: 500` (medium) depending on the intended visual weight.

### 18. Disclaimer Banner Resets on Navigation

- **File:** `components/DisclaimerBanner.tsx`
- **Description:** The dismiss state is local component state. On route changes, the banner reappears.
- **Fix:** Persist the dismissed state in `localStorage` or app-level state (e.g., a context provider).

### 19. No Content Security Policy Headers

- **File:** `next.config.ts`
- **Description:** No CSP headers configured. The app is client-only so risk is lower, but CSP would harden against XSS if any is introduced.
- **Fix:** Add CSP headers in `next.config.ts`:
  ```ts
  const nextConfig: NextConfig = {
    async headers() {
      return [{
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      }];
    },
  };
  ```

### 20. `crypto.randomUUID()` Without Fallback

- **Files:** `lib/ics.ts`, `lib/storage.ts`
- **Description:** In non-secure contexts (HTTP), `crypto.randomUUID()` is `undefined` and will throw.
- **Fix:** Add a try/catch with a fallback:
  ```ts
  function generateId(): string {
    try {
      return crypto.randomUUID();
    } catch {
      return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    }
  }
  ```

---

## ℹ️ Informational

| # | Finding | Notes |
|---|---------|-------|
| 21 | No XSS found | Next.js auto-escapes; no `dangerouslySetInnerHTML` usage |
| 22 | No server-side validation | Entire app is client-side; acceptable for a local tool but worth noting if an API is added later |
| 23 | No sitemap.xml / robots.txt | Minor SEO gap; can add via Next.js `app/sitemap.ts` |
| 24 | Non-deterministic tests | Tests using `new Date()` / `daysFromNow()` without mocking can be flaky across time boundaries |
| 25 | Missing ARIA landmarks and skip-to-content link | Accessibility gaps for screen reader and keyboard users |
| 26 | Analytics page has `noindex` | But other pages lack meta robots directives — consider adding `robots` metadata consistently |

---

## Summary by Severity

| Severity | Count |
|----------|-------|
| 🔴 Critical | 2 |
| 🟠 High | 4 |
| 🟡 Medium | 6 |
| 🟢 Low | 8 |
| ℹ️ Info | 6 |
| **Total** | **26** |

### Recommended Fix Order

1. **Critical #1** — Professional negligence longstop (legal correctness)
2. **Critical #2** — Zod validation schema (input safety)
3. **High #4** — Timezone bug (also fixes the failing test)
4. **High #3** — Disability modifier `addPeriod` (latent calculation bug)
5. **High #5** — Missing CSS classes (visual broken states)
6. **High #6** — Missing `/coverage` route (broken navigation)
7. Then proceed through Medium and Low severity issues in order
