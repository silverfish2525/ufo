# Changelog

All notable changes to this project will be documented in this file.

## v3.0.0 (unreleased)

### v3.0.0 Breaking

- **ESM-only distribution.** The package no longer ships a CommonJS
  build. `dist/` now contains only `index.js` + `index.d.ts`. The
  `package.json` `exports` map has been collapsed to a single ESM
  entry; the legacy `main`, `module`, and `require`-branch fields
  have been removed.

  **Migrating from v2.x**:

  - **Node 22+ (`>=22.12.0`) consumers using `require()`**: no change
    needed — Node's `require(esm)` support handles the ESM package
    transparently.
  - **Older `require()` consumers**: switch to `import`, or pin to
    `better-ufo@^2`.
  - **Bundler consumers (Webpack, Rollup, Vite, esbuild, tsdown,
    Metro, Parcel)**: no change needed — all resolve `exports`.
  - **TypeScript consumers**: no change needed — the single
    `dist/index.d.ts` is discovered via the `types` field and the
    `exports` map.

### v3.0.0 Toolchain

- Migrated the full toolchain to Vite+ (`vp`) 0.2.3 — one CLI wraps
  Vite, Vitest, Oxlint, Oxfmt, tsdown, and Vite-Task. See
  `vite.config.ts` for the unified configuration.
- Coverage now enforces per-file ratchet floors on the
  security-critical parser (`src/parse.ts`) and every
  `src/utils/*.ts` implementation file, in addition to the global
  90 %-line / 85 %-branch minimum.
- Explicit `pack.target: "es2022"` in `vite.config.ts` (Chrome 94+,
  Firefox 93+, Safari 15+, Node 22+).

## v2.0.1 (2026-07-03)

Docs and repo-hygiene release. No runtime or API changes.

### v2.0.1 Documentation

- Sharpened the TypeScript type-safety wording in `README.md` to
  more accurately describe the literal-preserving inference
  (`parseURL`, `withHost`, `withPort`, etc.).

### v2.0.1 Chore

- Added tag-triggered `.github/workflows/publish.yml` for
  Sigstore-provenance npm releases.
- Dropped `publishConfig.provenance` from `package.json` so local
  `npm publish` invocations don't require a CI OIDC token.
- Minor repository housekeeping.

## v2.0.0 (2026-07-01)

First stable release of `better-ufo` — a security-hardened,
WHATWG-conformant fork of
[`unjs/ufo@1.6.4`](https://www.npmjs.com/package/ufo/v/1.6.4).
Consumers of the original `ufo` package can drop in via a
package-manager override (see the
[README](./README.md#drop-in-replacement-for-ufo)).

The forked delta comprises: 6 security hardenings, WHATWG-compliance
fixes across parsing / encoding / opaque schemes / IPv6 authorities,
5 new URL modifier APIs (`withHost`, `withPort`, `withoutPort`,
`withoutAuth`, `withPathParameters`), a literal-preserving TypeScript
inference engine, and a modernised zero-runtime-dep toolchain
(tsdown, `@antfu/eslint-config`, type-aware ESLint, ES2022 target,
Node 22+ floor).

### v2.0.0 Breaking

- **Minimum Node.js version raised to `>=22.0.0`.** Node 20 reached
  end-of-life on 2026-04-30 and is no longer supported. Consumers on
  Node 20 will see an `EBADENGINE` warning on install; the shipped
  ES2022 output may still execute under `--experimental-*` flags but
  this configuration is untested.

### v2.0.0 Security

- **Breaking (default)**: `joinURL` and `withBase` now normalize a
  leading `//` in the concatenated result to a single `/` to prevent
  open-redirect via a protocol-relative payload when the base is empty
  or `"/"`. Callers who genuinely need protocol-relative construction
  must pass the new `{ allowProtocolRelative: true }` option. Example:
  - Before: `joinURL("", "//attacker.com")` → `"//attacker.com"`
  - After: `joinURL("", "//attacker.com")` → `"/attacker.com"`
  - After: `joinURL("", "//host", { allowProtocolRelative: true })`
    → `"//host"`
  - Base already carrying a scheme or `//` prefix is unaffected:
    `joinURL("//cdn.example/", "a")` → `"//cdn.example/a"`
    (unchanged).
  - Related prior art: [#335](https://github.com/unjs/ufo/pull/335)
    (equivalent hardening in `withoutBase`).

---

For the history of upstream `unjs/ufo` releases that this fork is based on,
see the [upstream CHANGELOG](https://github.com/unjs/ufo/blob/main/CHANGELOG.md).
