import { encodeParam } from "../encoding";
import type { ExactPathParameters, PathParametersFor, WithPathParametersResult } from "../_types";

/**
 * Options for {@link withPathParameters}.
 */
export interface WithPathParametersOptions {
  /**
   * Delimiter pair marking a placeholder. Both strings must be non-empty and
   * distinct; the first capture between them is the placeholder name looked
   * up in `parameters`.
   *
   * The scanner is linear-time (`indexOf`-based) and safe against
   * pathological input regardless of delimiter shape.
   *
   * Default: `["{", "}"]` (mustache-single-brace: `{name}`).
   *
   * Common alternatives: `["{{", "}}"]` (mustache-double-brace).
   */
  delimiters?: readonly [string, string];
  /**
   * How to handle a placeholder whose name is not present in `parameters`.
   *
   * - `"leave"` (default) — placeholder is left in the output verbatim.
   * - `"throw"` — throw a `TypeError` naming the missing placeholder.
   * - `"empty"` — replace with the empty string.
   */
  onMissing?: "leave" | "throw" | "empty";
}

function resolveKey(
  key: string,
  parameters: Record<string, string | number>,
  onMissing: "leave" | "throw" | "empty",
): string | undefined {
  if (Object.hasOwn(parameters, key)) {
    const raw = parameters[key];
    return raw === undefined ? undefined : encodeParam(typeof raw === "number" ? String(raw) : raw);
  }
  switch (onMissing) {
    case "throw": {
      throw new TypeError(`withPathParameters: missing value for placeholder "${key}".`);
    }
    case "empty": {
      return "";
    }
    // oxlint-disable-next-line unicorn/no-useless-switch-case -- fall-through matches upstream unjs/ufo and satisfies switch-exhaustiveness-check
    case "leave":
    default: {
      return undefined;
    }
  }
}

/**
 * Linear-time delimiter scanner. Runtime is O(n) in the template length,
 * regardless of delimiter shape — no regex is ever executed on the input,
 * so the routine is safe against ReDoS by construction (closes the
 * `js/polynomial-redos` CodeQL alert that previously fired against the
 * removed `RegExp`-based `interpolate` sink).
 */
function replaceWithDelimiters(
  template: string,
  parameters: Record<string, string | number>,
  scanner: { open: string; close: string; onMissing: "leave" | "throw" | "empty" },
): string {
  const { open, close, onMissing } = scanner;
  const openLen = open.length;
  const closeLen = close.length;
  const minInner = 1;
  let result = "";
  let i = 0;
  const { length } = template;
  while (i < length) {
    const openAt = template.indexOf(open, i);
    if (openAt === -1) {
      result += template.slice(i);
      break;
    }
    const closeAt = template.indexOf(close, openAt + openLen + minInner);
    if (closeAt === -1) {
      result += template.slice(i);
      break;
    }
    result += template.slice(i, openAt);
    const match = template.slice(openAt, closeAt + closeLen);
    const key = template.slice(openAt + openLen, closeAt).trim();
    const sub = resolveKey(key, parameters, onMissing);
    result += sub ?? match;
    i = closeAt + closeLen;
  }
  return result;
}

export function withPathParameters<
  const Template extends string,
  const Parameters extends PathParametersFor<Template>,
>(
  template: Template,
  parameters: ExactPathParameters<Template, Parameters>,
  options?: undefined,
): WithPathParametersResult<Template, Parameters>;
export function withPathParameters<
  const Template extends string,
  const Options extends WithPathParametersOptions,
  const Parameters extends PathParametersFor<Template, Options>,
>(
  template: Template,
  parameters: ExactPathParameters<Template, Parameters, Options>,
  options: Options,
): WithPathParametersResult<Template, Parameters, Options>;
/**
 * Fallback for explicit runtime-tolerant `onMissing` modes: when the caller
 * opts in via `onMissing: "leave" | "empty"`, missing template keys are
 * accepted at compile time and the result widens to `string`. Callers who
 * omit options or set `onMissing: "throw"` still hit the strict overloads.
 */
export function withPathParameters(
  template: string,
  parameters: Record<string, string | number>,
  options: WithPathParametersOptions & { onMissing: "empty" | "leave" },
): string;
/**
 * Substitutes path-parameter placeholders in a URL template with values
 * from a parameters object. Values are percent-encoded via `encodeParam`
 * (which also encodes `/`, so a placeholder occupies exactly one path
 * segment).
 *
 * The template is scanned linearly for `{name}` placeholders — no regex
 * is executed on the input, so the routine is O(n) and safe against
 * ReDoS. Callers who need a different delimiter pair should pass
 * `options.delimiters`, which shares the same linear-time scanner.
 *
 * **Breaking change in v3.0.0:** the deprecated `options.interpolate`
 * regex option has been REMOVED (it executed a caller-supplied `RegExp`
 * on library input and could not be made ReDoS-safe synchronously). Use
 * `options.delimiters` for any non-`{name}` placeholder syntax; the
 * common `{{name}}` case is `{ delimiters: ["{{", "}}"] }`.
 *
 * @example
 * ```js
 * withPathParameters("/api/users/{userId}", { userId: "abc" });
 * // → "/api/users/abc"
 *
 * withPathParameters(
 *   "/api/users/{{userId}}",
 *   { userId: "abc" },
 *   { delimiters: ["{{", "}}"] },
 * );
 * // → "/api/users/abc"
 * ```
 *
 * Closes upstream unjs/ufo#243.
 *
 * @param template - The URL template string with placeholders.
 * @param parameters - An object mapping placeholder names to values.
 * @param [options] - Options controlling placeholder syntax and missing-key behaviour.
 * @returns The URL string with all placeholders substituted.
 * @group utils
 */
export function withPathParameters(
  template: string,
  parameters: Record<string, string | number>,
  options: WithPathParametersOptions = {},
): string {
  const { delimiters, onMissing = "leave" } = options;
  const [open, close] = delimiters ?? ["{", "}"];
  if (open === "" || close === "") {
    throw new TypeError(
      `withPathParameters: options.delimiters entries must be non-empty ` +
        `(got [${JSON.stringify(open)}, ${JSON.stringify(close)}]).`,
    );
  }
  if (open === close) {
    throw new TypeError(
      `withPathParameters: options.delimiters entries must be distinct ` +
        `(got [${JSON.stringify(open)}, ${JSON.stringify(close)}]).`,
    );
  }
  return replaceWithDelimiters(template, parameters, { close, onMissing, open });
}
