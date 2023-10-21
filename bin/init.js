#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');
const fse = require('fs-extra');
const ora = require('ora');
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

// get current working directory
const currentDirectory = process.cwd();

// Revert changes if something errors
const revertChanges = () => {
	const spinner = ora('🔂 - Reverting changes...').start();
	execSync('git reset --hard && git clean -fd');
	spinner.stopAndPersist({
		symbol: '✅',
		text: ' - Reverted changes!',
	});
	process.exit(1);
};

// Check git status for uncommitted changes
const checkGitStatus = () => {
	const spinner = ora('Checking git status...').start();
	const gitStatus = execSync('git status --porcelain').toString();
	if (gitStatus.trim() !== '') {
		console.error('');
		spinner.stopAndPersist({
			symbol: '❌ ',
			text: ' - There are uncommitted changes! Make a new commit before running again...',
		});
		process.exit(1);
	}
	process.on('SIGINT', revertChanges);
	spinner.stopAndPersist({
		symbol: '✅',
		text: ' - There are no uncommitted changes.',
	});
};

// Add .gitignore
const configGitIgnore = async () => {
	const spinner = ora(' - Adding .gitignore...').start();
	const { environments } = gitIgnoreConfig;
	try {
		// gitignore.io for easy setup and adaptability
		execSync(`npx add-gitignore ${environments.join(' ')}`);
		spinner.stopAndPersist({
			symbol: '✅',
			text: ' - Added .gitignore',
		});
	} catch (error) {
		spinner.stop();
		throw Error(`Could not load .gitignore content: ${error}`);
	}
};

// get path to package.json
const packageJson = path.join(currentDirectory, 'package.json');

// Add configs to package.json
const addConfigs = () => {
	const spinner = ora('Updating package.json scripts & configs...').start();
	try {
		// check if package.json exists, if not, throw error
		if (!fse.existsSync(packageJson)) {
			spinner.stop();
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
		spinner.stopAndPersist({
			symbol: '✅',
			text: ' - Added configs to package.json',
		});
	} catch (error) {
		spinner.stop();
		throw Error(`Could not update package.json: ${error}`);
	}
};

// Add dependencies to package.json
const addDependencies = () => {
	const spinner = ora(' - Adding dependencies to package.json...').start();
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
		spinner.stopAndPersist({
			symbol: '✅',
			text: ' - Added dependencies to package.json',
		});
	} catch (error) {
		spinner.stop();
		throw Error(`Could not add dependencies: ${error}`);
	}
};

// Display success message to user
const successDisplay = () => {
	console.group('📦 - It is recommended to add these editor plugins:');
	console.info('➡️  - ESLint');
	console.info('➡️  - Prettier');
};

const runNpmInstall = () => {
	const spinner = ora(' - Installing dependencies...').start();
	try {
		execSync('npm i');
		spinner.stopAndPersist({
			symbol: '✅',
			text: ' - Installed dependencies',
		});
	} catch (error) {
		spinner.stop();
		throw Error(`Could not install dependencies: ${error}`);
	}
};

const runConfig = () => {
	const spinner = ora('Setting up configuration files ...').start();
	try {
		addConfigs();
		addDependencies();
		configGitIgnore();
		runNpmInstall();
		spinner.stopAndPersist({
			symbol: '✅',
			text: ' - Setup finished!',
		});
	} catch (error) {
		spinner.stop();
		throw Error(`Couldn't set up configuration files: ${error}`);
	}
};

// Display success message to user
const errorDisplay = (error) => {
	console.error(`${error.message}`);
};

const init = () => {
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
