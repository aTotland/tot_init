#!/usr/bin/env node

const fse = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const currentDirectory = process.cwd();
const rootDir = path.join(__dirname, '..');

const config = fse.readJsonSync(path.join(rootDir, 'config/config.json'));

const revertChanges = () => {
	console.log('Reverting changes!');
	execSync('git reset --hard && git clean -fd');
	process.exit(1);
};

// Check git status for uncommitted changes, in case of an error
const checkGitStatus = () => {
	const gitStatus = execSync('git status --porcelain').toString();
	if (gitStatus.trim() !== '') {
		console.error('There are uncommitted changes! make a new commit before running again...');
		process.exit(1);
	}
	process.on('SIGINT', revertChanges);
};

// Create the nodemon configuration
const configNodemon = () => {
	const { nodemonConfig } = config;
	fse.writeFile('nodemon.json', JSON.stringify(nodemonConfig, null, 2));
};

// Create the eslint configuration
const configEslint = () => {
	const { eslintConfig } = config;
	fse.writeFile('.eslintrc', JSON.stringify(eslintConfig, null, 2));
};

// Create the prettier configuration
const configPrettier = () => {
	const { prettierConfig } = config;
	fse.writeFile('.prettierrc', JSON.stringify(prettierConfig, null, 2));
};

const configGitIgnore = async () => {
	// Add .gitignore
	// gitignore.io for easy modularity
	const gitIgnoreConfig = await fetch(config.gitIgnoreConfig).then((res) => res.text());
	fse.writeFile('.gitignore', gitIgnoreConfig);
};

const runConfig = () => {
	try {
		console.log(`Initializing ...`);
		console.log('Setting up configuration files ...');
		configEslint();
		configPrettier();
		configNodemon();
		configGitIgnore();
	} catch (error) {
		throw Error(`Couldn't set up configuration files: ${error}`);
	}
};

// Add scripts to package.json
const addScripts = () => {
	try {
		console.log('Updating package.json scripts ...');

		const packageJson = path.join(currentDirectory, 'package.json');

		if (!fse.existsSync(packageJson)) {
			throw Error('package.json not found in the current directory.');
		}

		const existingPackageJSON = fse.readJsonSync(packageJson);
		const { scripts } = config;

		existingPackageJSON.scripts = {
			...existingPackageJSON.scripts,
			...scripts,
		};

		fse.writeJsonSync(packageJson, existingPackageJSON, { spaces: 2 });
	} catch (error) {
		throw Error(`Could not update package.json scripts: ${error}`);
	}
};

// Install dependencies
const installDependencies = (dependencyType) => {
	if (dependencyType === 'dev') {
		try {
			console.log('Installing dev dependencies...');
			execSync(`npm install --save-dev ${config.devDependencies.join(' ')}`);
		} catch (error) {
			throw Error(`Could not install dev dependencies.`);
		}
	}
	try {
		console.log('Installing dependencies ...');
		execSync(`npm install ${config.dependencies.join(' ')}`);
	} catch (error) {
		throw Error(`Could not install dependencies`);
	}
};

const runDepInstallers = () => {
	installDependencies('dev');
	installDependencies();
};

const successDisplay = () => {
	console.group('success!');
	console.log('It is recommended to add these plugins:');
	console.log('- ESLint');
	console.log('- Prettier');
};

const errorDisplay = (error) => {
	console.error(`${error.message}`);
};

(() => {
	try {
		checkGitStatus();
		runConfig();
		addScripts();
		runDepInstallers();
		successDisplay();
	} catch (error) {
		errorDisplay(error);
		revertChanges();
	}
})();
