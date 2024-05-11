module.exports = {
  indentRule: { spaces: 2 },

  scripts: {
    lint: 'npm-run-all "lint:*"',
    'lint:prettier': 'prettier --write .',
    'lint:eslint': 'eslint --fix .',
    'lint:standard': 'standard --fix',
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
  const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
  const eslintConfigPrettier = require('eslint-config-prettier')
  const next = require('next')
  const nextCoreWebVitals = require('next/core-web-vitals')
  
  // const styleGuide = require('eslint-config-standard')
  
  module.exports = [
    eslintConfigPrettier,
    next,
    nextCoreWebVitals,
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
  `,
  dependencies: {
    dotenv: '^16.3.1',
    'fs-extra': '^11.2.0'
  },

  devDependencies: {
    bumpp: '^9.4.0',
    eslint: '^9.0.0',
    'eslint-config-eslint': '^9.0.0',
    'eslint-plugin-prettier': '^5.1.3',
    'eslint-config-prettier': '^9.1.0',
    'npm-check-updates': '^16.14.18',
    nodemon: '^3.1.0',
    'npm-run-all': '^4.1.5',
    prettier: '^3.2.5',
    'prettier-plugin-ejs': '^1.0.3',
    snazzy: '^9.0.0',
    standard: '*'
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
