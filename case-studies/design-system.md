# Boring is safe — a design system for wealth management

*Alphanso · Sole product designer · Web, tablet, mobile*

---

**TL;DR.** As the only designer at Alphanso, I built a design system for users tracking $250k+ portfolios around one belief: in fintech, *boring is safe*. Restraint, familiar patterns, generous space, and clarity over cleverness — applied to 14 component families, a wealth-management vocabulary, and a 13-chart data viz library. Screen mockups went from 1–2 days to half a day.

---

## The fracture

I was the only designer on the product, and there was no design system. Every new screen got built by copy-pasting from the last one. By the time we'd shipped six core flows, no two buttons had the same padding, no two tables had the same density, no two headings used the same scale.

For a SaaS tool, that's a quality issue. For a product where users were tracking portfolios of $250,000 or more, it's a trust issue.

People moving real money look for tells. A misaligned number, an inconsistent button, a dashboard that scrolls differently on mobile than on desktop — each one is a small reason to wonder if the rest of the product is also held together with tape. Inconsistency was going to lose us users before features ever did.

So I stopped shipping screens, blocked time, and built the system.

## Context

Alphanso is a wealthtech platform serving people in their 30s with $250k+ portfolios. The product spans web (primary), tablet, and mobile. As the sole designer, I was responsible for everything from research and IA to high-fidelity UI and developer handoff.

That solo constraint shaped how I worked. I couldn't run a 20-user study every sprint. So I made competitor analysis the formal research method and committed to a single design philosophy that could justify every decision down to the component level.

## Research — studying the category

In fintech, what's familiar feels safe. If a transfer flow doesn't work like the user's bank, they get nervous before they trust it. Inventing new patterns where users already know the old ones is a risk, not a strength.

So instead of inventing, I studied. Five competitors covering planning, investing, and full-service wealth management:

| Competitor   | What we learned                              |
|--------------|-----------------------------------------------|
| Wealthsimple | Theme-based investment buckets                |
| Origin       | Planning-led approach                         |
| Facet        | Onboarding flow + pricing transparency        |
| Range        | Planning approach + flat-fee positioning      |
| Titan        | Niche, tech-focused audience                  |

Convention is trust. The job of the system was to make the familiar parts feel calm so the genuinely novel parts of the product — the data, the advisor, the planning logic — could carry the weight.

## The stance — Boring is safe

I committed to one belief: **boring is safe**. People moving real money want familiar, calm, and clear. They don't want to be impressed by gradients. They want to find their numbers and trust them.

That belief turned into four rules. Every component decision had to follow at least one:

**Quiet, not loud.** Every visual choice should mean something. No decoration, no gradients, no shadows that pop. Color is reserved for signal.

**Familiar, not new.** Use what people already know. If the rest of the category does something a particular way, do it that way too — unless there's a real reason not to.

**Roomy, not cramped.** Whitespace is breathing room. Breathing room is trust. Generous padding around money matters.

**Clear, not clever.** Never make the user wonder if something happened. Tabular figures, explicit labels, inline validation, modal confirmations for big actions.

Four rules. Defensible to engineers, PMs, and stakeholders. They're also what I review my own work against.

## Foundations

The token system stays small on purpose.

**Type.** Work Sans for headings, Inter for body and detail. Two families, four weights each, a shared size scale. Numbers use tabular figures so columns line up.

**Color.** An eleven-step grayscale, *Borderline Blue* as the only brand accent, semantic red for losses, semantic green for gains, and a defined data-visualization palette for charts. Beyond that, chromatic colors exist only to carry category meaning — asset class, goal type, service.

**Spacing.** XXS to XXXL on an 8pt grid (with 4 / 12 micro-steps where 8 felt off). Each size has a documented usage note — XS for icon padding, M for component margins, XXL for hero sections.

**Radius.** Two values — 4 and 8. That's it. No pill buttons, no sharp corners.

**Shadow.** One subtle drop shadow. Used sparingly.

The point isn't the values themselves — it's the discipline of saying *no* to anything outside them.

## The system

> [Dashboard screen placeholder — components in context. To be added.]

The DS covers fourteen component families, all built around the four rules.

### Labels — the wealthtech vocabulary

This is the most uniquely wealthtech part of the system. Generic design systems give you buttons and chips. Wealth management needs *vocabulary*. So Labels is organized by domain:

- **Investment service:** Balance, Preserve, Income, Wealth
- **Goal planning:** Retirement, Home, Education, Emergency, Health, Car, Wedding, Vacation
- **Financial wellness:** Debt, Cashflow, Budgeting, Bird's Eye
- **Tax support:** TLH, Advice, Filing
- **Estate planning:** Will, Trusts, Attorney, plus five insurance categories
- **Sync states:** Syncing, Paused, Verify (with the security explanation pattern)

Each label has its own icon and category color. No off-the-shelf DS has this layer because no off-the-shelf product needs it.

### Charts — restraint as the feature

The data viz library covers thirteen chart types — donut, line, stacked bar, big number, geographic, sankey, grouped bar, pivot, customizable charts, KPI tiles, scoring, and more. The discipline is in what's *not* there: no 3D, no gradients, no decorative grid lines. Color is reserved for gain, loss, neutral, or category. Tooltips show exact numbers, never approximations. One chart definition resizes from a 200px sparkline to a full-screen detail view.

### Tables — built atomically

Atoms (cell types — name+icon, number, date, status pill, dropdown), molecules (row patterns combining atoms), then full Component layouts. Numbers are right-aligned and tabular. Density modes for advisor versus client contexts. Color appears only as gain/loss signal in the cells where it matters.

### The rest

- **Buttons + Action Buttons** with full state matrices and platform notes for web, tablet, and mobile
- **Inputs** — calendar, switch, slider, checkbox, radio, text field, autocomplete, search, chips, tabs
- **Navigation** — left panel, top header, plus a Page Navigator built for users with 50+ sessions over years (elliptical compression keeps first / last / current visible)
- **Feedback** — modal, alert banner, toast, in-line, support chat
- **Mobile + Desktop variants** for navigation and account components

## A note on maintenance

A solo-built system stays consistent only if it can review itself. As the surface area grew, I made components self-describing — each one carries enough metadata in its name and structure that documentation, lint, and AI-assisted assembly stay current as the system scales. The system collaborates with me instead of me chasing it.

## Results

The most concrete outcome was speed. Screen mockups that used to take 1–2 days started landing in half a day. Design review turned from *"is this consistent with what we shipped before?"* into *"is this the right pattern for this problem?"* — a much better conversation.

Scope-wise, the system covers fourteen component families, around 100 documented type styles, thirteen-plus chart variants, an atomic table system, and a wealth-management vocabulary that no off-the-shelf system would have given me. All shipped solo, in production.

## Reflection

The system has debt I'd consolidate next:

- **Token naming has accumulated typos and duplicates.** A typo in one of the brand-color namespaces (`Boderline blue` instead of `Borderline blue`) is sitting next to the correct one. Leftover Material 3 and Adobe Spectrum tokens from earlier inspiration phases need to come out.
- **The type scale is probably twice as large as it needs to be.** Around 100 documented styles is sprawl. I'd consolidate to a tighter set.
- **The Dark theme is in development, not shipped.** Light is fully built; foundation tokens for the darkest variants exist but the theme itself isn't done. That's the next milestone.

What designing under *boring is safe* taught me: in regulated, high-stakes domains, restraint is a feature, not a constraint. Originality belongs in the parts of the product users don't see — the data architecture, the chart resize behavior, the labels vocabulary — not in the parts they look at every day.
