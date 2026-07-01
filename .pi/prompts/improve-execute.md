---
description: Dispatch a cheaper executor on an improve plan in a git worktree, then review
argument-hint: "<advisor-plans/NNN-slug.md>"
---

Load and follow the `improve` skill at `.agents/skills/improve/SKILL.md` — specifically the
**execute** workflow in `references/closing-the-loop.md`.

Plan to execute: **$1**

If `$1` is empty, list the plans in `advisor-plans/` and ask me which one.

Dispatch shape (per AGENTS.md §0.6 + §3 + §7):

1. Create an isolated git worktree: use the `worktree` tool, NOT `git worktree add` directly (so
   cleanup happens automatically).
2. Pick the executor model per project skill `model-routing-vue-campaign` — typically `sonnet` or
   `haiku` for mechanical work, `opus` only when the plan demands judgment. The plan itself says
   which.
3. Dispatch as `general-purpose` (or `worker`) subagent with `run_in_background: false`,
   `isolation: "worktree"`. Brief the executor with the plan path and AGENTS.md §1 zero-tolerance
   gate.
4. When the executor reports back, **YOU** review the diff like a tech lead:
   - Re-run every "done criterion" command from the plan against the worktree.
   - Check scope compliance against the plan's "out-of-scope" list.
   - Read the actual diff (`git -C <worktree> diff main`) against intent.
5. Render a verdict: APPROVE / REVISE / BLOCK. Max 2 revision rounds per AGENTS.md §3. Merging stays
   with me.
6. If APPROVE and the diff is large (>50 LOC or touches `src/`/`app/`/`lib/`/`pages/`), recommend
   `/cross-review` against the worktree before merge.

Reminder: you do NOT edit code directly. The executor edits in the worktree; you review the diff.
Merging is the user's call.
