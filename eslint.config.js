const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const eslintConfigPrettier = require('eslint-config-prettier')
// const styleGuide = require('eslint-config-standard')

module.exports = [
  eslintConfigPrettier,
  // ...[].concat(styleGuide)

  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
          ejs: true
        }
      }
    },
    plugins: { eslintPluginPrettierRecommended },
    rules: {
      'no-console': 0
    }
  }
]

// .eslintrc.js

module.exports = {
  extends: ['next', 'next/core-web-vitals', 'plugin:prettier/recommended'],
  rules: {
    semi: ['error', 'always'], // Enforce semicolons
    'no-unused-vars': 'error' // Report unused variables
  }
}
