import { describe, expect, it } from "vite-plus/test";
import { toASCII } from "../src/punycode";
import toAsciiTests from "./fixture/toascii.json";

const ignoredTests = new Set(["a­b", "a%C2%ADb"]);

describe("punycode (toASCII)", () => {
  const tests = toAsciiTests
    .splice(1)
    .filter(
      (t): t is Extract<typeof t, { input: string; output: string }> =>
        typeof t === "object" &&
        typeof t.output === "string" &&
        typeof t.input === "string" &&
        !ignoredTests.has(t.input),
    );

  it.each(tests)("$input", (t) => {
    expect(toASCII(t.input)).toBe(t.output);
  });
});
