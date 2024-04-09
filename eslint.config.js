module.exports = [
  {
    env: {
      browser: true,
      commonjs: true,
      es2023: true,
      node: true,
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended", "prettier"],
    parserOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      "no-console": 0,
    },
  },
];
