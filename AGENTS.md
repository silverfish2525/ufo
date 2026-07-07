# AGENTS.md — better-ufo

Guidance for AI coding agents working in this repository.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at <https://viteplus.dev/guide/>.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Repo layout

- `src/` — library source. Barrel export from `src/index.ts`; core
  parsers in `src/parse.ts`; functional URL utilities in
  `src/utils.ts`; query helpers in `src/query.ts`; vendored punycode
  in `src/punycode.ts`.
- `tests/` — Vitest suites. Runtime tests: `tests/*.test.ts`. Type
  tests: `tests/types.test-d.ts` (run by `vp test run --typecheck`).
  WPT fixture: `tests/fixture/urltestdata.json`.
- `dist/` — build output. Do NOT commit changes here; `vp pack`
  regenerates on `pnpm build`.
- `scripts/` — repo scripts. Currently:
  `check-no-runtime-deps.ts` (run via
  `node --experimental-strip-types`).

## Hot files (understand these before proposing changes)

- `src/utils.ts` — largest module; functional URL builders
  (`joinURL`, `withBase`, `withQuery`, `withFragment`, etc.).
  Many hot paths.
- `src/parse.ts` — `parseURL`, `parsePath`, `parseHost`,
  `parseAuth`, `stringifyParsedURL`. Interacts closely with
  `src/utils.ts`.
- `src/_types.ts` — the type-level fold utilities
  (`AllStringLiteral`, `Refine`, `FoldJoin`, `QueryParts`, etc.).
  Every literal-preserving overload depends on this file. Read
  before touching return types.

## Coding style

- **Zero runtime dependencies.** Enforced by
  `scripts/check-no-runtime-deps.ts`. Do not add to
  `"dependencies"`. Dev-only tools go in `"devDependencies"`.
- **No DOM assumptions.** `better-ufo` runs in Node, browsers,
  workers, edge runtimes, Deno, Bun.
- **Node floor: `>=22.0.0`.** Node 20 is EOL (2026-04) and is not
  tested. Do not add branches that depend on features newer than
  Node 22 without gating them behind a feature-detection.
- **No implicit `new URL()`.** `better-ufo`'s value proposition is a
  functional, WHATWG-adjacent API distinct from the WHATWG `URL`
  class. Use `parseURL` / `stringifyParsedURL`. The deprecated `$URL`
  class is the sole exception — it implements the `URL` interface.
- **Formatting**: Oxfmt (Prettier-compat) via `vp fmt --write`. Linting
  via Oxlint through `vp lint` / `vp check --fix`.

## Verification commands

```bash
vp install          # sync deps (delegates to pnpm)
vp check            # oxlint + oxfmt in one pass
vp test run         # vitest one-shot
vp test run --typecheck  # + type-level tests
pnpm test           # full quality gate: zero-deps + check + typecheck
vp pack             # ESM only: index.js + index.d.ts + attw + publint
pnpm build          # alias for `vp pack`
pnpm build:docs     # regenerate README via automd
pnpm knip           # find unused files/exports/deps
```

## Gotchas

- **`automd` rewrites `README.md`** on `pnpm build:docs` and
  `pnpm prepack`, and via `.github/workflows/autofix.yml`. Local
  `vp pack` does not touch `README.md`.
- **Package manager is `pnpm@11.10.0`** (pinned exactly — corepack
  requires an exact version). Do not run `npm install` or `yarn`.
- **`vite` is aliased** — `vite: npm:@voidzero-dev/vite-plus-core` in
  `pnpm-workspace.yaml#catalog`. Do not "fix" it back to upstream vite.
- **Conventional commits.** Match `git log --format=%s | head`.
- **Upstream vs fork.** This is `better-ufo`, a fork of `unjs/ufo`.
  Historical PR / issue references in comments
  (`unjs/ufo#237`, etc.) intentionally point to upstream. Only
  rewrite those when the referenced work is now closed or when it
  has migrated.
