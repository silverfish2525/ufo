---
description: Critique and tighten an existing improve plan
argument-hint: "<advisor-plans/NNN-slug.md>"
---

Load and follow the `improve` skill at `.agents/skills/improve/SKILL.md`.

Mode: **review-plan** — critique an existing plan and propose tightening edits.

Plan to review: **$1**

If `$1` is empty, list the plans in `advisor-plans/` and ask me which one.

Apply the plan-quality bar from `.agents/skills/improve/references/plan-template.md`:

- Self-contained? (no "as discussed", no missing context)
- Verification gates with exact commands + expected output?
- STOP conditions for when reality drifts?
- Out-of-scope list explicit?
- Code excerpts current (git-stamp drift check)?
- Speaks this repo's vocabulary (`AGENTS.md` §1 gate / §6 Result / §7 type-flow / §8 ecosystem-first
  / ADR-0023)?

Output: a critique in chat (don't edit the plan yet), then ask if I want you to apply the tightening
edits. If yes, write the updated plan back to the same file — that is the ONLY allowed write.

Read-only on source code.
