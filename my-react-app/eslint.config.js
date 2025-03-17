import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      "plugin:react-hooks/recommended",
      "plugin:react-refresh/recommended",
      "prettier", // Enable eslint-plugin-prettier
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "prettier": prettierPlugin, // Add prettier plugin
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "prettier/prettier": "error", // Report prettier errors as eslint errors
    },
  },
  prettierConfig, // Add eslint-config-prettier
);