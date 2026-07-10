import { encodeParam } from "../encoding";

/**
 * Options for {@link withPathParameters}.
 */
export interface WithPathParametersOptions {
  /**
   * Regex matching a template placeholder. The first capture group is the
   * placeholder name looked up in `parameters`. Must have the `g` flag.
   *
   * Default: `/\{([\s\S]+?)\}/g` (mustache-single-brace: `{name}`).
   */
  interpolate?: RegExp;
  /**
   * How to handle a placeholder whose name is not present in `parameters`.
   *
   * - `"leave"` (default) — placeholder is left in the output verbatim.
   * - `"throw"` — throw a `TypeError` naming the missing placeholder.
   * - `"empty"` — replace with the empty string.
   */
  onMissing?: "leave" | "throw" | "empty";
}

// Returns the substitution string, or `undefined` to signal "keep the original match".
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

// Linear scanner for the default `{name}` syntax (closes CodeQL js/polynomial-redos).
// Preserves the semantics of the old `/\{(.+?)\}/gu` regex: `{}` is not a match, and
// Nested `{`s inside a name are permitted up to the first `}`.
function replaceDefault(
  template: string,
  parameters: Record<string, string | number>,
  onMissing: "leave" | "throw" | "empty",
): string {
  let result = "";
  let i = 0;
  const { length } = template;
  while (i < length) {
    const open = template.indexOf("{", i);
    if (open === -1) {
      result += template.slice(i);
      break;
    }
    // `+ 2` mirrors the ≥1-char-between-braces rule of the old `+?` regex.
    const close = template.indexOf("}", open + 2);
    if (close === -1) {
      result += template.slice(i);
      break;
    }
    result += template.slice(i, open);
    const match = template.slice(open, close + 1);
    const key = template.slice(open + 1, close).trim();
    const sub = resolveKey(key, parameters, onMissing);
    result += sub ?? match;
    i = close + 1;
  }
  return result;
}

/**
 * Substitutes path-parameter placeholders in a URL template with values from
 * a parameters object. Values are percent-encoded via `encodeParam` (which
 * also encodes `/`, so a placeholder occupies exactly one path segment).
 *
 * @example
 * ```js
 * withPathParameters("/api/users/{userId}", { userId: "abc" })
 * // → "/api/users/abc"
 *
 * withPathParameters("/api/users/{userId}/posts/{postId}", {
 *   userId: "42",
 *   postId: "hello",
 * });
 * // → "/api/users/42/posts/hello"
 *
 * // Mustache-style double-brace via custom interpolate:
 * withPathParameters(
 *   "/api/users/{{userId}}",
 *   { userId: "abc" },
 *   { interpolate: /\{\{([\s\S]+?)\}\}/g },
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
  const { interpolate, onMissing = "leave" } = options;
  if (interpolate === undefined) {
    return replaceDefault(template, parameters, onMissing);
  }
  if (!interpolate.flags.includes("g")) {
    throw new TypeError(
      `withPathParameters: options.interpolate must have the /g flag ` +
        `(got ${interpolate.toString()}).`,
    );
  }
  // Reset lastIndex defensively — the caller may have used the regex before.
  interpolate.lastIndex = 0;
  return template.replace(interpolate, (match, name: unknown) => {
    if (typeof name !== "string") {
      return match;
    }
    const sub = resolveKey(name.trim(), parameters, onMissing);
    return sub ?? match;
  });
}
