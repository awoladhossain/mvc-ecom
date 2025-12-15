import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,

      // Backend-friendly rules
      "no-console": "off",
      "no-underscore-dangle": "off",
      "consistent-return": "off",
    },
  },
];
