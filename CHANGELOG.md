# Changelog

All notable changes to this project will be documented in this file.

## v3.0.0 (2026-07-11)

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

- **`withPathParameters`: `options.interpolate` (RegExp) removed;
  replaced by `options.delimiters` (string pair).** The regex-based
  interpolate option executed a caller-supplied `RegExp` on library
  input, which is a ReDoS surface (GitHub CodeQL alert
  `js/polynomial-redos`) and cannot be made ReDoS-safe synchronously.
  The new `options.delimiters: readonly [string, string]` accepts a
  linear-time delimiter pair — no regex is ever executed on the
  template.

  **Migrating from v2.x**:

  - `{ interpolate: /\{\{([\s\S]+?)\}\}/g }` → `{ delimiters: ["{{", "}}"] }`
  - `{ interpolate: /\{([\s\S]+?)\}/g }` → omit the option (default is `["{", "}"]`)
  - Custom regex shapes with no direct delimiter equivalent: pre-transform
    the template to `{name}` shape before calling `withPathParameters`.

- **README:** the "Drop-in replacement for `ufo`" section has been
  removed. `better-ufo` is its own package — install and import
  under its own name. No `ufo` compatibility contract is maintained.

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

### v3.0.0 Type Safety

A ground-up rewrite of the internal type-fold engines plus a wide fan
of new literal-preserving overloads. The public API is unchanged; the
return types are now sharper for known-literal inputs and continue to
degrade cleanly to the base runtime type for genuinely-dynamic ones.

**New type-fold engines** (`src/_types.ts`):

- `ParseURLState<S>` — state machine mirroring the runtime
  `parseURL` branch order (script scheme, special-scheme
  authority, opaque URI, protocol-relative, relative path),
  producing an exact
  `{ protocol; host; auth; pathname; search; hash }` for each
  modeled branch (including opaque `mailto:`/`data:`/script
  schemes). Widens to `ParsedURLBase` only for the unmodeled
  edges: a leading space or NUL, a backslash-containing
  relative path, or a schemeish colon whose "scheme" contains
  characters `ScanScheme` rejects (e.g. `a_b://host/path`).
- `NormalizeURLState<S>` / `StringifyURLState<S>` — slot-wise
  normalization + composition over the parse state, feeding the
  `normalizeURL` refinement.
- `ResolveState<Base, Seg>` + `FoldResolveState<...>` — folded
  resolve over a variadic segment tuple with `{...base, ...seg}`
  search-merge; multi-key merged queries widen (object key order
  is the boundary).
- `JoinRelativeURLResult<Base, Rest>` — signed-depth dot-segment
  fold. Physical stack + `Underflow` tuple; final depth reconciled
  by pairwise cancellation, producing `../` prefixes for
  net-negative depth exactly like the runtime.
- `CleanDoubleSlashes<S>` — slot-wise fold that preserves the
  query and fragment tails verbatim and lets the `://` scheme
  separator survive the path collapse.
- `DecodePathScan<S>` — character scanner; `%2F` is retained,
  `%20` decodes to a literal space, and any unmodeled `%XX` triple
  widens rather than emitting a wrong exact literal.
- `StringifyQueryItem<K, V>` — encoder-backed dispatch (union
  distribution, tuple-array expansion, `null`/empty → `K=`), fed
  into `StringifyQueryResult<T>` for `stringifyQuery` /
  `encodeQueryItem`.
- `FilterQueryResult<S>` — identity literal for inputs without
  `?` (the runtime short-circuits before the predicate runs);
  parametrized inputs widen because the predicate is opaque to
  the type system.
- `ExactPathParameters<T, P, O?>` / `ExtractPathParameters<T>` /
  `PathParametersFor<T, O?>` / `WithPathParametersResult<T, P, O?>`
  — the machinery behind `withPathParameters`; also re-exported
  from the barrel.

**New literal-preserving overloads** (behavior unchanged, return
types sharpened):

- `src/encoding.ts` — `encode`, `encodeHash`, `encodeQueryValue`,
  `encodeQueryKey`, `encodePath`, `encodeParam`, `decode`,
  `decodePath`, `decodeQueryKey`, `decodeQueryValue` all gain a
  `<const S extends string>` overload that returns the exact
  encoded/decoded literal for ASCII inputs.
- `src/parse.ts` — `parseAuth`, `parseHost`, `stringifyParsedURL`
  gain literal-preserving overloads; `parseURL` and `parsePath`
  now dispatch through the new `ParseURLState` engine.
- `src/query.ts` — `parseQuery`, `encodeQueryItem`,
  `stringifyQuery` gain literal-preserving overloads.
- `src/utils/base.ts` — `withBase`, `withoutBase` gain
  literal-preserving overloads (base normalized, path composed).
- `src/utils/host.ts` — `withHost`, `withPort`, `withoutPort`,
  `withoutAuth` gain literal-preserving overloads.
- `src/utils/path-parameters.ts` — `withPathParameters` gains a
  strict overload with `ExactPathParameters` bounds that rejects
  missing template keys at compile time. A compromise fallback
  accepts `onMissing: "empty" | "leave"` and returns `string`;
  the default and `onMissing: "throw"` stay strict. The removed
  `options.interpolate` is replaced by a linear-time
  `options.delimiters` string pair — see the v3.0.0 Breaking
  section above.
- `src/utils/predicates.ts` — `isEmptyURL`, `isNonEmptyURL`,
  `isSamePath`, `isEqual` gain literal `true`/`false` returns
  where the input shape is decidable.
- `src/utils/protocol.ts` — `hasProtocol` gains
  literal-preserving overloads for each of its three signatures
  (input-only, `input + acceptRelative: boolean`, and
  `input + { acceptRelative?; strict? }`).
- `src/utils/query-ops.ts` — `filterQuery` gains a
  literal-preserving overload backed by `FilterQueryResult`.

**Soundness fixes** (previously wrong exact types → now widen or
match runtime):

- `stringifyQuery({ a: "1" | undefined, b: "2" })` — the
  distributive union hole in the multi-key detector no longer
  emits a wrong exact literal; any union branch producing
  ≥ 2 parts widens the whole call.
- `parseQuery("?foo=bar")` — the leading `?` is now stripped
  before scanning keys, matching the runtime normalization.
- `parseHost("foo.com:1e2")` / `parseHost("foo.com:1.5")` /
  `parseHost("foo.com:")` — the bare-host port split now uses a
  digit-only predicate (`IsAllDigits<P>`) rather than
  `${number}`, which admitted scientific / decimal / empty forms
  the runtime `/\d+/` rejects.
- `parseHost("[::1]:")` — bracketed IPv6 authority with an empty
  port now correctly returns `{ hostname: "[::1]"; port: undefined }`
  rather than propagating an empty-string port literal.
- `stringifyParsedURL(parseURL("//x.io/a"))` — protocol-relative
  round-trips now widen to `string` rather than emit a wrong
  exact `"x.io/a"`; the runtime `parseURL` sets a hidden
  `protocolRelative` symbol that is invisible in the public type,
  so composition of an empty-protocol shape with a non-empty
  authority MUST widen. Explicit-protocol shapes stay exact.
- `stringifyParsedURL` also short-circuits to `string` when any
  field on the input bag is broad or optional (previously
  synthesized a wrong template subtype like
  `${string}//${string}...`).
- `joinRelativeURL("http:", "..")` /
  `joinRelativeURL(maybeScheme, "..")` — parts containing `:`
  now widen. Runtime `joinRelativeURL` has two
  protocol-sentinel branches (skip `..` when
  `segments.length === 1 && hasProtocol(segments[0])`, and merge
  when `sindex === 1 && segments.at(-1)?.endsWith(":/")`) that
  the type-level fold does not model; any `:` widens
  deliberately. Union any-member semantics are handled via
  `true extends HasJoinRelativeUnmodeled<H>`, closing a
  distributive hole where `"a" | "http:"` slipped past strict
  `extends true`.
- `joinRelativeURL` leading prefix is now derived from the first
  truthy element of `parts.filter(Boolean)` (matching the runtime
  drop of an empty base), and the trailing slash from the last
  truthy element. `..` no longer consumes underflow on push; the
  final depth is reconciled by pairwise cancellation at the end
  of the fold.
- `withPort` validates the port BEFORE inspecting the input, so
  `withPort("/only/path", 0 | "abc" | -1)` is `never` (matching
  the runtime `validatePort` order) rather than the input
  literal. 5-digit ports widen to `string` (TypeScript cannot
  discriminate the `10000..65535` runtime range without integer
  arithmetic); 6+ digit and non-integer ports are `never`.
- `isEqual("foo", "/foo")` — the default (`leadingSlash !== true`)
  now normalizes both sides via `withLeadingSlash` before
  comparison, matching the runtime.
- `parseURL("a_b://host/path")` — schemeish inputs whose scheme
  contains `\w`-characters unmodeled by `ScanScheme` now widen to
  `ParsedURLBase` rather than mis-parse as a relative path.

**Documented boundaries** (kept broad on purpose):

- Multi-key object `stringifyQuery` output stays `string`
  (`for...in` runtime order vs. TypeScript's unordered key union).
- Non-ASCII `encode()` stays `string` (UTF-8 byte encoding not
  modeled).
- `%XX` triples other than `%2F` / `%20` stay broad in
  `decodePath` (no full decode table).
- 5-digit port literals widen to `string` in `withPort` (runtime
  accepts `10000..65535`; TypeScript can't discriminate the range
  without integer arithmetic). `ParseHostResult` keeps any
  digit-only port literal exact — it only splits, it does not
  validate range.
- The public `parseURL` shape strips the hidden
  `protocolRelative` marker; downstream composition (see
  `stringifyParsedURL` widening above) widens accordingly.

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
