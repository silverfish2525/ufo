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

const DEFAULT_INTERPOLATE = /\{(?<name>[\s\S]+?)\}/gu;

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
  const { interpolate = DEFAULT_INTERPOLATE, onMissing = "leave" } = options;
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
    const key = name.trim();
    if (!Object.hasOwn(parameters, key)) {
      switch (onMissing) {
        case "throw": {
          throw new TypeError(`withPathParameters: missing value for placeholder "${key}".`);
        }
        case "empty": {
          return "";
        }
        default: {
          return match;
        }
      }
    }
    const raw = parameters[key];
    if (raw === undefined) {
      // Should be unreachable given the hasOwn check above, but narrows for TS.
      return match;
    }
    return encodeParam(typeof raw === "number" ? String(raw) : raw);
  });
}
