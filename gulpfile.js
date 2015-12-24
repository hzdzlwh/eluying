var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	concat = require('gulp-concat');
var webpack = require("webpack");
var path = require("path");
var gutil = require("gulp-util");

gulp.task('styles',function(){
	return sass('static/sass/main.scss', {style: 'compressed'})
		.pipe(autoprefixer('last 3 version'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('static/css'))
		.pipe(notify({message:'Styles task complete'}));
});

gulp.task('webpack', function(callback) {
    webpack({
		plugins: [
			new webpack.ProvidePlugin({
				"$": 'jquery',
				"jQuery": 'jquery'
			}),
			new webpack.optimize.CommonsChunkPlugin('common.js')
		],
		entry: {
			"price/roomEntry": "./static/js/app/src/price/roomEntry.js"
		},
		output: {
			path: path.join(__dirname, 'static/js/app/dist'),
			filename: "[name].js",
			publicPath: "./dist/"
		},
		resolve: {
			extensions: ['.js', ""],
			alias: {
				jquery: path.join(__dirname,"./static/js/jquery.min.js"),
				header: path.join(__dirname,"./static/js/app/src/common/header.js"),
				leftMenu: path.join(__dirname,"./static/js/app/src/common/leftMenu.js")
			} 
		},
		devtool: "sourcemap"
		}, function(err, stats) {
			if(err) throw new gutil.PluginError("webpack", err);
			gutil.log("[webpack]", stats.toString({
			}));
			callback();
	});
});

gulp.task('watch',function(){
	gulp.watch('static/sass/**/*.scss',['styles']);
	gulp.watch('static/js/**/*.js',['webpack']);
});

gulp.task('default',['watch'],function(){
	gulp.start('styles');
	gulp.start('webpack');
	gulp.start('watch');
});