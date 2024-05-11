// .eslintrc.js

module.exports = {
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
    'eslint-config-prettier',
    'eslint-config-standard'
  ],
  rules: {
    'no-unused-vars': 'error', // Report unused variables
    'no-console': 'error', // Disallow console logs
    'no-undef': 'error', // Report undefined variables
    'no-html-link-for-pages': 'off' // Disable no-html-link-for-pages rule
  }
}
