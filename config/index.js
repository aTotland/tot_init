module.exports = {
  indentRule: { spaces: 2 },

  scripts: {
    lint: 'npm-run-all "lint:*"',
    'lint:prettier': 'prettier --write .',
    'lint:eslint': 'eslint --fix .',
    'lint:standard': 'standard --fix',
    'lint:next': 'next lint',
    release: 'npm run lint && bumpp -r --all --commit="release: %s" --tag="%s"',
    reset: 'git reset --hard && git clean -fd ',
    check: 'ncu'
  },

  prettierConfig: {
    plugins: ['prettier-plugin-ejs'],
    printWidth: 80,
    useTabs: false,
    tabWidth: 2,
    trailingComma: 'none',
    singleAttributePerLine: true,
    singleQuote: true,
    bracketSpacing: true,
    semi: false
  },

  eslintConfig: `
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
      'no-undef': 'error' // Report undefined variables
    }
  }
  `,

  dependencies: {
    dotenv: '^16.3.1',
    'fs-extra': '^11.2.0',
    next: '14.2.3',
    react: '^18',
    'react-dom': '^18'
  },

  devDependencies: {
    bumpp: '^9.4.0',
    eslint: '^8',
    'eslint-config-eslint': '^9.0.0',
    'eslint-config-next': '14.2.3',
    'eslint-plugin-prettier': '^5.1.3',
    'eslint-config-prettier': '^9.1.0',
    'npm-check-updates': '^16.14.18',
    'npm-run-all': '^4.1.5',
    postcss: '^8',
    prettier: '^3.2.5',
    'prettier-plugin-ejs': '^1.0.3',
    snazzy: '^9.0.0',
    standard: '*',
    tailwindcss: '^3.4.1'
  },

  gitIgnoreConfig: {
    link: 'https://www.toptal.com/developers/gitignore/api/',
    environments: [
      'data',
      'database',
      'git',
      'linux',
      'macos',
      'node',
      'visualstudiocode',
      'windows',
      'yarn',
      'npm',
      'pnpm',
      'prettier',
      'eslint',
      'standard',
      'vscode',
      'node',
      'vercel'
    ]
  }
}
