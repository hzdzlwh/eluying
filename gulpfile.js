var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify');
	concat = require('gulp-concat')

gulp.task('styles',function(){
	return sass('static/sass/main.scss', {style: 'compressed'})
		.pipe(autoprefixer('last 3 version'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('static/css'))
		.pipe(notify({message:'Styles task complete'}));
});
gulp.task('scripts', function() {
	return gulp.src('static/js/angular/controller/*.js')
		.pipe(concat('controllers.js'))    
		.pipe(gulp.dest('static/js/angular'))       
		.pipe(notify({ message: 'Scripts task complete' }));
});
gulp.task('watch',function(){
	gulp.watch('static/sass/**/*.scss',['styles']);
	gulp.watch('static/js/angular/**/*.js',['scripts']);
});
gulp.task('default',['watch'],function(){
	gulp.start('styles','scripts');
});