var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    webpack = require('webpack'),
    gulpWebpack = require('webpack-stream'),
    path = require('path'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    zip = require('gulp-zip'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    webpackConf = require('./webpack.conf');

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: './',
            index: 'login.html'
        }
    });
});

gulp.task('clean', function () {
    gulp.src(['./build', './.sass-cache'])
        .pipe(clean({force: true}));
});

gulp.task('build', ['styles', 'webpack-prod', 'clean'], function () {
    gulp.src('static/css/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('build/static/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
    gulp.src('static/js/app/dist/**/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('build/static/js/app/dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
    gulp.src(['static/js/lib/html5shiv.min.js', 'static/js/lib/respond.min.js', 'static/js/lib/bootstrap-ie.js'])
        .pipe(uglify())
        .pipe(gulp.dest('build/static/js/lib'));
    gulp.src('view/**/*.html')
        .pipe(gulp.dest('build/view'));
    gulp.src('./*.html')
        .pipe(gulp.dest('build'));
    gulp.src('WEB-INF/web.xml')
        .pipe(gulp.dest('build/WEB-INF'));
    gulp.src('static/image/**/*')
        .pipe(rev())
        .pipe(gulp.dest('build/static/image'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/image'));
});

//压缩成.war
gulp.task('zip', function () {
    gulp.src('./build/**')
        .pipe(zip('eluyun.war'))
        .pipe(gulp.dest('./'));
});

//hash版本控制
gulp.task('rev', function () {
    gulp.src(['rev/**/*.json', 'build/**/*.html'])
        .pipe( revCollector())
        .pipe( gulp.dest('build') );
    gulp.src(['rev/**/*.json', 'build/static/js/app/dist/**/*.js'])
        .pipe( revCollector())
        .pipe( gulp.dest('build/static/js/app/dist') );
    gulp.src(['rev/**/*.json', 'build/static/css/**/*.css'])
        .pipe( revCollector())
        .pipe( gulp.dest('build/static/css') );
});


gulp.task('styles', function () {
    return sass('static/sass/main.scss', {style: 'compressed'})
        .pipe(autoprefixer('last 3 version'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('static/css'))
        //.pipe(notify({title: '好棒啊！', message: 'css编译完成，站起来活动活动'}))
        .pipe(reload({stream: true}));
});

gulp.task('webpack-prod', function () {
    var webpackProdConf = Object.assign({},
        webpackConf,
        webpackConf.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    ENV: JSON.stringify('production'),
                    NODE_ENV: JSON.stringify('production')
                }
            })));
    return gulp.src('static/js/app/src/entry.js')
        .pipe(gulpWebpack(webpackProdConf, null, function (err, stats) {
            if (err) throw new gutil.PluginError('webpack', err);
            gutil.log('[webpack]', stats.toString({}));
        }, webpack))
        .pipe(gulp.dest('static/js/app/dist/'));
});

gulp.task('webpack-dev', function () {
    var webpackDevConf = Object.assign({},
        webpackConf, {devtool: 'sourcemap'},
        webpackConf.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    ENV: JSON.stringify('development'),
                    NODE_ENV: JSON.stringify('development')
        }
    })));
    return gulp.src('static/js/app/src/entry.js')
        .pipe(gulpWebpack(webpackDevConf, null, function (err, stats) {
            if (err) throw new gutil.PluginError('webpack', err);
            gutil.log('[webpack]', stats.toString({}));
        }, webpack))
        .pipe(gulp.dest('static/js/app/dist/'))
        .pipe(reload({stream: true}));
        //.pipe(notify({title: '好棒啊！', message: '<%= file.relative %>编译完成，站起来活动活动'}));
});

gulp.task('watch', function () {
    gulp.watch('static/sass/**/*.scss', ['styles']);
    gulp.watch('static/js/app/src/**/*.js', ['webpack-dev']);
    gulp.watch('static/js/app/src/common/*.html', ['webpack-dev']);
    gulp.watch('**/*.html').on('change', reload);
});

gulp.task('default', ['watch'], function () {
    gulp.start('browser-sync');
    gulp.start('styles');
    gulp.start('webpack-dev');
    gulp.start('watch');
});

gulp.task('start', ['default']);

