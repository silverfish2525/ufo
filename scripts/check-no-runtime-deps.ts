// Guards better-ufo's zero-runtime-dependency invariant.
// See advisor-plans/012-deps-ci-dx-hygiene.md (Stage 4) for rationale.
import process from "node:process";
import pkg from "../package.json" with { type: "json" };

const deps = Object.keys((pkg as { dependencies?: Record<string, string> }).dependencies ?? {});
if (deps.length > 0) {
  console.error(
    "better-ufo must have zero runtime dependencies. Found:",
    deps.join(", "),
  );

  process.exit(1);
}
console.log("OK: zero runtime dependencies");
