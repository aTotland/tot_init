#!/usr/bin/env node

const { execSync } = require('child_process');

const name = process.argv.slice(2).toString();

// fs-extra is just better
try {
  execSync('npm install -g fs-extra');
} catch (error) {
  console.log(error);
}

const path = require('path');
const fs = require('fs-extra');

const createProject = async (projectName) => {
  console.log(`Initializing project ${projectName}...`);

  // Create and cd process into directory
  const makeDir = (dirName) => {
    try {
      fs.mkdirpSync(dirName);
    } catch (error) {
      console.log(error);
    }
    try {
      process.chdir(dirName);
    } catch (error) {
      console.log(error);
    }
  };
  makeDir(projectName);

  // dependencyList
  const myDependencies = [
    'axios',
    'body-parser',
    'bootstrap',
    'bootstrap-icons',
    'connect-ensure-login',
    'connect-sqlite3',
    'cookie-parser',
    'cookie-session',
    'dotenv',
    'debug',
    'ejs',
    'express',
    'express-session',
    'express-validator',
    'express-rate-limit',
    'fs-extra',
    'http-errors',
    'helmet',
    'morgan',
    'passport',
    'passport-local',
    'pluralize',
    'sqlite3',
    'validator',
  ];

  // devDependencyList
  const myDevDependencies = [
    'eslint',
    'eslint-config-airbnb',
    'eslint-config-prettier',
    'nodemon',
    'prettier',
  ];

  // Initialize npm with basic options

  try {
    execSync('npm init -y');
  } catch (error) {
    console.log(error);
  }

  // Install dependencies
  const installDependencies = (dependencyType) => {
    if (dependencyType === 'dep') {
      try {
        execSync(`npm install ${myDependencies.join(' ')}`);
      } catch (error) {
        console.log(error);
      }
    }

    if (dependencyType === 'dev') {
      try {
        execSync(`npm install --save-dev ${myDevDependencies.join(' ')}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  installDependencies('dep');
  installDependencies('dev');

  // Create the nodemon configuration
  const nodemonConfig = {
    watch: '.',
    ext: '.js',
    ignore: [],
  };
  fs.writeFile('nodemon.json', JSON.stringify(nodemonConfig, null, 2));

  // Create the eslint configuration
  const eslintConfig = {
    env: {
      browser: true,
      commonjs: true,
      es2021: true,
      node: true,
    },
    extends: ['eslint:recommended', 'airbnb', 'prettier'],
    parserOptions: {
      ecmaVersion: 'latest',
    },
    rules: {},
  };
  fs.writeFile('.eslintrc', JSON.stringify(eslintConfig, null, 2));

  // Create the prettier configuration
  const prettierConfig = {
    printWidth: 100,
    trailingComma: 'es5',
    singleAttributePerLine: true,
    singleQuote: true,
    bracketSpacing: true,
    useTabs: true,
    tabWidth: 2,
  };
  fs.writeFile('.prettierrc', JSON.stringify(prettierConfig, null, 2));

  // Create README.md
  fs.writeFile('README.md', `# ${projectName}`);

  // Add scripts to package.json
  const pathToPackageJson = path.join(process.cwd(), 'package.json');
  const packageJson = await fs.readJSON(pathToPackageJson);
  packageJson.scripts = {
    start: 'node ./bin/www',
    dev: 'npx nodemon ./bin/www',
    debug: 'DEBUG=* npx nodemon ./bin/www',
  };
  fs.writeFile(pathToPackageJson, JSON.stringify(packageJson, null, 2));

  // Add .gitignore
  // gitignore.io for easy modularity
  const gitIgnoreConfig = await fetch(
    'https://www.toptal.com/developers/gitignore/api/windows,linux,macos,visualstudiocode,node,database,react,reactnative'
  ).then((res) => res.text());
  fs.writeFile('.gitignore', gitIgnoreConfig);

  console.log('Initialized!');
};

if (!name) {
  console.error('Project name must be provided!');
  process.exit();
}

// calling the project create process
createProject(name);