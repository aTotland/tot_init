const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const eslintConfigPrettier = require('eslint-config-prettier')
const standard = require('eslint-config-standard')

module.exports = [
  eslintConfigPrettier,
  standard,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      ecmaFeatures: {
        jsx: true,
        ejs: true
      }
    },
    plugins: { eslintPluginPrettierRecommended },
    rules: {
      'no-console': 0
    }
  }
]
