import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import svelte from "eslint-plugin-svelte";
import astro from "eslint-plugin-astro";

const browserGlobals = {
  window: "readonly",
  document: "readonly",
  localStorage: "readonly",
  AudioContext: "readonly",
  HTMLCanvasElement: "readonly",
  HTMLInputElement: "readonly",
  HTMLButtonElement: "readonly",
  HTMLDivElement: "readonly",
  CanvasRenderingContext2D: "readonly",
  Event: "readonly",
  MouseEvent: "readonly",
  requestAnimationFrame: "readonly",
  cancelAnimationFrame: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  console: "readonly",
};

export default [
  eslint.configs.recommended,
  ...astro.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: browserGlobals,
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: tsparser,
      },
      globals: browserGlobals,
    },
  },
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
];
