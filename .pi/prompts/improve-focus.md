---
description: Focused improve — single category (security|perf|tests|bugs|debt|deps|dx|docs)
argument-hint: "<category>"
---

Load and follow the `improve` skill at `.agents/skills/improve/SKILL.md`.

Mode: **focused audit on a single category**: `$1`

Valid categories:

- `security` — auth, input validation, prompt-injection surfaces, secret exposure, SSRF, XSS in
  content-script DOM injection, CSP holes
- `perf` — hot paths, O(n²), unnecessary re-renders, large bundles, slow build, memory leaks
- `tests` — coverage gaps, brittle mocks, missing seam tests (per project skill
  `testing-strategy-malsync-wxt`)
- `bugs` / `correctness` — logic errors, off-by-one, Result/Promise misuse, race conditions
- `debt` / `tech-debt` — duplicated code, dead code, NIH wrappers (ADR-0023), banned-pattern residue
- `deps` — outdated, redundant, security-advised packages
- `dx` — slow loops, awkward APIs, missing types, repetitive boilerplate
- `docs` — stale ADRs, missing PRDs, drift between code and `docs/plans/`
- `direction` / `next` — feature suggestions, product roadmap moves — every one MUST cite repo
  evidence (no idea-slop)

If `$1` is empty or unrecognised, ask me which category before starting.

Output target: `advisor-plans/`. Read-only.
