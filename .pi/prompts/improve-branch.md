---
description: Improve audit scoped to the current branch's diff vs main (pre-PR pass)
---

Load and follow the `improve` skill at `.agents/skills/improve/SKILL.md`.

Mode: **branch audit** — scope the audit to only the files this branch changes against `main`.

Procedure:

1. Determine current branch: `git branch --show-current`. If on `main`, tell me and stop.
2. Compute the changed file set: `git diff --name-only origin/main...HEAD`. If empty, tell me and
   stop.
3. Audit those files (and their direct importers — one hop) across all 9 categories.
4. Cross-check against the AGENTS.md §1 commit gate: any change that would fail `vp lint` /
   `sg scan` / `tsgo --noEmit` / `pnpm run typecheck:vue` / `vitest run` MUST surface as a finding
   (CORR or DEBT).
5. Bring me the findings table; I pick which become plans.

This is the recommended pre-PR pass. Pair with `/cross-review` for the gpt-5.5 verdict.

Output target: `advisor-plans/`. Read-only.
