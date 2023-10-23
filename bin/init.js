#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');
const fse = require('fs-extra');

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

const version = JSON.stringify(require('../package.json').version);

// get current working directory
const currentDirectory = process.cwd();

// Revert changes if something errors
const revertChanges = () => {
	console.info('🔂 - Reverting changes...');
	execSync('git reset --hard && git clean -fd');
	console.info('✅ - Reverted changes');
	process.exit(1);
};

// Check git status for uncommitted changes
const checkGitStatus = () => {
	console.info('Checking git status...');
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

// Add .gitignore
const configGitIgnore = async () => {
	console.info(' - Adding .gitignore...');
	const { environments } = gitIgnoreConfig;
	try {
		// gitignore.io for easy setup and adaptability
		execSync(`npx add-gitignore ${environments.join(' ')}`);
		console.info('✅ - Added .gitignore');
	} catch (error) {
		throw Error(`Could not load .gitignore content: ${error}`);
	}
};

// get path to package.json
const packageJson = path.join(currentDirectory, 'package.json');

// Add configs to package.json
const addConfigs = () => {
	console.info('Updating package.json scripts & configs...');
	try {
		// check if package.json exists, if not, throw error
		if (!fse.existsSync(packageJson)) {
			throw Error('package.json not found in the current directory!');
		}

		const existingPackageJson = fse.readJsonSync(packageJson);

		existingPackageJson.scripts = {
			...existingPackageJson.scripts,
			...scripts,
		};

		existingPackageJson.eslintConfig = {
			...existingPackageJson.eslintConfig,
			...eslintConfig,
		};

		existingPackageJson.prettier = {
			...existingPackageJson.prettier,
			...prettier,
		};

		existingPackageJson.nodemonConfig = {
			...existingPackageJson.nodemonConfig,
			...nodemonConfig,
		};

		fse.writeJsonSync(packageJson, existingPackageJson, indentRule);
		console.info('✅ - Added configs to package.json');
	} catch (error) {
		throw Error(`Could not update package.json: ${error}`);
	}
};

// Add dependencies to package.json
const addDependencies = () => {
	console.info(' - Adding dependencies to package.json...');
	try {
		// check if package.json exists, if not, throw error
		if (!fse.existsSync(packageJson)) {
			throw Error('package.json not found in the current directory!');
		}

		const existingPackageJson = fse.readJsonSync(packageJson);

		existingPackageJson.dependencies = {
			...existingPackageJson.dependencies,
			...dependencies,
		};

		existingPackageJson.devDependencies = {
			...existingPackageJson.devDependencies,
			...devDependencies,
		};

		fse.writeJsonSync(packageJson, existingPackageJson, indentRule);
		console.info('✅ - Added dependencies to package.json');
	} catch (error) {
		throw Error(`Could not add dependencies: ${error}`);
	}
};

const runNpmInstall = () => {
	console.info(' - Installing dependencies...');
	try {
		execSync('npm i');
		console.info('✅ - Installed dependencies');
		execSync('npm up');
		console.info('✅ - Updated dependencies');
	} catch (error) {
		throw Error(`Could not install dependencies: ${error}`);
	}
};

const runConfig = () => {
	console.info('Setting up configuration files ...');
	try {
		addConfigs();
		configGitIgnore();
		addDependencies();
		runNpmInstall();
		console.info('✅ - Setup finished!');
	} catch (error) {
		throw Error(`Couldn't set up configuration files: ${error}`);
	}
};

// Display success message to user
const successDisplay = () => {
	console.group('📦 - It is recommended to add these editor plugins:');
	console.info('➡️  - ESLint');
	console.info('➡️  - Prettier');
};

// Display success message to user
const errorDisplay = (error) => {
	console.error(`${error.message}`);
};

const init = () => {
	console.info(`Running tot_init version: ${version}`);
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
