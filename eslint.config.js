import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(['dist']),
  js.configs.recommended,
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    languageOptions: { globals: globals.node },
    "rules": {
      "no-unused-vars": "warn"
    }
  },
]);
