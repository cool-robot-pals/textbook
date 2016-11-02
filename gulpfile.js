var gulp = require('gulp');
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');
var path = require('path');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var WrapperPlugin = require('wrapper-webpack-plugin');
var release = require('gulp-github-release');
var webshot = require('gulp-webshot');

var webpackModule = {
	loaders: [
		{
			test: /\.css$/, loader: "raw"
		},
		{
			test: /\.mustache$/, loader: "raw"
		},
		{
			test: /.js?$/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		}
	]
};

gulp.task('webshot',function(){
	return gulp.src('public/index.html')
		.pipe(webshot({
			dest: 'build/',
			root: '..',
			renderDelay: 5000,
			quality: 10,
			screenSize: {
				width: 800,
				height: 1100
			}
		}))
})

gulp.task('test', function () {
	return 'yes it works its perfect'
});

gulp.task('default', function() {
	return gulp.src('src/index.js')
		.pipe(webpack({
			watch: true,
			devtool: 'source-map',
			output: {
				filename: 'textbook.js',
				library: 'Textbook',
				libraryTarget: 'umd'
			},
			plugins: [
				new webpack.webpack.ProvidePlugin({
					Promise: 'es6-promise-promise'
				}),
				new WrapperPlugin({
					header: '/* Textbook */',
					footer: "if(window.Textbook && typeof window.Textbook === 'function'){window.Textbook = window.Textbook()}"
				})
			],
			module: webpackModule,
			resolve: {
				root: path.resolve('./src')
			}
		}))
		.pipe(gulp.dest('public/'));
});
