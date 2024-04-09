const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const eslintConfigPrettier = require('eslint-config-prettier')
const standard = require('eslint-config-standard')

module.exports = [
  eslintConfigPrettier,
  standard,
  {
    plugins: { eslintPluginPrettierRecommended },
    rules: {
      'no-console': 0
    }
  }
]
