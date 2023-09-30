#!/usr/bin/env node

const { execSync } = require('child_process');

// fs-extra is just better
try {
	execSync('npm install -g fs-extra');
} catch (error) {
	console.log(error);
}

const path = require('path');
const fs = require('fs-extra');

let name = process.argv.slice(2).toString();
if (!name) {
	name = __dirname.toString();
}

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
		'bumpp',
		'eslint',
		'eslint-config-airbnb',
		'eslint-config-prettier',
		'nodemon',
		'npm-check',
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
		rules: {
			'no-console': 0,
		},
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
		upgrade: 'npm-check -u && npm audit fix',
		lint: 'npm run lint:fix && npm run prettify',
		'lint:fix': 'eslint --fix .',
		prettify: 'prettier . --write',
		release: 'bumpp -r --all --commit="release: %s" --tag="%s"',
	};
	fs.writeFile(pathToPackageJson, JSON.stringify(packageJson, null, 2));

	// Add .gitignore
	// gitignore.io for easy modularity
	const gitIgnoreConfig = await fetch(
		'https://www.toptal.com/developers/gitignore/api/windows,linux,macos,visualstudiocode,database,react,reactnative,node'
	).then((res) => res.text());
	fs.writeFile('.gitignore', gitIgnoreConfig);

	console.log('Initialized!');
};

// calling the project create process
createProject(name);
