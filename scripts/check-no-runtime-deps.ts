import process from "node:process";
import pkg from "../package.json" with { type: "json" };

const deps = "dependencies" in pkg && pkg.dependencies ? Object.keys(pkg.dependencies) : [];
if (deps.length > 0) {
  console.error("better-ufo must have zero runtime dependencies. Found:", deps.join(", "));
  process.exit(1);
}
console.log("OK: zero runtime dependencies");
