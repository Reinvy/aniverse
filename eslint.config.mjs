import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated code — never lint or format (huge, machine-written,
    // regenerated on every `prisma generate`). Linting it wastes minutes
    // of CI/agent time for zero signal.
    "src/generated/**",
  ]),
]);

export default eslintConfig;
