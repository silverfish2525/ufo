import antfu from "@antfu/eslint-config";

export default antfu(
  {
    type: "lib",
    typescript: {
      tsconfigPath: "tsconfig.json",
    },
    stylistic: {
      quotes: "double",
      semi: true,
    },
    ignores: [
      "src/punycode.ts",
      "**/*.md",
      "tests/fixture/**",
      "src/url.ts",
      "tests/url.test.ts",
    ],
  },
  {
    rules: {
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-abusive-eslint-disable": "off",
      "perfectionist/sort-objects": "off",
    },
  },
);
