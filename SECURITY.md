# Security Policy

## ⚠️ Reporting a Vulnerability

To report a security vulnerability in `better-ufo`:

1. **GitHub Private Security Advisory**:
   <https://github.com/silverfish2525/better-ufo/security/advisories/new>

We aim to acknowledge reports within 72 hours and to ship a fix or
mitigation within 2 weeks for confirmed vulnerabilities.

### Supported versions

Only the **latest published minor** of `better-ufo` receives security fixes.
Supported runtimes:

| Node.js      | Support          |
| ------------ | ---------------- |
| `24.x`       | ✅ tested in CI  |
| `22.x` (LTS) | ✅ tested in CI  |
| `< 22`       | ❌ not supported |

### Scope

Please report:

- URL parsing bugs that allow protocol injection, open-redirect, or
  host spoofing via `parseURL`, `joinURL`, `withBase`, `normalizeURL`,
  or any other public API.
- Encoding/decoding inconsistencies that enable XSS via
  `encodeQueryValue`, `decodePath`, or similar.
- Prototype pollution in query-string parsing.
- Supply chain issues (dependency confusion, malicious commits,
  compromised releases).

### Out of scope

- Behavioural differences vs. `unjs/ufo` that are documented as
  intentional in [`CREDITS.md`](./CREDITS.md) — those are the fork's
  mission, not bugs.
- Test-only files under `tests/fixture/` (WPT `urltestdata.json`,
  `toascii.json` are copied verbatim from the WHATWG test suite).

## Supply chain

- **Zero runtime dependencies** — the published package ships no
  third-party code at runtime.
- **Sigstore provenance** — every npm release is signed with a
  Sigstore OIDC attestation from GitHub Actions. Verify with
  `npm audit signatures`.
- **Lockfile pinned** — `pnpm-lock.yaml` is committed and
  `pnpm install` runs with `--frozen-lockfile` in CI.
- **Dependency updates** — Dependabot is configured to open weekly
  PRs for `devDependencies`.
