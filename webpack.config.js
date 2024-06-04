const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const postcssPresetEnv = require('postcss-preset-env');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = [
	{
		...defaultConfig,
		output: {
			path: path.resolve(process.cwd(), 'assets'),
		},
		plugins: [
			new CopyPlugin({
				patterns: [{ from: 'src/fonts', to: 'fonts' }],
			}),
		],
	},
	{
		entry: {
			theme: path.resolve(process.cwd(), 'src', 'scss', 'theme.scss'),
			editor: path.resolve(process.cwd(), 'src', 'scss', 'editor.scss'),
			instantsearch: path.resolve(
				process.cwd(),
				'src',
				'scss',
				'instantsearch.scss'
			),
		},
		output: {
			filename: '[name].js',
			path: path.resolve(process.cwd(), 'assets', 'css'),
		},
		module: {
			rules: [
				{
					test: /\.(sc|sa|c)ss$/,
					exclude: /node_modules/,
					use: [
						MiniCSSExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								url: false,
								sourceMap: true,
								importLoaders: 2,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: true,
								postcssOptions: {
									plugins: () => [
										postcssPresetEnv({
											browsers: 'last 2 versions',
										}),
									],
								},
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
								sassOptions: {
									outputStyle: 'expanded',
								},
							},
						},
					],
				},
			],
		},
		plugins: [
			new MiniCSSExtractPlugin(),
			new FixStyleOnlyEntriesPlugin(),
		],
	},
	{
		...defaultConfig,
		output: {
			path: path.resolve(process.cwd(), 'assets'),
		},
		plugins: [
			new CopyPlugin({
				patterns: [
					{ 
						from: 'src/js/util.js', 
						to: 'js' 
					}
				],
			}),
		],
	},
	{
		entry: {
			theme: path.resolve(
				process.cwd(),
				'src',
				'js',
				'theme.js',
			),
			instantsearch: path.resolve(
				process.cwd(),
				'src',
				'js',
				'instantsearch.js',
			),
			autocomplete: path.resolve(
				process.cwd(),
				'src',
				'js',
				'autocomplete.js',
			),
			'register-custom-icons': path.resolve(
				process.cwd(),
				'src',
				'js',
				'register-custom-icons.js',
			),
		},
		output: {
			filename: '[name].js',
			path: path.resolve(process.cwd(), 'assets', 'js'),
		},
		optimization: {
			minimize: false,
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: [
									[
										'@babel/preset-env',
										{
											targets: {
												browsers: ['last 2 versions'],
											},
										},
									],
								],
							},
						},
					],
				},
			],
		},
	},
];
