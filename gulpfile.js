var gulp = require('gulp');
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');
var path = require('path');
var WrapperPlugin = require('wrapper-webpack-plugin');
var webshot = require('gulp-webshot');
var fs = require('fs');

var env = require('./src/env.js');
var Twit = require('twit')

var T = new Twit({
  consumer_key:         env.twitterConsumerKey,
  consumer_secret:      env.twitterConsumerSecret,
  access_token:         env.twitterAccess,
  access_token_secret:  env.twitterSecret
})

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

gulp.task('tweet',function(done){

	var b64content = fs.readFileSync('./build/textbook/public/index.jpeg', { encoding: 'base64' });

	T.post('media/upload', { media_data: b64content }, function (err, data, response) {
		var params = { status: '', media_ids: [data.media_id_string] }
		T.post('statuses/update', params, function (err, data, response) {
			done(data)
		});
	})
})

gulp.task('webshot',function(){
	return gulp.src('public/index.html')
		.pipe(webshot({
			dest: 'build/',
			root: '..',
			renderDelay: 10000,
			streamType: 'jpeg',
			quality: 50,
			screenSize: {
				width: 800,
				height: 1100
			}
		}))
})

gulp.task('shitpost',gulp.series('webshot','tweet'));

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
