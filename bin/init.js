#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');
const fse = require('fs-extra');

const currentDirectory = process.cwd();
const rootDir = path.join(__dirname, '..');

const config = fse.readJsonSync(path.join(rootDir, 'config/config.json'));
const indentRule = { spaces: 2 };

// Revert changes if something errors
const revertChanges = () => {
	console.info('Reverting changes!');
	execSync('git reset --hard && git clean -fd');
	process.exit(1);
};

// Check git status for uncommitted changes
const checkGitStatus = () => {
	const gitStatus = execSync('git status --porcelain').toString();
	if (gitStatus.trim() !== '') {
		console.error(
			'There are uncommitted changes! make a new commit before running again...'
		);
		process.exit(1);
	}
	process.on('SIGINT', revertChanges);
};

// Add .gitignore
const configGitIgnore = async () => {
	// gitignore.io for easy setup and adaptability
	try {
		const gitIgnoreConfig = await fetch(config.gitIgnoreConfig.toString()).then(
			(res) => res.text()
		);
		fse.writeFile('.gitignore', gitIgnoreConfig);
	} catch (error) {
		throw Error(`Could not load .gitignore content: ${error}`);
	}
};

// get path to package.json
const packageJson = path.join(currentDirectory, 'package.json');

// Add configs to package.json
const addConfigs = () => {
	try {
		console.info('Updating package.json scripts & configs...');

		if (!fse.existsSync(packageJson)) {
			throw Error('package.json not found in the current directory!');
		}

		const existingPackageJson = fse.readJsonSync(packageJson);

		const { scripts } = config;
		const { eslintConfig } = config;
		const { prettier } = config;
		const { nodemonConfig } = config;

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
	} catch (error) {
		throw Error(`Could not update package.json: ${error}`);
	}
};

const addDependencies = () => {
	try {
		console.info('Updating package.json dependencies...');

		if (!fse.existsSync(packageJson)) {
			throw Error('package.json not found in the current directory!');
		}

		const existingPackageJson = fse.readJsonSync(packageJson);

		const { dependencies } = config;
		const { devDependencies } = config;

		existingPackageJson.dependencies = {
			...existingPackageJson.dependencies,
			...dependencies,
		};

		existingPackageJson.devDependencies = {
			...existingPackageJson.devDependencies,
			...devDependencies,
		};

		fse.writeJsonSync(packageJson, existingPackageJson, indentRule);
	} catch (error) {
		throw Error(`Could not add dependencies: ${error}`);
	}
};

// Display success message to user
const successDisplay = () => {
	console.group('success!');
	console.info('It is recommended to add these editor plugins:');
	console.info('--> ESLint');
	console.info('--> Prettier');
};

const runConfig = () => {
	try {
		console.info('Setting up configuration files ...');
		addConfigs();
		addDependencies();
		configGitIgnore();
		execSync('npm i');
	} catch (error) {
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
