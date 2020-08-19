const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

const PATHS = {
	src: path.join(__dirname,'../src'),
	dist: path.join(__dirname,'../dist'),
	assets: 'assets/'
}
const PAGES_DIR = `${PATHS.src}/pug/pages/`;
const PAGES = fs
	.readdirSync(PAGES_DIR)
	.filter(fileName => fileName.endsWith(".pug"));

module.exports = {
	externals: {
		paths: PATHS
	},
	entry: {
		app: PATHS.src
	},
	output: {
		filename: `${PATHS.assets}js/[name].js`,
		path: PATHS.dist,
		publicPath: '/'
	},
	module: {
		rules:
			[
				{
					test: /\.js$/,
					loader: 'babel-loader',
					exclude: '/node_modules/',
				},
				{
					test: /\.pug$/,
					loader: 'pug-loader',
				},
				{
					test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
					loader: "file-loader",
					options: {
						name: "[name].[ext]"
					}
				},
				{
					test: /\.(gif|jpe?g|tiff|png|webp|bmp|ico)$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: "[name].[ext]",
							}
						},
						{
							loader: 'image-webpack-loader',
							options: {
								mozjpeg: {
									progressive: true,
									quality: 10
								},
								optipng: {
									optimizationLevel: 4,
									enabled: false,
								},
								pngquant: {
									quality: [0.65,0.90],
									speed: 3
								},
								gifsicle: {
									interlaced: false,
								},
								webp: {
									quality: 75
								}
							}
						}
					]
				},
				{
					test: /\.scss$/,
					use: [
						'style-loader',
						MiniCssExtractPlugin.loader,
						{
							loader: "css-loader",
							options: { sourceMap: true }
						},
						{
							loader: "postcss-loader",
							options: {
								sourceMap: true,
								config: { path: `./postcss.config.js` }
							}
						},
						{
							loader: "sass-loader",
							options: { sourceMap: true }
						}
					]
				},
				{
					test: /\.css$/,
					use: [
						'style-loader',
						MiniCssExtractPlugin.loader,
						{
							loader: "css-loader",
							options: { sourceMap: true }
						},
						{
							loader: "postcss-loader",
							options: {
								sourceMap: true,
								config: { path: `./postcss.config.js` }
							}
						}
					]
				}
			]
	},
	plugins:
		[
			new MiniCssExtractPlugin({
				filename: `${PATHS.assets}css/[name].css`
			}),
			new CopyPlugin([
				{
					from: `${PATHS.src}/${PATHS.assets}img`,
					to: `${PATHS.assets}img`
				},
				{
					from: `${PATHS.src}/${PATHS.assets}fonts`,
					to: `${PATHS.assets}fonts`
				},
				{ from: `${PATHS.src}/static`,to: '' }
			]),
			...PAGES.map(
				page =>
					new HtmlPlugin({
						template: `${PAGES_DIR}/${page}`,
						filename: `./${page.replace(/\.pug/,'.html')}`
					})
			)
		]
}