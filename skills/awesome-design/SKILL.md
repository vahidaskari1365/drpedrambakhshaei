---
name: awesome-design
description: >-
  Curated library of 84 DESIGN.md design-system documents (Apple, Stripe, Linear,
  Vercel, Airbnb, Nike, Notion, Figma, Tesla and more) analyzed by VoltAgent.
  Use when designing or restyling a page/component and you want a real, battle-tested
  design language as the art-direction reference — e.g. "build this hero like Linear",
  "make the dashboard feel like Stripe", "apply Apple-like typography". Provides
  analyzed patterns, design tokens (colors, type, spacing), component rules and
  do/don't guidance per brand. NOT for SEO, NOT for code review — pure visual design
  direction.
---

# Awesome DESIGN.md — Design-Language Library

A local library of 84 `DESIGN.md` documents under `design-md/`. Each file is a
complete design-system analysis of a real, developer-focused or consumer product:
tokens (color, typography, spacing, radius, shadow), layout principles, component
conventions, motion rules, and anti-patterns.

## How to use

1. **Pick the reference brand** whose design language best matches the requested
   direction. Quick map:
   - `linear.app`, `vercel`, `stripe`, `mercury` — minimal SaaS, sharp typography,
     dark-first, subtle borders
   - `apple`, `nike`, `tesla` — premium consumer, huge type, dramatic photography
   - `notion`, `slack`, `miro` — friendly productivity, rounded, colorful accents
   - `supabase`, `mongodb`, `sentry`, `clickhouse` — developer tools, dense data UI
   - `airbnb`, `spotify`, `starbucks`, `pinterest` — consumer warmth, imagery-led
2. **Read the chosen file** (e.g. `design-md/linear.app/DESIGN.md`) before writing
   any UI code for that task.
3. **Extract, don't copy**: pull the tokens, hierarchy and spacing logic, then adapt
   to the project's own palette/RTL/font stack. Never lift a brand's logo, name or
   proprietary assets.
4. **Stay consistent**: one reference per page/module. Mixing multiple brand styles
   in one view produces slop.
5. For RTL (Persian) projects like دادورزان: mirror layout logic, keep the brand's
   rhythm and weight scale, and preserve accessibility contrast from the doc.

## When NOT to use

- The project already has a defined design system — follow it instead.
- The task is functional (APIs, data, tests) with no visual surface.

## Library index

Run `ls design-md/` for the full list of 84 brands. Each subfolder contains a
`DESIGN.md` (some include extra asset files).
