---
description: Feature/direction suggestions — where to take the project next (evidence-cited)
---

Load and follow the `improve` skill at `.agents/skills/improve/SKILL.md`.

Mode: **direction** — feature suggestions, roadmap moves, product-shape proposals.

Hard rule (from the skill): every suggestion must cite **evidence from the repo itself** — a TODO, a
gap in `docs/prds/`, a pattern in `docs/plans/`, an existing partial implementation, a user-visible
inconsistency. No generic idea-slop ("you should add AI features", "consider a mobile app").

Ground the suggestions in:

- `docs/plans/2026-06-16-roadmap-to-cws.md` — active campaign roadmap
- `docs/prds/README.md` — current PRDs
- `docs/adr/` — decided architecture (don't suggest re-litigating these)
- `docs/cws-submission-checklist.md` — gating criteria for first CWS submission

Output target: `advisor-plans/`. Read-only.

Bring me a ranked list of 5–10 suggestions, each with `evidence:` (file:line or doc reference),
`effort:` (S/M/L), `confidence:` (LOW/MED/HIGH), and a one-line rationale. I'll pick which become
plans.
