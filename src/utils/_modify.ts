// oxlint-disable-next-line import/no-cycle -- structural cycle via parse→utils barrel; value imports required
import type { ParsedURL } from "../parse";
import type { JoinURLOptions } from "./protocol";
// oxlint-disable-next-line import/no-cycle -- structural cycle via parse→utils barrel; value imports required
import { parseURL, stringifyParsedURL } from "../parse";
import { hasProtocol } from "./protocol";

export function modifyParsedURL(input: string, fn: (parsed: ParsedURL) => void): string {
  const parsed = parseURL(input);
  fn(parsed);
  return stringifyParsedURL(parsed);
}

export function normalizeProtocolRelative(
  result: string,
  base: string,
  opts?: JoinURLOptions,
): string {
  if (opts?.allowProtocolRelative === true) {
    return result;
  }
  if (!result.startsWith("//")) {
    return result;
  }
  if (hasProtocol(base, { acceptRelative: true })) {
    return result;
  }
  return `/${result.replace(/^\/+/u, "")}`;
}
