# Visual Refresh "Refined Glass" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply a premium glassmorphism visual refresh to all existing TimeBar components — richer glass effects, layered shadows, gradient accents, enhanced animations, and refined typography — across both dark and light themes.

**Architecture:** Pure CSS/styling changes with enhanced Framer Motion animations. All theming goes through the existing CSS custom property system (`--var` tokens in `:root` / `[data-theme="light"]`). No new components, pages, routes, or data flow changes. Cormorant Garamond display font already loaded.

**Tech Stack:** Tailwind CSS v4, CSS custom properties, Framer Motion v12, next-themes, Cormorant Garamond + Manrope fonts (already loaded)

---

## File Map

| File | Responsibility |
|------|---------------|
| `app/globals.css` | All new CSS tokens, glass classes, shadow stacks, animations, utility classes |
| `app/layout.tsx` | Footer tagline |
| `app/page.tsx` | Layout spacing, ambient status glow, max-width |
| `components/Header.tsx` | Logo gradient text, glass pill nav, theme toggle styling, mobile menu animations |
| `components/ClaimSelector.tsx` | Card radius, hover/selected accent, staggered animation |
| `components/DynamicQuestionnaire.tsx` | Progress bar, question transitions, input/option styling |
| `components/ResultCard.tsx` | Status badge glow, display date typography, section dividers, milestone cards |
| `components/Timeline.tsx` | Track height, gradient fill, pulsing today marker, mount animation, date labels |
| `components/StatusBadge.tsx` | Larger size, glow shadow |
| `components/ReasoningAccordion.tsx` | Left-border timeline accent |
| `components/OnboardingCard.tsx` | Padding, gold icon, entrance animation |
| `components/DraftRecoveryBanner.tsx` | Glass card upgrade, CTA gradient button |
| `components/DisclaimerBanner.tsx` | Top-border gradient separator |
| `components/CopyButton.tsx` | Button gradient and glow treatment |
| `components/ShareButton.tsx` | Button gradient and glow treatment |
| `components/CalendarExportButton.tsx` | Button gradient and glow treatment |
| `components/PrintButton.tsx` | Button gradient and glow treatment |

---

### Task 1: CSS Foundation — Enhanced Tokens, Glass System, Animations

**Files:**
- Modify: `app/globals.css`

This task lays down all the new CSS custom properties, utility classes, shadow stacks, and keyframe animations that every subsequent task depends on. Nothing visual changes yet — components adopt the classes in later tasks.

- [ ] **Step 1: Update dark theme glass and background tokens**

In `app/globals.css`, inside the `:root, [data-theme="dark"]` block, update these existing variables and add new ones:

```css
/* Replace existing values */
--glass-bg: linear-gradient(165deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.022));
--glass-strong-bg: linear-gradient(165deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.032));
--glass-hover-bg: linear-gradient(165deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.04));
--grid-line: rgba(255, 255, 255, 0.025);

/* Add new tokens */
--glass-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 2px 8px -2px rgba(0, 0, 0, 0.3), 0 8px 24px -4px rgba(0, 0, 0, 0.2);
--glass-top-highlight: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05), transparent);
--glass-inner-glow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
--section-divider: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
--cta-gradient: linear-gradient(135deg, #b45309, #d97706, #eab308);
--cta-glow: 0 4px 16px rgba(212, 168, 83, 0.3);
--ambient-green: radial-gradient(ellipse at 50% 50%, rgba(52, 211, 153, 0.08), transparent 70%);
--ambient-amber: radial-gradient(ellipse at 50% 50%, rgba(251, 191, 36, 0.08), transparent 70%);
--ambient-red: radial-gradient(ellipse at 50% 50%, rgba(251, 113, 133, 0.08), transparent 70%);
--ambient-blue: radial-gradient(ellipse at 50% 50%, rgba(96, 165, 250, 0.08), transparent 70%);
--badge-glow-green: 0 0 20px rgba(52, 211, 153, 0.3);
--badge-glow-amber: 0 0 20px rgba(251, 191, 36, 0.3);
--badge-glow-red: 0 0 20px rgba(251, 113, 133, 0.3);
--badge-glow-blue: 0 0 20px rgba(96, 165, 250, 0.3);
--progress-gradient: linear-gradient(90deg, #d5b06b, #5b8ce6);
--reasoning-accent: linear-gradient(180deg, var(--accent), var(--accent-blue));
```

- [ ] **Step 2: Update light theme tokens**

In the `[data-theme="light"]` block, update existing and add matching light-theme tokens:

```css
/* Replace existing values */
--glass-bg: linear-gradient(165deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.65));
--glass-strong-bg: linear-gradient(165deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.75));
--glass-hover-bg: linear-gradient(165deg, rgba(255, 255, 255, 0.97), rgba(255, 255, 255, 0.85));

/* Add new tokens */
--glass-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 8px 24px -4px rgba(0, 0, 0, 0.06);
--glass-top-highlight: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.02), transparent);
--glass-inner-glow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
--section-divider: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.08), transparent);
--cta-gradient: linear-gradient(135deg, #b45309, #d97706, #eab308);
--cta-glow: 0 4px 16px rgba(180, 137, 48, 0.2);
--ambient-green: radial-gradient(ellipse at 50% 50%, rgba(5, 150, 105, 0.05), transparent 70%);
--ambient-amber: radial-gradient(ellipse at 50% 50%, rgba(180, 83, 9, 0.05), transparent 70%);
--ambient-red: radial-gradient(ellipse at 50% 50%, rgba(185, 28, 28, 0.05), transparent 70%);
--ambient-blue: radial-gradient(ellipse at 50% 50%, rgba(37, 99, 235, 0.05), transparent 70%);
--badge-glow-green: 0 0 20px rgba(5, 150, 105, 0.2);
--badge-glow-amber: 0 0 20px rgba(180, 83, 9, 0.2);
--badge-glow-red: 0 0 20px rgba(185, 28, 28, 0.2);
--badge-glow-blue: 0 0 20px rgba(37, 99, 235, 0.2);
--progress-gradient: linear-gradient(90deg, #b08930, #3b6fd4);
--reasoning-accent: linear-gradient(180deg, var(--accent), var(--accent-blue));
```

- [ ] **Step 3: Add glass utility classes and update existing ones**

After the existing `.glass-hover:hover` rule, add the enhanced glass card class and update the existing `.glass` rule to include the shadow stack:

```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.glass-strong {
  background: var(--glass-strong-bg);
  backdrop-filter: var(--glass-strong-blur);
  -webkit-backdrop-filter: var(--glass-strong-blur);
  border: 1px solid var(--glass-strong-border);
  box-shadow: var(--glass-shadow);
}

/* Top-edge light catch for glass cards */
.glass-card {
  position: relative;
}
.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--glass-top-highlight);
  border-radius: inherit;
  z-index: 1;
  pointer-events: none;
}

.glass-hover:hover {
  background: var(--glass-hover-bg);
  border-color: var(--glass-hover-border);
  box-shadow: var(--glass-shadow), var(--glass-inner-glow);
}

/* Section divider gradient line */
.divider-gradient {
  height: 1px;
  background: var(--section-divider);
  border: none;
}

/* CTA button styling */
.btn-cta {
  background: var(--cta-gradient);
  box-shadow: var(--cta-glow);
  color: white;
  font-weight: 600;
  border: none;
}
.btn-cta:hover {
  filter: brightness(1.1);
}
.btn-cta:active {
  transform: scale(0.98);
}

/* Ghost button glow */
.btn-ghost:hover {
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
}

/* Progress bar */
.progress-bar {
  background: var(--progress-gradient);
  border-radius: 9999px;
  height: 3px;
}
```

- [ ] **Step 4: Add ambient animation keyframes**

After the existing `@keyframes pulse-glow` block, add:

```css
@keyframes ambient-drift {
  0%, 100% { background-position: 0% 0%, 100% 100%, 50% 50%; }
  33% { background-position: 10% 5%, 90% 95%, 45% 55%; }
  66% { background-position: 5% 10%, 95% 90%, 55% 45%; }
}

@keyframes countdown-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-ambient {
  animation: ambient-drift 20s ease-in-out infinite;
}

.animate-countdown {
  animation: countdown-pulse 2s ease-in-out infinite;
}
```

- [ ] **Step 5: Update the body::before ambient animation**

Replace the existing `body::before` rule to add the ambient drift:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 8% 2%, var(--radial-1), transparent 42%),
    radial-gradient(circle at 85% 12%, var(--radial-2), transparent 34%),
    radial-gradient(ellipse at 50% 120%, var(--radial-3), transparent 48%),
    var(--body-gradient);
  pointer-events: none;
  z-index: 0;
  animation: ambient-drift 20s ease-in-out infinite;
}
```

- [ ] **Step 6: Update print styles for new classes**

Inside the `@media print` block, add rules for the new classes:

```css
.glass-card::before,
.divider-gradient {
  display: none !important;
}
.btn-cta {
  background: #d97706 !important;
  box-shadow: none !important;
}
.progress-bar {
  background: #64748b !important;
}
```

- [ ] **Step 7: Update reduced-motion styles**

Inside the `@media (prefers-reduced-motion: reduce)` block, add:

```css
.animate-ambient,
.animate-countdown {
  animation: none !important;
}
```

- [ ] **Step 8: Verify build**

Run: `cd "/Users/tarunagarwal/Documents/1 App Developement_Tarun/TimeBar" && npm run build`
Expected: Build succeeds with no new errors.

- [ ] **Step 9: Commit**

```bash
git add app/globals.css
git commit -m "style: add refined glass CSS tokens, shadow stacks, ambient animations, and utility classes"
```

---

### Task 2: Header — Logo Gradient, Glass Pill Nav, Theme Toggle, Mobile Menu

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: Update the logo to use Cormorant Garamond with gradient text**

Replace the current logo `<span>` block (lines 43-44):

```tsx
<span className="block text-base leading-none font-semibold tracking-tight text-gradient-blue">
  TimeBar
</span>
```

With:

```tsx
<span className="block text-xl leading-none font-semibold tracking-tight text-gradient display-serif">
  TimeBar
</span>
```

- [ ] **Step 2: Update nav links to use glass pill active state**

Replace the desktop nav link className (lines 74-78):

```tsx
className={`relative px-3 py-1.5 text-[13px] font-medium tracking-wide rounded-md transition-all duration-200 min-h-[44px] flex items-center ${
  pathname === link.href
    ? 'text-[var(--accent-text)] bg-[var(--accent-soft)]'
    : 'text-slate-400 hover:text-slate-100 hover:bg-[var(--surface-hover)]'
}`}
```

With:

```tsx
className={`relative px-3 py-1.5 text-[13px] font-medium tracking-wide rounded-full transition-all duration-200 min-h-[44px] flex items-center ${
  pathname === link.href
    ? 'text-[var(--accent-text)] glass border-[var(--accent)]/25 shadow-[0_0_12px_rgba(213,176,107,0.15)]'
    : 'text-slate-400 hover:text-slate-100 hover:bg-[var(--surface-hover)]'
}`}
```

Remove the bottom underline `<span>` inside nav links (lines 81-83) since we're using glass pill now.

- [ ] **Step 3: Wrap theme toggle in glass pill container**

Replace the theme toggle button (lines 62-68) className to add glass pill styling:

```tsx
className="p-2 rounded-full glass text-slate-400 hover:text-[var(--accent-icon)] transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
```

- [ ] **Step 4: Update header bar glass effect**

Replace the header className (line 33):

```tsx
<header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/70 backdrop-blur-xl">
```

With:

```tsx
<header className="sticky top-0 z-50 bg-[var(--bg-primary)]/70 backdrop-blur-[20px] glass-card" style={{ borderBottom: 'none' }}>
  {/* Bottom edge gradient is provided by glass-card::before but we want it at the bottom */}
```

Actually, simpler approach — keep the header structure clean:

```tsx
<header className="sticky top-0 z-50 bg-[var(--bg-primary)]/70 backdrop-blur-[20px]" style={{ borderBottom: '1px solid transparent', borderImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), rgba(255,255,255,0.05), transparent) 1' }}>
```

- [ ] **Step 5: Add staggered mobile menu animations**

Replace the mobile menu dropdown (lines 101-135). Wrap each nav item in motion.div with staggered delay:

```tsx
{mobileMenuOpen && (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="sm:hidden border-t border-[var(--border-default)] bg-[var(--bg-primary)]/95 backdrop-blur-xl"
  >
    <nav aria-label="Mobile navigation" className="max-w-6xl mx-auto px-4 py-3 space-y-1">
      {/* Help button */}
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
        <button
          type="button"
          onClick={() => { handleShowHelp(); setMobileMenuOpen(false); }}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-slate-400 hover:text-slate-100 hover:bg-[var(--surface-hover)] rounded-lg transition-all duration-200 cursor-pointer min-h-[44px]"
        >
          <HelpCircle className="w-4 h-4" />
          Show help
        </button>
      </motion.div>
      {/* Theme toggle */}
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <button
          type="button"
          onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setMobileMenuOpen(false); }}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-slate-400 hover:text-slate-100 hover:bg-[var(--surface-hover)] rounded-lg transition-all duration-200 cursor-pointer min-h-[44px]"
        >
          {mounted && (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
          {mounted ? (theme === 'dark' ? 'Light mode' : 'Dark mode') : 'Toggle theme'}
        </button>
      </motion.div>
      {/* Nav links */}
      {navLinks.map((link, i) => (
        <motion.div key={link.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (i + 2) * 0.05 }}>
          <Link
            href={link.href}
            className={`block px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all duration-200 min-h-[44px] leading-7 ${
              pathname === link.href
                ? 'text-[var(--accent-text)] bg-[var(--accent-soft)]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-[var(--surface-hover)]'
            }`}
          >
            {link.label}
          </Link>
        </motion.div>
      ))}
    </nav>
  </motion.div>
)}
```

Note: Import `motion` from `framer-motion` at the top of the file (not currently imported).

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add components/Header.tsx
git commit -m "style: header glass pill nav, gradient logo, staggered mobile menu animations"
```

---

### Task 3: ClaimSelector — Card Radius, Hover Accent, Staggered Animation

**Files:**
- Modify: `components/ClaimSelector.tsx`

- [ ] **Step 1: Update card border-radius to rounded-2xl and add glass-card class**

Replace the button className (lines 89-91):

```tsx
className="w-full group relative text-left glass glass-hover rounded-xl p-4
  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50
  cursor-pointer overflow-hidden"
```

With:

```tsx
className="w-full group relative text-left glass glass-hover glass-card rounded-2xl p-4
  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50
  cursor-pointer overflow-hidden border-l-2 border-l-transparent hover:border-l-[var(--accent)]
  active:scale-[0.98] transition-all duration-200"
```

- [ ] **Step 2: Update stagger animation delay to 60ms**

The delay is already `overallIndex * 0.06` (60ms) — this matches the spec. Confirm no change needed.

- [ ] **Step 3: Verify build and visual**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/ClaimSelector.tsx
git commit -m "style: claim selector cards with rounded-2xl, glass-card highlight, gold left-border hover"
```

---

### Task 4: DynamicQuestionnaire — Progress Bar, Question Transitions, Input Polish

**Files:**
- Modify: `components/DynamicQuestionnaire.tsx`

- [ ] **Step 1: Add progress bar at the top of the questionnaire**

Inside the `DynamicQuestionnaire` component, before the `<div className="space-y-4">` return, calculate progress and render the bar. Update the return JSX:

```tsx
export default function DynamicQuestionnaire({ rule, answers, onAnswerChange }: Props) {
  // ... existing state and validation code ...

  const visibleQuestions = rule.questions.filter((q) => shouldShow(q));
  const answeredCount = visibleQuestions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== '').length;
  const totalCount = visibleQuestions.length;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="h-[3px] flex-1 rounded-full bg-[var(--overlay-white-4)] overflow-hidden">
            <motion.div
              className="progress-bar h-full"
              initial={{ width: '0%' }}
              animate={{ width: totalCount > 0 ? `${(answeredCount / totalCount) * 100}%` : '0%' }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
          <span className="ml-3 text-[11px] text-slate-500 tabular-nums shrink-0">
            {answeredCount} of {totalCount}
          </span>
        </div>
      </div>

      {/* Questions */}
      {rule.questions.map((q, i) => {
        // ... existing question rendering ...
```

- [ ] **Step 2: Update question card styling with rounded-2xl**

Replace the question card `<motion.div>` className (line 226-227):

```tsx
className="rounded-xl border border-white/[0.06] bg-[var(--overlay-subtle)] p-4"
```

With:

```tsx
className="rounded-2xl border border-white/[0.06] bg-[var(--overlay-subtle)] p-4 glass-card"
```

- [ ] **Step 3: Update question transition animation**

Replace the existing `initial` and `animate` on the question motion.div (lines 222-225):

```tsx
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
```

With:

```tsx
initial={{ opacity: 0, y: -8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -8 }}
transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
layout
```

- [ ] **Step 4: Update date input styling**

In the `DateInput` component, replace the input className (lines 80-83):

```tsx
className={`w-full sm:w-auto pl-9 pr-3 py-2.5 rounded-xl text-sm text-slate-100 min-h-[44px]
  glass border ${error ? 'border-rose-500/60' : 'border-[var(--accent)]/25'}
  focus:outline-none focus:border-[var(--accent)]/55 focus:bg-[var(--surface-hover)] focus:shadow-[0_0_20px_-6px_rgba(213,176,107,0.35)]
  transition-all duration-200 placeholder:text-slate-500`}
```

With:

```tsx
className={`w-full sm:w-auto pl-9 pr-3 h-12 rounded-xl text-sm text-slate-100
  glass border ${error ? 'border-rose-500/60' : 'border-[var(--accent)]/25'}
  shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]
  focus:outline-none focus:border-[var(--accent)]/55 focus:bg-[var(--surface-hover)] focus:shadow-[0_0_20px_-6px_rgba(213,176,107,0.35),inset_0_1px_3px_rgba(0,0,0,0.2)]
  transition-all duration-200 placeholder:text-slate-500`}
```

- [ ] **Step 5: Update boolean toggle styling to pill shape**

In the `BooleanInput` component, replace the button className (lines 39-44):

```tsx
className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border
  ${
    isSelected
      ? 'bg-[var(--accent-soft)] border-[var(--accent)]/45 text-[var(--accent-text)] shadow-[0_0_18px_-5px_rgba(213,176,107,0.35)]'
      : 'glass border-white/[0.08] text-slate-300 hover:text-slate-100 hover:border-[var(--accent)]/35 hover:bg-[var(--surface-hover)]'
  }`}
```

With:

```tsx
className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border
  ${
    isSelected
      ? 'bg-[var(--accent-soft)] border-[var(--accent)]/45 text-[var(--accent-text)] shadow-[0_0_18px_-5px_rgba(213,176,107,0.35)]'
      : 'glass border-white/[0.08] text-slate-300 hover:text-slate-100 hover:border-[var(--accent)]/35 hover:bg-[var(--surface-hover)]'
  }`}
```

- [ ] **Step 6: Update select input styling**

In the `SelectInput` component, replace the select className (lines 112-117):

```tsx
className="w-full sm:w-auto pl-3 pr-8 py-2.5 rounded-xl text-sm text-slate-100 appearance-none
  glass border border-[var(--accent)]/25
  focus:outline-none focus:border-[var(--accent)]/55 focus:bg-[var(--surface-hover)] focus:shadow-[0_0_20px_-6px_rgba(213,176,107,0.35)]
  transition-all duration-200 cursor-pointer bg-no-repeat bg-[right_0.5rem_center]"
```

With:

```tsx
className="w-full sm:w-auto pl-3 pr-8 h-12 rounded-xl text-sm text-slate-100 appearance-none
  glass border border-[var(--accent)]/25
  shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]
  focus:outline-none focus:border-[var(--accent)]/55 focus:bg-[var(--surface-hover)] focus:shadow-[0_0_20px_-6px_rgba(213,176,107,0.35),inset_0_1px_3px_rgba(0,0,0,0.2)]
  transition-all duration-200 cursor-pointer bg-no-repeat bg-[right_0.5rem_center]"
```

- [ ] **Step 7: Update form label styling**

Replace the label className (line 228):

```tsx
<label className="flex items-center text-[12px] text-slate-200 font-medium mb-2.5 leading-relaxed">
```

With:

```tsx
<label className="flex items-center text-[13px] text-slate-200 font-medium mb-2.5 leading-relaxed tracking-[-0.02em]">
```

- [ ] **Step 8: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 9: Commit**

```bash
git add components/DynamicQuestionnaire.tsx
git commit -m "style: questionnaire progress bar, pill booleans, inner-shadow inputs, glass-card questions"
```

---

### Task 5: ResultCard — Status Glow, Display Date, Section Dividers, Milestone Cards

**Files:**
- Modify: `components/ResultCard.tsx`

- [ ] **Step 1: Add glass-card class and update card radius**

The card already uses `rounded-2xl`. Add `glass-card` to the outermost div className (line 75):

```tsx
className={`relative overflow-hidden rounded-2xl border ${style.border} ${style.glow} glass-card`}
```

- [ ] **Step 2: Update display date to use Cormorant Garamond at text-2xl**

The date display on line 106 already uses `display-serif` and is at `text-3xl sm:text-4xl` — this is bigger than the spec's `text-2xl`, which is fine. No change needed here.

- [ ] **Step 3: Add countdown pulse animation for live status**

Replace the days remaining display (lines 99-103):

```tsx
<div className={`text-[11px] uppercase tracking-wider ${style.dateColor} font-semibold opacity-90 mb-1`}>
  {result.status === 'live' && `${result.daysRemaining} days remaining`}
  {result.status === 'expires_today' && 'Expires today'}
  {result.status === 'expired' && `${Math.abs(result.daysRemaining || 0)} days overdue`}
</div>
```

With:

```tsx
<div className={`text-sm uppercase tracking-wider ${style.dateColor} font-semibold mb-1`}>
  {result.status === 'live' && (
    <span className="animate-countdown">{result.daysRemaining} days remaining</span>
  )}
  {result.status === 'expires_today' && 'Expires today'}
  {result.status === 'expired' && `${Math.abs(result.daysRemaining || 0)} days overdue`}
</div>
```

- [ ] **Step 4: Replace solid section dividers with gradient dividers**

Replace the info section border (line 133):  

```tsx
<div className="mt-4 rounded-xl border border-white/[0.08] bg-[var(--overlay-subtle)] p-3.5 space-y-3">
```

With:

```tsx
<div className="mt-4 rounded-2xl border border-white/[0.08] bg-[var(--overlay-subtle)] p-3.5 space-y-3">
```

Between major sections inside the info area, use `<div className="divider-gradient" />` to separate content blocks. Add dividers between the urgency/confidence badges, scenario summary, next steps, milestones, and scenario timelines:

After the urgency/confidence badges (after line 141, after `</div>` of the badges wrapper):
```tsx
<div className="divider-gradient" />
```

After the scenario summary paragraph (after line 143):
```tsx
{result.nextActions.length > 0 && <div className="divider-gradient" />}
```

After next actions (after the `nextActions` closing `</div>`, before milestones):
```tsx
{result.proceduralMilestones.length > 0 && <div className="divider-gradient" />}
```

After milestones (before scenario timelines):
```tsx
{result.scenarioTimelines.length > 0 && <div className="divider-gradient" />}
```

- [ ] **Step 5: Enhance procedural milestone cards with glass treatment**

Replace each milestone card (line 163):

```tsx
<div key={idx} className="rounded-lg border border-white/[0.08] bg-[var(--overlay-subtle)] p-2.5">
```

With:

```tsx
<div key={idx} className="rounded-xl glass glass-card p-3">
```

- [ ] **Step 6: Enhance scenario timeline cards the same way**

Replace each scenario card (line 187):

```tsx
<div key={scenario.id} className="rounded-lg border border-white/[0.08] bg-[var(--overlay-subtle)] p-2.5">
```

With:

```tsx
<div key={scenario.id} className="rounded-xl glass glass-card p-3">
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 8: Commit**

```bash
git add components/ResultCard.tsx
git commit -m "style: result card glass treatment, countdown pulse, gradient dividers, glass milestone cards"
```

---

### Task 6: Timeline — Track Height, Gradient Fill, Pulsing Marker, Mount Animation

**Files:**
- Modify: `components/Timeline.tsx`

- [ ] **Step 1: Increase track height to h-3 (12px)**

Replace the background track (line 42):

```tsx
<div className="absolute top-[13px] left-0 right-0 h-[3px] bg-white/[0.04] rounded-full" />
```

With:

```tsx
<div className="absolute top-[10px] left-0 right-0 h-3 bg-white/[0.04] rounded-full" />
```

- [ ] **Step 2: Update the fill bar to match new height and add green→amber→red gradient**

Replace the fill bar motion.div (lines 44-53):

```tsx
<motion.div
  className="absolute top-[13px] left-0 h-[3px] rounded-full"
  style={{
    background: `linear-gradient(90deg, ${accentColor}, ${gradientEnd})`,
    boxShadow: `0 0 8px -1px ${gradientEnd}40`,
  }}
  initial={{ width: '0%' }}
  animate={{ width: `${Math.min(todayPercent, 100)}%` }}
  transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
/>
```

With:

```tsx
<motion.div
  className="absolute top-[10px] left-0 h-3 rounded-full"
  style={{
    background: `linear-gradient(90deg, #34d399, #fbbf24, #fb7185)`,
    boxShadow: `0 0 10px -2px ${gradientEnd}50`,
  }}
  initial={{ scaleX: 0 }}
  animate={{ scaleX: Math.min(todayPercent, 100) / 100 }}
  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
  style-origin="left"
/>
```

Wait — Framer Motion style conflicts. Better approach:

```tsx
<motion.div
  className="absolute top-[10px] left-0 h-3 rounded-full origin-left"
  style={{
    background: `linear-gradient(90deg, #34d399, #fbbf24, #fb7185)`,
    boxShadow: `0 0 10px -2px ${gradientEnd}50`,
    width: '100%',
  }}
  initial={{ scaleX: 0 }}
  animate={{ scaleX: Math.min(todayPercent, 100) / 100 }}
  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
/>
```

- [ ] **Step 3: Update endpoint markers to match new track position**

Replace the accrual dot (line 55):

```tsx
<div className="absolute top-[9px] left-0 w-[10px] h-[10px] rounded-full bg-[var(--accent)] ring-[3px] ring-[var(--ring-bg)]" />
```

With:

```tsx
<div className="absolute top-[8px] left-0 w-[14px] h-[14px] rounded-full bg-[var(--accent)] ring-[3px] ring-[var(--ring-bg)]" />
```

Replace the today marker (lines 57-66):

```tsx
<motion.div
  className="absolute top-[8px] w-[12px] h-[12px]"
  initial={{ left: '0%' }}
  animate={{ left: `${Math.min(todayPercent, 100)}%` }}
  transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
  style={{ marginLeft: -6 }}
>
  <span className="absolute inset-0 rounded-full bg-[var(--accent-blue)] animate-ping opacity-20" />
  <span className="relative block w-[12px] h-[12px] rounded-full bg-[var(--accent-blue)] ring-[3px] ring-[var(--ring-bg)]" />
</motion.div>
```

With (add glow ring):

```tsx
<motion.div
  className="absolute top-[7px] w-[16px] h-[16px]"
  initial={{ left: '0%' }}
  animate={{ left: `${Math.min(todayPercent, 100)}%` }}
  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
  style={{ marginLeft: -8 }}
>
  <span className="absolute inset-0 rounded-full bg-[var(--accent-blue)] animate-ping opacity-20" />
  <span
    className="relative block w-[16px] h-[16px] rounded-full bg-[var(--accent-blue)] ring-[3px] ring-[var(--ring-bg)]"
    style={{ boxShadow: '0 0 8px 2px rgba(159, 191, 246, 0.5)' }}
  />
</motion.div>
```

Replace the expiry endpoint (lines 68-72):

```tsx
<div
  className={`absolute top-[9px] right-0 w-[10px] h-[10px] rounded-full ring-[3px] ring-[var(--ring-bg)] ${
    isExpired ? 'bg-rose-400' : 'bg-emerald-400'
  }`}
/>
```

With:

```tsx
<div
  className={`absolute top-[8px] right-0 w-[14px] h-[14px] rounded-full ring-[3px] ring-[var(--ring-bg)] ${
    isExpired ? 'bg-rose-400' : 'bg-emerald-400'
  }`}
/>
```

- [ ] **Step 4: Enhance the date labels**

Replace the date labels section (lines 75-79):

```tsx
<div className="flex justify-between text-[10px] text-slate-400 mt-0.5 px-0">
  <span>{format(accrual, 'd MMM yyyy')}</span>
  <span className="text-[var(--accent-blue)]">Today</span>
  <span>{format(expiry, 'd MMM yyyy')}</span>
</div>
```

With:

```tsx
<div className="flex justify-between text-[11px] text-slate-400 mt-2 px-0">
  <div className="text-center">
    <span className="block text-[10px] uppercase tracking-wider text-slate-500">Accrual</span>
    <span>{format(accrual, 'd MMM yyyy')}</span>
  </div>
  <span className="text-[var(--accent-blue)] self-end">Today</span>
  <div className="text-center">
    <span className="block text-[10px] uppercase tracking-wider text-slate-500">Expiry</span>
    <span>{format(expiry, 'd MMM yyyy')}</span>
  </div>
</div>
```

- [ ] **Step 5: Increase the relative container height**

Replace `<div className="relative h-8">` (line 41) with:

```tsx
<div className="relative h-10">
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add components/Timeline.tsx
git commit -m "style: timeline with h-3 track, green-amber-red gradient, pulsing glow marker, labeled endpoints"
```

---

### Task 7: StatusBadge — Larger Size, Glow Shadow

**Files:**
- Modify: `components/StatusBadge.tsx`

- [ ] **Step 1: Add glow shadows to status config**

Add a `glow` property to each status in `statusConfig`:

```tsx
const statusConfig = {
  live: {
    label: 'LIVE',
    bg: 'bg-[var(--badge-live-bg)]',
    border: 'border-[var(--badge-live-border)]',
    text: 'text-[var(--badge-live-text)]',
    icon: CheckCircle,
    pulse: true,
    glow: 'shadow-[var(--badge-glow-green)]',
  },
  expires_today: {
    label: 'EXPIRES TODAY',
    bg: 'bg-[var(--badge-today-bg)]',
    border: 'border-[var(--badge-today-border)]',
    text: 'text-[var(--badge-today-text)]',
    icon: Clock,
    pulse: true,
    glow: 'shadow-[var(--badge-glow-amber)]',
  },
  expired: {
    label: 'EXPIRED',
    bg: 'bg-[var(--badge-expired-bg)]',
    border: 'border-[var(--badge-expired-border)]',
    text: 'text-[var(--badge-expired-text)]',
    icon: AlertTriangle,
    pulse: false,
    glow: 'shadow-[var(--badge-glow-red)]',
  },
  manual_review: {
    label: 'REVIEW',
    bg: 'bg-[var(--badge-review-bg)]',
    border: 'border-[var(--badge-review-border)]',
    text: 'text-[var(--badge-review-text)]',
    icon: Search,
    pulse: false,
    glow: 'shadow-[var(--badge-glow-blue)]',
  },
};
```

- [ ] **Step 2: Update badge size and apply glow**

Replace the badge `<span>` className (line 49):

```tsx
className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium tracking-wide border ${config.bg} ${config.border} ${config.text}`}
```

With:

```tsx
className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium tracking-wide border ${config.bg} ${config.border} ${config.text} ${config.glow}`}
```

Note: Tailwind may not support `shadow-[var(--badge-glow-green)]` syntax. If Tailwind v4 doesn't resolve this, use inline style instead. Alternative approach — apply via inline `style={{ boxShadow: 'var(--badge-glow-green)' }}` prop. Let's use a safer approach:

Replace the entire badge JSX return:

```tsx
export default function StatusBadge({ status }: Props) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const glowVars: Record<string, string> = {
    live: 'var(--badge-glow-green)',
    expires_today: 'var(--badge-glow-amber)',
    expired: 'var(--badge-glow-red)',
    manual_review: 'var(--badge-glow-blue)',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium tracking-wide border ${config.bg} ${config.border} ${config.text}`}
      style={{ boxShadow: glowVars[status] }}
    >
      {config.pulse ? (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${status === 'live' ? 'bg-[var(--badge-live-dot)]' : 'bg-[var(--badge-today-dot)]'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'live' ? 'bg-[var(--badge-live-dot)]' : 'bg-[var(--badge-today-dot)]'}`} />
        </span>
      ) : (
        <Icon className="w-3.5 h-3.5" />
      )}
      {config.label}
    </span>
  );
}
```

- [ ] **Step 3: Remove the unused `glow` field from statusConfig** (clean up if you used the inline style approach)

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add components/StatusBadge.tsx
git commit -m "style: larger status badge with glow shadow effect"
```

---

### Task 8: ReasoningAccordion — Left-Border Timeline Accent

**Files:**
- Modify: `components/ReasoningAccordion.tsx`

- [ ] **Step 1: Update card radius and add glass-card**

Replace the outer div className (line 16):

```tsx
<div className="glass rounded-xl overflow-hidden border border-[var(--accent)]/22">
```

With:

```tsx
<div className="glass glass-card rounded-2xl overflow-hidden border border-[var(--accent)]/22">
```

- [ ] **Step 2: Add left-border accent line to the reasoning steps**

Replace the `<ol>` wrapper (line 46-47):

```tsx
<ol className="mt-4 space-y-3">
```

With:

```tsx
<ol className="mt-4 space-y-3 border-l-2 border-transparent" style={{ borderImage: 'var(--reasoning-accent) 1' }}>
```

And update each step `<li>` (line 48) to add left padding:

```tsx
<li key={i} className="flex gap-3 text-[12px] leading-relaxed pl-4">
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/ReasoningAccordion.tsx
git commit -m "style: reasoning accordion with rounded-2xl, glass-card, left-border timeline accent"
```

---

### Task 9: OnboardingCard — Padding, Gold Icon, Entrance Animation

**Files:**
- Modify: `components/OnboardingCard.tsx`

- [ ] **Step 1: Add framer-motion import and entrance animation, update styling**

Replace the entire component:

```tsx
'use client';

import { motion } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

type Props = {
  message: string;
  onDismiss: () => void;
};

export default function OnboardingCard({ message, onDismiss }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-start gap-2.5 px-5 py-4 rounded-2xl glass glass-card border border-[var(--accent-blue)]/20"
      role="note"
    >
      <Lightbulb className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
      <p className="text-[12px] text-slate-200 leading-relaxed flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Dismiss help tip"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
```

Key changes: `motion.div` with fade+slide entrance, `px-5 py-4` (increased padding), `rounded-2xl`, `glass glass-card`, lightbulb icon color changed to `text-[var(--accent)]` (gold).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/OnboardingCard.tsx
git commit -m "style: onboarding card with glass treatment, gold icon, entrance animation"
```

---

### Task 10: DraftRecoveryBanner — Glass Card, CTA Gradient Button

**Files:**
- Modify: `components/DraftRecoveryBanner.tsx`

- [ ] **Step 1: Update to glass card styling with CTA gradient restore button**

Replace the entire component:

```tsx
'use client';

import { motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';

type Props = {
  onRestore: () => void;
  onDismiss: () => void;
};

export default function DraftRecoveryBanner({ onRestore, onDismiss }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-3 px-5 py-4 rounded-2xl glass glass-card"
      role="alert"
    >
      <RotateCcw className="w-4 h-4 text-[var(--accent-text)] shrink-0" />
      <p className="text-[12px] text-[var(--accent-text)] flex-1 leading-relaxed">
        Resume your previous calculation?
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onRestore}
          className="btn-cta px-3 py-1.5 rounded-xl text-[11px] font-medium cursor-pointer min-h-[44px] flex items-center transition-all duration-200"
        >
          Restore
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Dismiss draft recovery"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
```

Key changes: `glass glass-card` instead of flat `bg-[var(--accent-soft)]`, `rounded-2xl`, `px-5 py-4`, restore button uses `btn-cta` class with `rounded-xl`.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/DraftRecoveryBanner.tsx
git commit -m "style: draft recovery banner with glass card, CTA gradient restore button"
```

---

### Task 11: DisclaimerBanner — Top-Border Gradient Separator

**Files:**
- Modify: `components/DisclaimerBanner.tsx`

- [ ] **Step 1: Add top-border gradient line**

Replace the banner container className (line 28):

```tsx
className="disclaimer-banner relative z-40 overflow-hidden border-b border-[var(--accent)]/20 bg-[var(--accent)]/8"
```

With:

```tsx
className="disclaimer-banner relative z-40 overflow-hidden bg-[var(--accent)]/8"
style={{ borderBottom: 'none', borderTop: '1px solid transparent', borderImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent) 1' }}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/DisclaimerBanner.tsx
git commit -m "style: disclaimer banner with gradient top-border separator"
```

---

### Task 12: Action Buttons — Gradient Glow Treatment (Copy, Share, Calendar, Print)

**Files:**
- Modify: `components/CopyButton.tsx`
- Modify: `components/ShareButton.tsx`
- Modify: `components/CalendarExportButton.tsx`
- Modify: `components/PrintButton.tsx`

All four buttons share the same ghost button pattern. Apply consistent styling to each.

- [ ] **Step 1: Update CopyButton**

Replace the button className in CopyButton (lines 143-144):

```tsx
className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300
  px-2.5 py-1.5 rounded-lg glass-hover transition-all duration-200 cursor-pointer border border-transparent hover:border-white/[0.06]"
```

With:

```tsx
className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300
  px-2.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer border border-transparent
  hover:border-white/10 hover:ring-1 hover:ring-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]
  active:scale-[0.98]"
```

- [ ] **Step 2: Update ShareButton**

Replace the button className in ShareButton (lines 34-35) with the same pattern:

```tsx
className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300
  px-2.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer border border-transparent
  hover:border-white/10 hover:ring-1 hover:ring-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]
  active:scale-[0.98]"
```

- [ ] **Step 3: Update CalendarExportButton**

Replace the button className in CalendarExportButton (lines 31-32) with the same pattern:

```tsx
className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300
  px-2.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer border border-transparent
  hover:border-white/10 hover:ring-1 hover:ring-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]
  active:scale-[0.98]"
```

- [ ] **Step 4: Update PrintButton**

Replace the button className in PrintButton (lines 22-23):

```tsx
className="no-print flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300
  px-2.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer border border-transparent
  hover:border-white/10 hover:ring-1 hover:ring-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]
  active:scale-[0.98]"
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add components/CopyButton.tsx components/ShareButton.tsx components/CalendarExportButton.tsx components/PrintButton.tsx
git commit -m "style: action buttons with rounded-xl, glow ring hover, active press feedback"
```

---

### Task 13: Page Layout — Spacing, Ambient Glow, Footer Tagline

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update max-width and spacing in page.tsx**

Replace the main container (line 90):

```tsx
<div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
```

With:

```tsx
<div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
```

Note: The spec says increase from `max-w-2xl` to `max-w-3xl`. The current code uses `max-w-6xl`. Since the current `max-w-6xl` is for the two-column layout on the questionnaire side, and the spec targets the content reading width — we should keep `max-w-6xl` for the grid layout but update the panel max width. Actually, looking more carefully, the spec says to increase to `max-w-3xl` "on larger screens where content benefits from more room" — the current `max-w-6xl` is already larger. Let's keep it as is for the grid layout but increase py spacing:

```tsx
<div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
```

- [ ] **Step 2: Increase spacing between major sections**

Update the selector view spacing. Replace (line 97):

```tsx
className="space-y-8"
```

With:

```tsx
className="space-y-10"
```

Update the questionnaire grid gap (line 164):

```tsx
<div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-5 lg:gap-6 items-start">
```

With:

```tsx
<div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-6 lg:gap-8 items-start">
```

Update the result column spacing (line 189):

```tsx
<div className="space-y-4 lg:sticky lg:top-20">
```

With:

```tsx
<div className="space-y-5 lg:sticky lg:top-24">
```

- [ ] **Step 3: Add ambient status glow behind result area**

Wrap the result `<AnimatePresence>` area in a relative container with the ambient glow. In the result loaded branch (around line 191), add the ambient glow div:

```tsx
{result ? (
  <motion.div
    key="result-loaded"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.3 }}
    className="space-y-3 relative"
  >
    {/* Ambient status glow */}
    <div
      className="absolute -inset-8 -z-10 opacity-60 blur-3xl pointer-events-none transition-all duration-1000"
      style={{
        background:
          result.status === 'live' ? 'var(--ambient-green)' :
          result.status === 'expires_today' ? 'var(--ambient-amber)' :
          result.status === 'expired' ? 'var(--ambient-red)' :
          'var(--ambient-blue)',
      }}
    />
    <ErrorBoundary name="result display">
      <ResultCard
        result={result}
        claimType={selectedClaim}
        accrualDate={accrualDate || ''}
        answers={answers}
      />
    </ErrorBoundary>
    <ErrorBoundary name="reasoning">
      <ReasoningAccordion result={result} />
    </ErrorBoundary>
  </motion.div>
```

- [ ] **Step 4: Add footer tagline in layout.tsx**

In `app/layout.tsx`, add a footer tagline after the `<main>` tag and before the closing `</ThemeProvider>`:

```tsx
<main id="main-content" role="main" className="relative z-10 flex-1">{children}</main>
<footer className="relative z-10 py-4 text-center">
  <p className="text-[10px] text-slate-600">Built for legal professionals</p>
</footer>
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/layout.tsx
git commit -m "style: page spacing increase, ambient status glow, footer tagline"
```

---

### Task 14: Final Review & Build Verification

- [ ] **Step 1: Full build check**

Run: `npm run build`
Expected: Build succeeds with no new warnings.

- [ ] **Step 2: Visual review checklist**

Manually verify in the browser:
- Dark theme: glass cards have top-edge highlight, layered shadows
- Light theme: equivalent treatment, visible glass effects
- Status badge glows match status color
- Timeline has 12px track with green→amber→red gradient
- Today marker pulses with glow ring
- Progress bar visible in questionnaire
- Boolean toggles are pill-shaped
- Buttons have rounded-xl with hover ring glow
- Background has subtle ambient drift animation
- Mobile menu links stagger in
- Header logo shows Cormorant Garamond with gradient text
- Footer tagline visible at page bottom
- Print view unaffected (glass stripped, clean output)
- Reduced-motion respects: no ambient or countdown animations

- [ ] **Step 3: Accessibility check**

Verify contrast ratios are maintained:
- Status badge text on badge background ≥ 4.5:1
- Body text on glass panels ≥ 4.5:1
- Form labels on question cards ≥ 4.5:1

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "style: visual refresh 'Refined Glass' — complete implementation per spec"
```

---

## Spec Coverage Verification

| Spec Section | Task(s) |
|---|---|
| 1. Typography & Color System | Task 1 (tokens), Task 2 (logo), Task 4 (labels), Task 5 (dates) |
| 2. Card & Glass System | Task 1 (CSS), Task 3 (claim cards), Task 5 (result card) |
| 3. Result Card & Timeline | Task 5, Task 6, Task 7 |
| 4. Form & Questionnaire Polish | Task 4, Task 9, Task 10, Task 11 |
| 5. Header & Layout | Task 2, Task 13 |
| 6. Files Affected | All 17 files covered across tasks |
| 7. Light Theme Considerations | Task 1 (light tokens), Task 7 (inline glow vars) |
| 8. What This Does NOT Include | Confirmed: no new features/pages/routes/deps |
| 9. Success Criteria | Task 14 (final review) |
