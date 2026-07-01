---
description: Exhaustive improve — every package, every category (read-only, expensive)
---

Load and follow the `improve` skill at `.agents/skills/improve/SKILL.md`.

Mode: **deep / exhaustive audit**.

- Walk every package, every entrypoint, every `lib/<domain>/` subsystem.
- All 9 categories: correctness, security, performance, test coverage, tech debt, dependencies &
  migrations, DX, docs, direction.
- Fan out parallel subagents per category per package per AGENTS.md §0.6 — cap at 4 worker subagents
  concurrent (hai-proxy budget), `Explore` for recon, opus only when judgment-heavy.
- Vet every cited `file:line` yourself before showing me anything.
- Output target: `advisor-plans/` (not `plans/`).
- Read-only. Plans only.

This is the expensive variant — use when starting a campaign or pre-release sweep. For day-to-day,
prefer `/improve-quick` or `/improve-branch`.
