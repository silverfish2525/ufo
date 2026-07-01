---
description: Skip the audit and spec one specific thing as an improve plan
argument-hint: "<description>"
---

Load and follow the `improve` skill at `.agents/skills/improve/SKILL.md`.

Mode: **plan-one** — skip Phases 1–4 (recon / audit / vet / prioritise) and go straight to Phase 5
(plan).

Description of the thing to plan: **$@**

If `$@` is empty, ask me what to plan before doing anything else.

Required from you before writing the plan:

1. Confirm you understand the scope (re-state it in your own words, one sentence).
2. Do a focused recon of the directly-relevant files only (not a full repo survey).
3. Verify the AGENTS.md gates apply (§1 commit gate, §6 Result<T,E> if async, §7 type-flow, §8
   ecosystem-first).
4. THEN write the plan to `advisor-plans/<NNN>-<slug>.md` using
   `.agents/skills/improve/references/plan-template.md`.

Plan must be self-contained for a weaker executor: inlined code excerpts, exact file paths,
verification gates (commands with expected output), STOP conditions.

Read-only on source. Plan is the only output.
