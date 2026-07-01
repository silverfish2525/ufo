---
description: Cheap improve pass — hotspots + top findings only (read-only)
---

Load and follow the `improve` skill at `.agents/skills/improve/SKILL.md`.

Mode: **quick audit**.

- Skip exhaustive enumeration. Hit the obvious hotspots: hot files (most-changed in the last 30 days
  via `git log --name-only --since='30 days ago' | sort | uniq -c | sort -rn | head -20`),
  entrypoints, the biggest modules, and known-debt areas surfaced by `AGENTS.md` / `docs/adr/`.
- Stop at ~8-12 findings, ranked by leverage. Don't go deeper unless I ask.
- Output target: `advisor-plans/` (not `plans/`).
- Read-only. Plans only — never edits source.

Bring me the findings table first; I'll pick which become plans.
