const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const eslintConfigPrettier = require('eslint-config-prettier')
const styleGuide = require('eslint-config-standard')

module.exports =
...[].concat(styleGuide) [
  eslintConfigPrettier,
  // standard,
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
