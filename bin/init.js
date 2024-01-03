#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs-extra');

// Import configurations
const {
	indentRule,
	scripts,
	eslintConfig,
	prettier,
	nodemonConfig,
	dependencies,
	devDependencies,
	gitIgnoreConfig,
} = require('../config');

// Get version from package.json
const version = JSON.stringify(require('../package.json').version);
// Get current working directory
const currentDirectory = process.cwd();
// Get path to package.json
const packageJsonPath = path.join(currentDirectory, 'package.json');

// Function to revert changes on SIGINT in case of errors
const revertChanges = () => {
	console.info('🔄 - Reverting changes...');
	execSync('git reset --hard && git clean -fd');
	console.info('✅ - Reverted changes');
	process.exit(1);
};

// Function to check git status
const checkGitStatus = () => {
	console.info('🔄 - Checking git status...');
	const gitStatus = execSync('git status --porcelain').toString();
	if (gitStatus.trim() !== '') {
		console.info(
			'❌  - There are uncommitted changes! Make a new commit before running again...'
		);
		process.exit(1);
	}
	process.on('SIGINT', revertChanges);
	console.info('✅ - There are no uncommitted changes.');
};

// Function to add .gitignore
const configGitIgnore = async () => {
	console.info('🔄 - Adding .gitignore...');
	const { environments } = gitIgnoreConfig;
	try {
		// gitignore.io for easy setup and adaptability
		execSync(`npx add-gitignore ${environments.join(' ')}`);
		console.info('✅ - Added .gitignore');
	} catch (error) {
		throw Error(`❌  - Could not load .gitignore content: ${error}`);
	}
};

// Function to read package.json if it exists
const readPackageJson = (packageJson) => {
	if (!fs.existsSync(packageJson)) {
		throw Error('❌ - package.json not found in the current directory!');
	}
	return fs.readJsonSync(packageJson);
};

// Function to update package.json if it exists
const updatePackageJson = (existingPackageJson) => {
	console.info('🔄 - Updating package.json scripts, configs & dependencies...');
	try {
		return {
			...existingPackageJson,
			scripts: {
				...existingPackageJson.scripts,
				...scripts,
			},
			eslintConfig: {
				...existingPackageJson.eslintConfig,
				...eslintConfig,
			},
			prettier: {
				...existingPackageJson.prettier,
				...prettier,
			},
			nodemonConfig: {
				...existingPackageJson.nodemonConfig,
				...nodemonConfig,
			},
			dependencies: {
				...existingPackageJson.dependencies,
				...dependencies,
			},
			devDependencies: {
				...existingPackageJson.devDependencies,
				...devDependencies,
			},
		};
	} catch (error) {
		throw Error(`❌ - Could not update package.json: ${error}`);
	}
};

// Function to write package.json
const writePackageJson = (packagePath, content) => {
	fs.writeJsonSync(packagePath, content, indentRule);
	console.info('✅ - Added configs to package.json');
};

const runNpmInstall = () => {
	console.info('🔄 - Installing dependencies...');
	try {
		execSync('npm i');
		console.info('✅ - Installed dependencies');
		execSync('npm up');
		console.info('✅ - Updated dependencies');
	} catch (error) {
		throw Error(`❌ - Could not install dependencies: ${error}`);
	}
};

const runConfig = () => {
	console.info('🔄 - Setting up configuration files ...');
	try {
		// Usage of functions to add configs and dependencies to package.json
		const existingPackageJson = readPackageJson(packageJsonPath);
		const updatedPackageJson = updatePackageJson(existingPackageJson);
		writePackageJson(packageJsonPath, updatedPackageJson);
		configGitIgnore();
		runNpmInstall();
		console.info('✅ - Setup finished!');
	} catch (error) {
		throw Error(`❌ - Couldn't set up configuration files: ${error}`);
	}
};

// Display success message to user
const successDisplay = () => {
	console.group('📦 - It is recommended to add these editor plugins:');
	console.info('➡️  - ESLint');
	console.info('➡️  - Prettier');
};

// Display error message to user
const errorDisplay = (error) => {
	console.error(`${error.message}`);
};

const init = () => {
	console.info(`🔄 - Running tot_init version: ${version}`);
	try {
		checkGitStatus();
		runConfig();
		successDisplay();
	} catch (error) {
		errorDisplay(error);
		revertChanges();
	}
};

init();
