module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["eslint-plugin-filename-export"],
  rules: {
    "filename-export/match-named-export": "error",
  },
};
