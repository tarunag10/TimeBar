# TimeBar Visual Refresh — "Refined Glass" Design Spec

> Date: 2026-04-19
> Direction: Rich & premium glassmorphism with Apple-inspired depth and boldness
> Scope: Full visual refresh of all existing components — no new features, no new pages

---

## 1. Typography & Color System

### Typography

- **Brand title ("TimeBar")**: Use Cormorant Garamond display font at `text-2xl`, apply a CSS gradient text effect (warm gold `#d4a853` → white `#f0f0f0`) via `background-clip: text` + `text-fill-color: transparent`.
- **Section headings** (claim selector title, result card header, questionnaire heading): Increase to `text-lg` / `text-xl`, use `font-semibold` with `-0.02em` letter-spacing.
- **Body text**: Keep Manrope, increase `line-height` to `1.7` for readability.
- **Form labels**: `text-[13px]` with `font-medium`, ensure adequate contrast against glass backgrounds.
- **Display dates** (expiry date in result card): Use Cormorant Garamond at `text-2xl` to make dates the visual anchor.

### Color Refinements

- **Background gradient**: Deepen the radial gradients — richer navy-to-black transitions. Increase saturation of the gold glow at `8% 2%` and the blue glow at `85% 12%`.
- **Accent glow**: Introduce a warm gold-to-blue gradient for primary CTAs and active/focus states, building on the existing gold border theme (`--color-border: rgba(236, 196, 130, 0.16)`).
- **Glass panel opacity**: Increase from `rgba(255,255,255,0.045)` to `rgba(255,255,255,0.065)` for better content legibility.
- **Status colors**: Keep green/amber/red/blue values but add a soft outer glow (`box-shadow: 0 0 16px rgba(color, 0.25)`) to status badges.

---

## 2. Card & Glass System

### Elevated Glass Cards

Apply to: ClaimSelector cards, DynamicQuestionnaire container, ResultCard, OnboardingCard, DraftRecoveryBanner, ReasoningAccordion.

- **Border radius**: Increase from `rounded-xl` (12px) to `rounded-2xl` (16px) on all card-level containers.
- **Top-edge light catch**: Add a pseudo-element or gradient border on the top edge: `from-white/20 via-white/5 to-transparent`, 1px height, simulating light hitting glass.
- **Layered shadow stack**: Replace single shadows with a 3-layer stack:
  ```css
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 2px 8px -2px rgba(0, 0, 0, 0.3),
    0 8px 24px -4px rgba(0, 0, 0, 0.2);
  ```
- **Glass opacity**: Bump to `rgba(255, 255, 255, 0.065)` base, `rgba(255, 255, 255, 0.09)` on hover.
- **Inner glow on hover**: `inset 0 1px 0 rgba(255, 255, 255, 0.1)` brightens the top edge.

### Claim Selector Cards

- **Hover**: Subtle left-border accent color (2px gold) + slight lift via shadow increase.
- **Selected state**: Stronger glass effect + gold accent border + `scale(1.02)` transform.
- **Grid load**: Staggered fade-in animation — each card delays by `index * 60ms`.

### Buttons

- **Primary CTAs** (Share, Copy, Calendar Export): Gradient background (`from-amber-600 via-amber-500 to-yellow-500`) with a matching glow shadow (`0 4px 16px rgba(212, 168, 83, 0.3)`).
- **Secondary/ghost buttons**: Transparent background, on hover add a glow ring (`ring-1 ring-white/10` + `shadow-[0_0_12px_rgba(255,255,255,0.05)]`).
- **All buttons**: `rounded-xl` for consistency, `active:scale-[0.98]` for tactile press feedback.
- **Transition**: `transition-all duration-200 ease-out`.

---

## 3. Result Card & Timeline

### Result Card

- **Status badge hero treatment**: Increase from `text-[10px]` to `text-sm`, wider padding (`px-4 py-1.5`), add glow shadow matching status color (`0 0 20px rgba(color, 0.3)`).
- **Expiry date**: Display at `text-2xl` using Cormorant Garamond, making it the visual anchor of the card.
- **Days remaining**: If status is `live`, show a bold countdown number with a subtle CSS pulse animation (opacity oscillation over 2s).
- **Section dividers**: Replace solid borders with gradient fades: `from-transparent via-white/10 to-transparent` as a horizontal line.
- **Reasoning accordion**: Add a 2px left-border accent line (gradient from accent-top to accent-bottom) connecting steps — a "timeline of logic" visual.

### Timeline Component

- **Track height**: Increase from current thin bar to `h-3` (12px).
- **Gradient fill**: Instead of solid color, use a gradient: green → amber → red based on elapsed percentage.
- **Today marker**: Pulsing dot with a glow ring (`box-shadow: 0 0 8px 2px rgba(accent, 0.5)`) and CSS pulse animation.
- **Date labels**: Increase size, display the formatted date value below each endpoint label (Accrual / Expiry).
- **Mount animation**: Bar grows from left to right over `0.8s` using Framer Motion `initial={{ scaleX: 0 }}` → `animate={{ scaleX: 1 }}` with `originX: 0`.

### Procedural Milestones

- Each milestone gets a mini glass card treatment (same glass system, smaller padding).
- Priority badges receive the same glow treatment as status badges.

---

## 4. Form & Questionnaire Polish

### DynamicQuestionnaire

- **Progress indicator**: Add a thin gradient progress bar at the top of the questionnaire container, showing answered questions / total questions. Bar uses the gold-to-blue accent gradient. Include a text label: "3 of 5" in muted text beside the bar.
- **Question transitions**: When a new conditional question appears, animate with `slideDown + fadeIn` (Framer Motion: `initial={{ opacity: 0, y: -8 }}`, `animate={{ opacity: 1, y: 0 }}`, `duration: 0.3`).
- **Input fields** (date inputs, text fields):
  - Height: `h-12` (48px) for comfortable tap targets.
  - Border radius: `rounded-xl`.
  - Subtle inner shadow: `inset 0 1px 3px rgba(0, 0, 0, 0.2)`.
  - Focus state: gradient border glow matching the accent color.
- **Radio/option buttons**: Each option rendered as a mini glass card. Hover: slight lift. Selected state: accent border + subtle background fill (`rgba(accent, 0.1)`) + checkmark icon.
- **Boolean toggles**: Yes/No options styled as pill-shaped toggle cards side by side. Selected pill glows with accent color.

### OnboardingCard

- Increase padding (`p-4` → `p-5`), lightbulb icon in accent gold.
- Entrance animation: fade + slide up (`initial={{ opacity: 0, y: 8 }}`, `animate={{ opacity: 1, y: 0 }}`).

### DraftRecoveryBanner

- Upgrade to glass card style (same as other cards) instead of flat banner.
- Restore button uses the primary CTA gradient treatment.

### DisclaimerBanner

- Keep subtle. Add a faint top-border gradient line (`from-transparent via-white/8 to-transparent`) to cleanly separate it from the header.

---

## 5. Header & Layout

### Header

- **Logo**: "TimeBar" in Cormorant Garamond with gradient text (gold → white), bump to `text-xl`.
- **Nav links active state**: Glass pill background with accent glow, replacing the current underline gradient.
- **Theme toggle**: Wrap in a glass pill container (`rounded-full`, glass background). Sun/moon icons get `rotate(180deg) + scale` transition on toggle.
- **Mobile menu**: Slide-down with backdrop blur overlay on the page body. Staggered link animations (each link fades in with `index * 50ms` delay).
- **Header glass bar**: Strengthen backdrop-blur to `blur(20px)`. Add bottom-edge gradient border: `from-white/10 via-white/5 to-transparent`.

### Page Layout

- **Max width**: Increase from `max-w-2xl` to `max-w-3xl` on larger screens where content benefits from more room.
- **Ambient status glow**: Behind the main content area, add a large radial gradient that shifts color based on result status: green glow for `live`, amber for `expires_today`, red for `expired`, blue for `manual_review`. Fades in when result appears.
- **Section spacing**: Increase `gap` / `space-y` between major sections by ~25% for better breathing room.

### Background

- **Grid overlay**: Increase line visibility slightly (`rgba(255,255,255,0.018)` → `0.025`).
- **Ambient animation**: Add a slow-moving gradient animation — CSS keyframes that shift the radial gradient positions over a 20s loop. Very subtle, almost imperceptible, gives the background life.

### Footer

- Add a subtle tagline: "Built for legal professionals" in muted text (`text-[10px] text-slate-600`) centered at the bottom of the page, below the main content.

---

## 6. Files Affected

All changes are CSS/styling modifications within existing files. No new components or pages.

| File | Changes |
|------|---------|
| `app/globals.css` | Background gradients, grid overlay, glass classes, shadow stacks, ambient animation keyframes, progress bar styles, button gradient classes, glow utilities |
| `app/layout.tsx` | Footer tagline addition |
| `app/page.tsx` | Ambient status glow wrapper, spacing adjustments, progress indicator integration |
| `components/Header.tsx` | Logo gradient text, glass pill nav, theme toggle styling, mobile menu animations |
| `components/ClaimSelector.tsx` | Card radius, hover/selected states, staggered animation |
| `components/DynamicQuestionnaire.tsx` | Progress bar, question transitions, input field styling, option card treatment |
| `components/ResultCard.tsx` | Status badge glow, display date typography, days countdown, section dividers |
| `components/Timeline.tsx` | Track height, gradient fill, pulsing today marker, mount animation |
| `components/StatusBadge.tsx` | Larger size, glow shadow |
| `components/ReasoningAccordion.tsx` | Left-border timeline accent |
| `components/OnboardingCard.tsx` | Padding, gold icon, entrance animation |
| `components/DraftRecoveryBanner.tsx` | Glass card upgrade, CTA button gradient |
| `components/DisclaimerBanner.tsx` | Top-border gradient separator |
| `components/CopyButton.tsx` | Button gradient and glow treatment |
| `components/ShareButton.tsx` | Button gradient and glow treatment |
| `components/CalendarExportButton.tsx` | Button gradient and glow treatment |
| `components/PrintButton.tsx` | Button gradient and glow treatment |

---

## 7. Light Theme Considerations

All design tokens described above use dark theme values. The light theme must receive equivalent treatment:

- **Glass panels**: Use `rgba(0, 0, 0, 0.03)` → `rgba(0, 0, 0, 0.05)` instead of white-based transparency. Top-edge highlight becomes `from-black/5 via-black/2 to-transparent`.
- **Shadow stacks**: Lighter ambient shadows — reduce opacity by ~40% compared to dark theme values.
- **Gradient text (logo)**: Switch to a dark gold → charcoal gradient for readability on light backgrounds.
- **Status glow**: Reduce glow intensity by ~30% — glows are more visible on light backgrounds.
- **Background**: Replace dark navy gradients with soft warm-white gradients. Grid overlay uses `rgba(0, 0, 0, 0.03)`.
- **Ambient animation**: Same keyframe structure, lighter color palette.
- **Buttons**: Primary CTA gradient stays gold-amber but with darker text for contrast. Glow shadow uses lower opacity.

All changes must be applied via the existing CSS custom property system (`[data-theme='light']` overrides) to keep theming centralized.

---

## 8. What This Does NOT Include

- No new features, pages, or routes
- No changes to calculation logic or rule engine
- No changes to data flow, state management, or API
- No new dependencies (all achievable with existing Framer Motion + Tailwind + CSS)
- No changes to the print/report page styling (separate concern)

---

## 9. Success Criteria

- All components visually consistent with the refined glass system
- Dark and light themes both updated with the new design tokens
- No regressions in accessibility (contrast ratios maintained or improved)
- No regressions in mobile responsiveness
- Existing Framer Motion animations preserved and enhanced
- Build passes with no new warnings
