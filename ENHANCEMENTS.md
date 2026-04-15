# TimeBar — Enhancement Roadmap

## PRD Roadmap (already planned)

### v1.1 — Near-term
- Latent damage negligence module (s.14A knowledge-based regime)
- Fatal accident / dependency claims
- Printable result sheet (PDF export of result card + reasoning trail)

### v1.2 — Medium-term
- Saved calculations (local storage or account-based)
- Shareable links (encode inputs into URL params)
- Changelog with legal review version history

### v2 — Long-term
- India jurisdiction support
- Side-by-side jurisdiction comparison tool
- Expanded claim types

---

## High-Impact Additions (not in PRD)

### UX & Usability
1. **Dark/light theme toggle** — currently dark-only; solicitors in bright offices may prefer light mode
2. **Input validation feedback** — inline errors for invalid/future dates before hitting calculate
3. **Progress indicator** — show which questions remain before a result can be generated
4. **Keyboard navigation** — date picker shortcuts, tab-through flow for power users
5. **Mobile PWA** — installable on phone for quick checks in court or at client meetings

### Functionality
6. **Side-by-side claim comparison** — run two claim types simultaneously (e.g. contract vs tort for the same facts)
7. **Calendar export (.ics)** — export limitation deadline + 90/30/7-day reminders directly to Outlook/Google Calendar
8. **PDF/print report** — professional output with statute refs, reasoning trail, and disclaimer for file notes
9. **Batch calculator** — upload CSV of accrual dates for multiple claims, get bulk results
10. **Calculation history** — browser localStorage to recall recent calculations without re-entering data

### Analytics (minimal, per PRD)
11. **Anonymous usage events** — track claim type selection, result status, and copy usage (PRD requires this)
12. **Error boundary tracking** — catch and surface calculation errors gracefully

### Trust & Compliance
13. **Rule version diff viewer** — on the changelog page, show what changed between rule versions
14. **Last-reviewed date badges** — display when each rule file was last legally reviewed
15. **Feedback widget** — let users flag incorrect results for legal review

### Developer/Infra
16. **E2E tests with Playwright** — PRD mentions this; currently missing
17. **CI/CD pipeline** — GitHub Actions running vitest + build on every PR
18. **API route** — expose `/api/calculate` for integration with case management systems

---

## Quick Wins (low effort, high value)

| Feature | Effort | Impact |
|---|---|---|
| Calendar .ics export | Small | High — lawyers live in calendars |
| localStorage history | Small | High — avoid re-entry |
| Inline date validation | Small | Medium — better UX |
| PDF print stylesheet | Medium | High — file note standard |
| Anonymous analytics | Small | Medium — PRD requirement |
| CI with GitHub Actions | Small | High — prevents regressions |
