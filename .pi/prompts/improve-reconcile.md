---
description: Reconcile advisor-plans/ — verify DONE, unblock BLOCKED, retire fixed
---

Load and follow the `improve` skill at `.agents/skills/improve/SKILL.md` — specifically the
**reconcile** workflow in `references/closing-the-loop.md`.

Mode: **reconcile**.

Procedure:

1. Read `advisor-plans/INDEX.md` (if missing, list all `advisor-plans/*.md` and infer state).
2. For each plan with state DONE: re-run the done criteria. If still green, leave as DONE. If broken
   / regressed, demote to REOPENED and write a one-line note explaining what regressed.
3. For each plan with state BLOCKED: investigate the obstacle by reading current code. If the
   obstacle is gone, unblock. If the obstacle is structural, rewrite the plan to route around it.
4. For each plan with state PENDING: do a drift check against the git commit it was stamped to. If
   the cited code has moved, refresh the code excerpts and STOP conditions.
5. For each plan with state PENDING: also `git log --grep` the slug and `rg <key-symbol>` the
   codebase — if the finding got fixed independently (without going through this plan), retire it
   with a note pointing at the commit that fixed it.
6. Rewrite `advisor-plans/INDEX.md` with the refreshed priority order and dependency graph.

The only writes are to `advisor-plans/`. Read-only on source code.

End with a one-paragraph summary of what changed: how many DONE held, how many BLOCKED unblocked,
how many retired, what's the new top-3 priorities.
