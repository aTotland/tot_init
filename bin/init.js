#!/usr/bin/env node

const path = require('path');
const fse = require('fs-extra');
const { execSync } = require('child_process');

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

const configGitIgnore = async () => {
	// Add .gitignore
	// gitignore.io for easy modularity
	const gitIgnoreConfig = await fetch(config.gitIgnoreConfig.toString()).then(
		(res) => res.text()
	);
	fse.writeFile('.gitignore', gitIgnoreConfig);
};

// Add scripts to package.json
const addConfigs = () => {
	try {
		console.info('Updating package.json scripts & configs ...');

		const packageJson = path.join(currentDirectory, 'package.json');

		if (!fse.existsSync(packageJson)) {
			throw Error('package.json not found in the current directory.');
		}

		const existingPackageJSON = fse.readJsonSync(packageJson);
		const { scripts } = config;
		const { eslintConfig } = config;
		const { prettier } = config;
		const { nodemonConfig } = config;

		existingPackageJSON.scripts = {
			...existingPackageJSON.scripts,
			...scripts,
			...eslintConfig,
			...prettier,
			...nodemonConfig,
		};

		fse.writeJsonSync(packageJson, existingPackageJSON, indentRule);
	} catch (error) {
		throw Error(`Could not update package.json scripts: ${error}`);
	}
};

// Add dependencies
const addDependencies = () => {
	try {
		console.log('Updating package.json dependencies ...');

		const packageJson = path.join(currentDirectory, 'package.json');

		if (!fse.existsSync(packageJson)) {
			throw Error('package.json not found in the current directory.');
		}

		const existingPackageJSON = fse.readJsonSync(packageJson);
		const { dependencies } = config;
		const { devDependencies } = config;

		existingPackageJSON.scripts = {
			...existingPackageJSON.scripts,
			...dependencies,
			...devDependencies,
		};

		fse.writeJsonSync(packageJson, existingPackageJSON, indentRule);
	} catch (error) {
		throw Error(`Could not update package.json dependencies: ${error}`);
	}
};

// Display success message to user
const successDisplay = () => {
	console.group('success!');
	console.info('It is recommended to add these editor plugins:');
	console.info('--> ESLint');
	console.info('--> Prettier');
};

const runConfig = async () => {
	try {
		console.info('Setting up configuration files ...');
		addConfigs();
		addDependencies();
		configGitIgnore();
	} catch (error) {
		throw Error(`Couldn't set up configuration files: ${error}`);
	}
};

// Display success message to user
const errorDisplay = (error) => {
	console.error(`${error.message}`);
};

const init = async () => {
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
