---
description: Full codebase audit → prioritised findings → handoff plans (read-only)
argument-hint: "[focus-area]"
---

Load and follow the `improve` skill at `.agents/skills/improve/SKILL.md`.

Mode: **full audit** (Phase 1 Recon → Phase 2 Audit across all 9 categories → Phase 3 Vet → Phase 4
Prioritise → Phase 5 Plan).

${1:+Optional focus / extra direction from user: "$@"}

Hard reminders before you start:

- You are a **read-only advisor**. Never edit source code. Only writes go to `advisor-plans/`.
- This repo pins the output directory to **`advisor-plans/`** (see `advisor-plans/README.md`), NOT
  `plans/` — the latter would collide with `docs/plans/` (the human-authored campaign roadmap).
- Ingest `AGENTS.md`, `docs/adr/`, `docs/plans/README.md`, `docs/prds/README.md` during recon so
  plans speak the repo's vocabulary (§1 commit gate, §6 `Result<T,E>`, §7 type-flow, §8
  ecosystem-first, ADR-0023 no-NIH-wrappers, etc.) and decided tradeoffs aren't re-flagged.
- Findings table comes back to me first — I pick which become plans before you write anything.
