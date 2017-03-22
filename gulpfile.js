var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    webpack = require('webpack'),
    gulpWebpack = require('webpack-stream-fixed'),
    path = require('path'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    zip = require('gulp-zip'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    webpackConf = require('./webpack.conf'),
    url = require('url'),
    fileInclude = require('gulp-file-include'),
    config = require('./config');

// 开发服务
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './',
            index: 'login.html',
            https: true,
            // 单页
            middleware: function(req, res, next) {
                const goal = config.SPA.find( i => req.url.indexOf(i.url) > -1);
                if (goal) {
                    req.url = goal.path;
                }

                return next();
            }
        },
        port: gutil.env.port || config.port
    });
});

// 首页模板拼接
gulp.task('file-include', function() {
    gulp.src(config.html)
        .pipe(fileInclude())
        .pipe(gulp.dest('./view/home'));
    gulp.src(['./static/tpl/login.html'])
        .pipe(fileInclude())
        .pipe(gulp.dest('./'));
});

gulp.task('clean', function() {
    gulp.src(['./build', './.sass-cache'])
        .pipe(clean({force: true}));
});

// hash缓存
function revHash() {
    gulp.src('static/css/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('build/static/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
    gulp.src('static/js/app/dist/**/*.js')
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
}

gulp.task('build:prod', ['file-include', 'styles', 'webpack-prod', 'clean'], revHash);

gulp.task('build:dev', ['file-include', 'styles', 'webpack-dev', 'clean'], revHash);

// 压缩成.war
gulp.task('zip', function() {
    gulp.src('./build/**')
        .pipe(zip('eluyun.war'))
        .pipe(gulp.dest('./'));
});

// hash版本控制
gulp.task('rev', function() {
    gulp.src(['rev/**/*.json', 'build/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('build'));
    gulp.src(['rev/**/*.json', 'build/static/js/app/dist/**/*.js'])
        .pipe(revCollector())
        .pipe(gulp.dest('build/static/js/app/dist'));
    gulp.src(['rev/**/*.json', 'build/static/css/**/*.css'])
        .pipe(revCollector())
        .pipe(gulp.dest('build/static/css'));
});


gulp.task('styles', function () {
    return sass(config.css, { style: 'compressed' })
        .pipe(autoprefixer('last 3 version'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('static/css/dist'))
        .pipe(reload({ stream: true }));
});

// 生产环境webpack配置
gulp.task('webpack-prod', function() {
    delete webpackConf.devtool;
    webpackConf.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                ENV: JSON.stringify('production'),
                NODE_ENV: JSON.stringify('production'),
                serverUrl: gutil.env.server || (gutil.env.test ? config.testServer : config.devServer)
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: { screw_ie8: true },
            compress: {
                screw_ie8: true,
                warnings: false
            },
            comments: false
        })
    );
    webpackConf.resolve.alias.vue = 'vue/dist/vue.min.js';
    return gulp.src('static/js/app/src/entry.js')
        .pipe(gulpWebpack(webpackConf, null, function (err, stats) {
            if (err) throw new gutil.PluginError('webpack', err);
            gutil.log('[webpack]', stats.toString({}));
        }, webpack))
        .pipe(gulp.dest('static/js/app/dist/'));
});

// 开发webpack配置
gulp.task('webpack-dev', function() {
    const webpackDevConf = Object.assign({},
        webpackConf,
        { watch: true },
        webpackConf.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    ENV: JSON.stringify('development'),
                    NODE_ENV: JSON.stringify('development'),
                    serverUrl: JSON.stringify(gutil.env.server || (gutil.env.test ? config.testServer : config.devServer))
                }
            }))
    );

    return gulp.src('static/js/app/src/entry.js')
        .pipe(gulpWebpack(webpackDevConf, null, function(err, stats) {
            gutil.log('[webpack]', stats.toString({ chunks: false }));
        }, webpack))
        .pipe(gulp.dest('static/js/app/dist/'))
        .pipe(reload({ stream: true }));

});

gulp.task('watch', function() {
    gulp.watch('static/sass/**/*.scss', ['styles']);
    gulp.watch('**/*.html').on('change', reload);
    gulp.watch('./static/tpl/*.html', ['file-include']);
});

gulp.task('default', function() {
    gulp.start('browser-sync');
    gulp.start('file-include');
    gulp.start('styles');
    gulp.start('webpack-dev');
    gulp.start('watch');
});

gulp.task('start', ['default']);
