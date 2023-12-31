module.exports = {
	indentRule: { spaces: 2 },

	scripts: {
		start: 'node ./bin',
		dev: 'npx nodemon ./bin',
		debug: 'DEBUG=* npx nodemon ./bin',
		lint: 'npm-run-all "lint:*"',
		'lint:prettier': 'prettier --write .',
		'lint:eslint': 'eslint --fix .',
		release: 'bumpp -r --all --commit="release: %s" --tag="%s"',
		reset: 'git reset --hard && git clean -fd ',
		up: 'npx npm-check -u && npm audit fix',
	},

	eslintConfig: {
		root: true,
		env: {
			browser: true,
			commonjs: true,
			es2023: true,
			node: true,
		},
		extends: ['eslint:recommended', 'airbnb', 'prettier'],
		parserOptions: {
			ecmaVersion: 'latest',
		},
		rules: {
			'no-console': 0,
		},
	},

	prettier: {
		plugins: ['prettier-plugin-ejs'],
		printWidth: 80,
		useTabs: true,
		tabWidth: 2,
		trailingComma: 'es5',
		singleAttributePerLine: true,
		singleQuote: true,
		bracketSpacing: true,
		semi: true,
	},

	nodemonConfig: {
		watch: '.',
		ext: '.**',
		ignore: [],
	},

	dependencies: {
		dotenv: '^16.3.1',
		'fs-extra': '^11.2.0',
	},

	devDependencies: {
		bumpp: '^9.2.1',
		eslint: '^8.56.0',
		'eslint-config-airbnb': '^19.0.4',
		'eslint-config-prettier': '^9.1.0',
		nodemon: '^3.0.2',
		'npm-check': '^6.0.1',
		'npm-run-all': '^4.1.5',
		prettier: '^3.1.1',
		'prettier-plugin-ejs': '^0.0.18',
	},

	gitIgnoreConfig: {
		link: 'https://www.toptal.com/developers/gitignore/api/',
		environments: [
			'data',
			'database',
			'git',
			'linux',
			'macos',
			'node',
			'visualstudiocode',
			'windows',
		],
	},
};
