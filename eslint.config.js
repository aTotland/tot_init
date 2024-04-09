const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const eslintConfigPrettier = require('eslint-config-prettier')
// const styleGuide = require('eslint-config-standard')
const styleGuide = require('eslint-config-airbnb')

module.exports = [
  eslintConfigPrettier,
  ...[].concat(styleGuide),

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
