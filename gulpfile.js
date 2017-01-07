var gulp = require('gulp');
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');
var path = require('path');
var WrapperPlugin = require('wrapper-webpack-plugin');
var webshot = require('gulp-webshot');
var fs = require('fs-extra');
var gutil = require("gulp-util");
var Twit = require('twit')

var env = require('./src/env.js');

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
	if(env.twitterConsumerKey){
		var T = new Twit({
			consumer_key:         env.twitterConsumerKey,
			consumer_secret:      env.twitterConsumerSecret,
			access_token:         env.twitterAccess,
			access_token_secret:  env.twitterSecret
		});
		var b64content = fs.readFileSync('build/book.jpg', { encoding: 'base64' });
		T.post('media/upload', { media_data: b64content }, function (err, data, response) {
			var params = { status: '', media_ids: [data.media_id_string] }
			T.post('statuses/update', params, function (err, data, response) {
				if(err) {
					throw new gutil.PluginError({
						plugin: 'tweet',
						message: err
					});
				}
				else {
					done()
				}
			});
		});
	} else {
		throw new gutil.PluginError({
			plugin: 'tweet',
			message: 'Environment is undefined'
		});
	}
})

gulp.task('webshot',function(done){

	var webshot = require('webshot');

	var options = {
		renderDelay: 20000,
		siteType: 'file',
		phantomPath: require('phantomjs2').path,
		phantomConfig: {
			'local-to-remote-url-access':'true',
			'web-security':'false'
		},
		userAgent: 'Mozilla/4.0 (iPad; CPU OS 4_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/4.1 Mobile/9A405 Safari/7534.48.3',
		errorIfJSException: true,
		quality: 75,
		screenSize: {
			width: 800,
			height: 1100
		}
	};

	webshot('build/index.html', 'build/book.jpg', options, function(err) {
		if(err) {
			console.error(err);
		}
		else {
			done();
		}
	});

});

gulp.task('_makefiles',function(done){
	fs.removeSync('build');
	fs.mkdirsSync('build');
	fs.copySync('src/template/index.html','build/index.html');
	var data = fs.readFileSync('build/index.html');
	data = data.toString();
	data = data.replace('{{base}}','file://'+__dirname+'/build/index.html');
	fs.writeFileSync('build/index.html', data);
	done();
});

gulp.task('_makejs', function() {
	return gulp.src('src/index.js')
		.pipe(webpack({
			output: {
				filename: 'textbook.js',
				library: 'Textbook',
				libraryTarget: 'umd'
			},
			plugins: [
				new webpack.webpack.ProvidePlugin({
					Promise: 'es6-promise-promise'
				}),
				new webpack.webpack.DefinePlugin({
					'process.env': {
						TEXTBOOK_GOOGLE_CX: '"'+process.env.TEXTBOOK_GOOGLE_CX+'"',
						TEXTBOOK_GOOGLE_KEY:  '"'+process.env.TEXTBOOK_GOOGLE_KEY+'"'
					}
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
		.pipe(gulp.dest('build/'));
});

gulp.task('watch',function() {
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
				new webpack.webpack.DefinePlugin({
					'process.env': {
						PHOTO_CID: '"'+process.env.PHOTO_CID+'"',
						PHOTO_CS:  '"'+process.env.PHOTO_CS+'"'
					}
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
		.pipe(gulp.dest('build/'));
})


gulp.task('default',
	gulp.series('_makefiles','_makejs')
);

gulp.task('shitpost',
	gulp.series('default','webshot','tweet')
);
