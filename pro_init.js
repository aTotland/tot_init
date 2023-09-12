const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function createProject(name) {
	console.log(`Initializing project ${name}...`);

	// Create and move process into directory
	fs.mkdirSync(name);
	process.chdir(name);

	// Initialize npm with basic options
	execSync('npm init -y');

	// Install dependencies
	const myDependencies = [
		'axios',
		'body-parser',
		'bootstrap',
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

	execSync(`npm install ${myDependencies.join(' ')}`); // USE THIS FOR FASTER EXEC - NO LOGS
	// myDependencies.forEach((element) => {
	//   console.log(`installing dependency: ${element}`);
	//   execSync(`npm install ${element}`);
	// });

	// Install dev dependencies
	const myDevDependencies = [
		'eslint',
		'eslint-config-airbnb',
		'eslint-config-prettier',
		'nodemon',
		'prettier',
	];
	execSync(`npm install --save-dev ${myDevDependencies.join(' ')}`); // USE THIS FOR FASTER EXEC - NO LOGS
	// myDevDependencies.forEach((element) => {
	//   console.log(`installing dev dependency: ${element}`);
	//   execSync(`npm install --save-dev ${element}`);
	// });

	// Add scripts to package.json
	const pathToPackageJson = path.join(process.cwd(), 'package.json');
	const packageJson = require(pathToPackageJson);
	packageJson.scripts = {
		start: 'node ./bin/www',
		dev: 'npx nodemon ./bin/www',
		debug: 'DEBUG=* npx nodemon ./bin/www',
	};
	fs.writeFileSync(pathToPackageJson, JSON.stringify(packageJson, null, 2));

	// Create the nodemon configuration
	const nodemonConfig = {
		watch: '.',
		ext: '.js',
		ignore: [],
	};
	fs.writeFileSync('nodemon.json', JSON.stringify(nodemonConfig, null, 2));

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
	fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));

	// Create the prettier configuration
	const prettierConfig = {
		trailingComma: 'es5',
		printWidth: 100,
		singleQuote: true,
		singleAttributePerLine: true,
	};
	fs.writeFileSync('.prettierrc.json', JSON.stringify(prettierConfig, null, 2));

	// Create README.md
	fs.writeFileSync('README.md', `# ${name}`);

	// Add .gitignore
	const response = await fetch(
		'https://www.toptal.com/developers/gitignore/api/windows,linux,macos,visualstudiocode,node,database,react,reactnative',
	);
	const gitIgnore = await response.text();
	fs.writeFileSync('.gitignore', gitIgnore);
}

const name = process.argv[2];

if (!name) {
	console.error('provide a name');
	process.exit();
}

createProject(name);
console.log('initialized!');
