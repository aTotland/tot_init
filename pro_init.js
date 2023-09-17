const { execSync } = require('child_process');

execSync('npm install -g bun');
execSync('bun install -g fs-extra');

const path = require('path');
const fs = require('fs-extra');

const createProject = async (name, mode) => {
	console.log(`Initializing project ${name}...`);

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
	makeDir(name);

	// Initialize npm with basic options
	execSync('npm init -y');

	// Install dependencies
	const installDependencies = (installWith, dependencyType, dependencyList) => {
		if (installWith === 'bun' && dependencyType === 'dep') {
			execSync(`bun install -f ${dependencyList.join(' ')}`); // USE THIS FOR FASTER EXEC - NO LOGS
		}
		if (installWith === 'bun' && dependencyType === 'dev') {
			execSync(`bun install -d -f ${dependencyList.join(' ')}`); // USE THIS FOR FASTER EXEC - NO LOGS
		}
		if (installWith === 'npm' && dependencyType === 'dev') {
			execSync(`npm install ${dependencyList.join(' ')}`); // USE THIS FOR FASTER EXEC - NO LOGS
		}
		if (installWith === 'npm' && dependencyType === 'dev') {
			execSync(`npm install --save-dev ${dependencyList.join(' ')}`); // USE THIS FOR FASTER EXEC - NO LOGS
		}
	};

	// dependencyList
	const myDependencies = [
		'axios',
		'body-parser',
		'bootstrap',
		'bun',
		'connect-ensure-login',
		'connect-sqlite3',
		'cookie-parser',
		'cookie-session',
		'debug',
		'dotenv',
		'ejs',
		'express',
		'express-rate-limit',
		'express-session',
		'express-validator',
		'fs-extra',
		'helmet',
		'http-errors',
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

	installDependencies(mode, 'dep', myDependencies);
	installDependencies(mode, 'dev', myDevDependencies);

	// Add scripts to package.json
	const pathToPackageJson = path.join(process.cwd(), 'package.json');

	// const packageJson = require(pathToPackageJson);
	const packageJson = fs.readJSONSync(pathToPackageJson);
	packageJson.scripts = {
		start: 'node ./bin/www',
		dev: 'npx nodemon ./bin/www',
		debug: 'DEBUG=* npx nodemon ./bin/www',
		test: 'TESATING',
	};
	fs.writeFile(pathToPackageJson, JSON.stringify(packageJson, null, 2));

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
	fs.writeFile('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));

	// Create the prettier configuration
	const prettierConfig = {
		trailingComma: 'es5',
		printWidth: 100,
		singleQuote: true,
		singleAttributePerLine: true,
	};
	fs.writeFile('.prettierrc.json', JSON.stringify(prettierConfig, null, 2));

	// Create README.md
	fs.writeFile('README.md', `# ${name}`);

	// Add .gitignore
	const response = await fetch(
		'https://www.toptal.com/developers/gitignore/api/windows,linux,macos,visualstudiocode,node,database,react,reactnative',
	);
	const gitIgnore = await response.text();
	fs.writeFile('.gitignore', gitIgnore);
};

const name = process.argv[2];
const mode = process.argv[3];

if (!name) {
	console.error('provide a name');
	process.exit();
}

// calling the project create process
createProject(name, mode);
console.log('Initialized!');
