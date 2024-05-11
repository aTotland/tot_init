#!/usr/bin/env node

const path = require('path')
const { execSync } = require('child_process')
const { info } = require('console')
const fs = require('fs-extra')

// Import configurations
const {
  indentRule,
  scripts,
  eslintConfig,
  prettierConfig,
  dependencies,
  devDependencies,
  gitIgnoreConfig
} = require('../config')

// Get version from package.json
const version = JSON.stringify(require('../package.json').version)

// Get current working directory
const currentDirectory = process.cwd()

// Get path to package.json
const packageJsonPath = path.join(currentDirectory, 'package.json')
const esLintConfigPath = path.join(currentDirectory, 'eslint.config.js')

// Function to revert changes on SIGINT in case of errors
const revertChanges = () => {
  info('🔄 - Reverting changes...')
  execSync('git reset --hard && git clean -fd')
  info('✅ - Reverted changes')
  process.exit(1)
}

// Function to check git status
const checkGitStatus = () => {
  info('🔄 - Checking git status...')
  const gitStatus = execSync('git status --porcelain').toString()
  if (gitStatus.trim() !== '') {
    info(
      '❌  - There are uncommitted changes! Make a new commit before running again...'
    )
    process.exit(1)
  }
  process.on('SIGINT', revertChanges)
  info('✅ - There are no uncommitted changes.')
}

const lint = () => {
  try {
    info('🔄 - Running lint...')
    execSync('npm run lint')
    info('✅ - Linting passed!')
  } catch (error) {
    throw Error(`❌ - Could not pass lint: ${error}`)
  }
}

// Function to add .gitignore
const configGitIgnore = async () => {
  info('🔄 - Adding .gitignore...')
  const { environments } = gitIgnoreConfig
  try {
    // gitignore.io for easy setup and adaptability
    execSync(`npx add-gitignore ${environments.join(' ')}`)
    info('✅ - Added .gitignore')
  } catch (error) {
    throw Error(`❌  - Could not load .gitignore content: ${error}`)
  }
}

// Function to read package.json if it exists
const readPackageJson = (packageJson) => {
  if (!fs.existsSync(packageJson)) {
    throw Error('❌ - package.json not found in the current directory!')
  }
  return fs.readJsonSync(packageJson)
}

// Function to update package.json if it exists
const updatePackageJson = (existingPackageJson) => {
  info('🔄 - Updating package.json scripts, configs & dependencies...')
  try {
    return {
      ...existingPackageJson,
      scripts: {
        ...existingPackageJson.scripts,
        ...scripts
      },
      prettierConfig: {
        ...existingPackageJson.prettier,
        ...prettierConfig
      },
      nodemonConfig: {
        ...existingPackageJson.nodemonConfig
      },
      dependencies: {
        ...existingPackageJson.dependencies,
        ...dependencies
      },
      devDependencies: {
        ...existingPackageJson.devDependencies,
        ...devDependencies
      }
    }
  } catch (error) {
    throw Error(`❌ - Could not update package.json: ${error}`)
  }
}

// Function to turn eslint.config.js into a string
// const eslintConfigJSON = JSON.stringify(eslintConfig, null, 2)

// Function to write eslint.config.js
const writeEsLintConfig = (esLintPath, content) => {
  fs.writeFileSync(esLintPath, content, indentRule)
  info('✅ - Added configs to eslint.config.js')
}

// Function to write package.json
const writePackageJson = (packagePath, content) => {
  fs.writeJsonSync(packagePath, content, indentRule)
  info('✅ - Added configs to package.json')
}

const runNpmInstall = () => {
  info('🔄 - Installing dependencies...')
  try {
    execSync('npm i')
    info('✅ - Installed dependencies')
    execSync('npm up')
    info('✅ - Updated dependencies')
  } catch (error) {
    throw Error(`❌ - Could not install dependencies: ${error}`)
  }
}

const runConfig = () => {
  info('🔄 - Setting up configuration files ...')
  try {
    // Usage of functions to add configs and dependencies to package.json
    const existingPackageJson = readPackageJson(packageJsonPath)
    const updatedPackageJson = updatePackageJson(existingPackageJson)
    writePackageJson(packageJsonPath, updatedPackageJson)
    writeEsLintConfig(esLintConfigPath, eslintConfig)
    configGitIgnore()
    runNpmInstall()
    info('✅ - Setup finished!')
  } catch (error) {
    throw Error(`❌ - Couldn't set up configuration files: ${error}`)
  }
}

// Display success message to user
const successDisplay = () => {
  console.group('📦 - It is recommended to add these editor plugins:')
  info('➡️  - ESLint')
  info('➡️  - Prettier')
  info('➡️  - StandardJS')
}

// Display error message to user
const errorDisplay = (error) => {
  console.error(`${error.message}`)
}

const init = () => {
  info(`🔄 - Running tot_init version: ${version}`)
  try {
    checkGitStatus()
    runConfig()
    lint()
    successDisplay()
  } catch (error) {
    errorDisplay(error)
    revertChanges()
  }
}

init()
