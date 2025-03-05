import globals from "globals";
import airbnbBase from "eslint-config-airbnb-base";
import importPlugin from "eslint-plugin-import";

export default [
  {
    languageOptions: { globals: globals.node },
    plugins: { import: importPlugin },
    rules: {
      ...airbnbBase.rules,
      semi: ["warn", "always"],
      eqeqeq: ["error", "always"],
      "no-var": "error",
    },
  },
];
