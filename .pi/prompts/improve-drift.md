---
description: Run all AGENTS.md guardrail checks against the current working-tree diff
---

Load and follow the `improve` skill at `.agents/skills/improve/SKILL.md`.

Mode: **drift check** — run every AGENTS.md banned-pattern rule + every audit script against the
current working-tree diff. Report violations in the improve "Finding format" tagged `DRIFT-NNN`.

Procedure:

1. Compute touched file set: `git diff --name-only HEAD`
2. Run each check scoped to those files only:
   ```bash
   pnpm exec sg scan $(git diff --name-only HEAD | tr '\n' ' ')
   node tools/check-better-result-v2.mjs $(git diff --name-only HEAD | tr '\n' ' ')
   node tools/check-vue-section-0-2.mjs
   node tools/audit-single-source-of-truth.mjs
   node tools/audit-shallow-wrappers.mjs
   ```
3. For each hit, report: rule message + `file:line` + canonical fix (cite the AGENTS.md section).
4. End with exactly one summary line:
   - Violations found: `DRIFT: <N> violations — fix before declaring done.`
   - Clean: `DRIFT: 0 — diff conforms to AGENTS.md.`

Read-only. No writes. No fixes.
