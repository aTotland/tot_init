module.exports = {
	indentRule: { spaces: 2 },

	scripts: {
		start: 'node ./server/bin',
		dev: 'npx nodemon ./server/bin',
		debug: 'DEBUG=* npx nodemon ./server/bin',
		up: 'npm-check -u && npm audit fix',
		lint: 'npm-run-all "lint:*"',
		'lint:prettier': 'prettier --write .',
		'lint:eslint': 'eslint --fix .',
		release: 'bumpp -r --all --commit="release: %s" --tag="%s"',
		reset: 'git reset --hard && git clean -fd ',
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
		'fs-extra': '^11.1.1',
	},

	devDependencies: {
		bumpp: '^9.2.0',
		eslint: '^8.50.0',
		'eslint-config-airbnb': '^19.0.4',
		'eslint-config-prettier': '^9.0.0',
		nodemon: '^3.0.1',
		'npm-check': '^6.0.1',
		'npm-run-all': '^4.1.5',
		prettier: '^3.0.3',
		'prettier-plugin-ejs': '^0.0.18',
	},

	gitIgnoreConfig: {
		link: 'https://www.toptal.com/developers/gitignore/api/',
		environments: [
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
