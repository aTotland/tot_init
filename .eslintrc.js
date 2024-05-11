// .eslintrc.js

module.exports = {
  extends: [
    // 'next',
    // 'next/core-web-vitals',
    'plugin:prettier/recommended',
    'eslint-config-prettier',
    'eslint-config-standard'
  ],
  rules: {
    'no-unused-vars': 'error', // Report unused variables
    'no-console': 0, // Disallow or allow console logs
    'no-undef': 'error' // Report undefined variables
  }
}
