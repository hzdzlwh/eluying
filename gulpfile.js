var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    webpack = require("webpack"),
    gulpWebpack = require("webpack-stream"),
    path = require("path"),
    gutil = require("gulp-util"),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    zip = require('gulp-zip'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector');

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "login.html"
        }
    });
});

gulp.task('clean', function () {
    gulp.src(['./build', './.sass-cache'])
        .pipe(clean({force: true}));
});

gulp.task('build', ['styles', 'webpack2', 'clean'], function () {
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

gulp.task('zip', function () {
    gulp.src('./build/**')
        .pipe(zip('eluyun.war'))
        .pipe(gulp.dest('./'));
});

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
        .pipe(notify({title: '好棒啊！', message: 'css编译完成，站起来活动活动'}))
        .pipe(reload({stream: true}));
});

gulp.task('webpack2', function () {
    return gulp.src('static/js/app/src/entry.js')
        .pipe(gulpWebpack({
            plugins: [
                new webpack.ProvidePlugin({
                    "$": 'jquery',
                    "jQuery": 'jquery'
                }),
                new webpack.optimize.CommonsChunkPlugin('common.js')
            ],
            entry: {
                "login/login": "./static/js/app/src/login/login.js",
                "price/roomEntry": "./static/js/app/src/business/price/roomEntry.js",
                "price/foodETEntry": "./static/js/app/src/business/price/foodETEntry.js",
                "inventory/room": "./static/js/app/src/business/inventory/room.js",
                "inventory/food": "./static/js/app/src/business/inventory/food.js",
                "inventory/entertainment": "./static/js/app/src/business/inventory/entertainment.js",
                "category/roomEntry": "./static/js/app/src/business/category/room/roomEntry.js",
                "category/foodEntry": "./static/js/app/src/business/category/food/foodEntry.js",
                "category/ETEntry": "./static/js/app/src/business/category/entertainment/ETEntry.js",
                "category/shopEntry": "./static/js/app/src/business/category/shop/shopEntry.js",
                "salesite/info": "./static/js/app/src/salesite/info/info.js",
                "salesite/operation": "./static/js/app/src/salesite/operation/operation.js"
            },
            output: {

                filename: "[name].js",
                publicPath: "./dist/"
            },
            resolve: {
                extensions: ['.js', ""],
                alias: {
                    cookie: path.join(__dirname, "./static/js/lib/jquery.cookie.js"),
                    jquery: path.join(__dirname, "./static/js/lib/jquery.min.js"),
                    jqueryui: path.join(__dirname, "./static/js/lib/jquery-ui.min.js"),
                    "datepicker-zh": path.join(__dirname, "./static/js/lib/datepicker-zh-CN.js"),
                    bootstrap: path.join(__dirname, "./static/js/lib/bootstrap.min.js"),
                    header: path.join(__dirname, "./static/js/app/src/common/header.js"),
                    leftMenu: path.join(__dirname, "./static/js/app/src/common/leftMenu.js"),
                    util: path.join(__dirname, "./static/js/app/src/common/util.js"),
                    logout: path.join(__dirname, "./static/js/app/src/common/logout.js"),
                    AJAXService: path.join(__dirname, "./static/js/app/src/common/AJAXService.js"),
                    accommodationPriceList: path.join(__dirname, "./static/js/app/src/business/price/accommodationPriceList.js"),
                    foodETPriceList: path.join(__dirname, "./static/js/app/src/business/price/foodETPriceList.js"),
                    trToggle: path.join(__dirname, "./static/js/app/src/common/trToggle.js"),
                    loginValidate: path.join(__dirname, "./static/js/app/src/login/login.validate.js"),
                    modal: path.join(__dirname, "./static/js/app/src/common/modal.js"),
                    validate: path.join(__dirname, "./static/js/lib/jquery.validate.min.js"),
                    validation: path.join(__dirname, "./static/js/lib/validation.js"),
                    seasonManage: path.join(__dirname, "./static/js/app/src/business/price/seasonManage.js"),
                    monthManage: path.join(__dirname, "./static/js/app/src/business/price/monthManage.js"),
                    floatInfo: path.join(__dirname, "./static/js/app/src/common/floatInfo.js"),
                    roomCategoryList: path.join(__dirname, "./static/js/app/src/business/category/room/roomCategoryList.js"),
                    fileupload: path.join(__dirname, "./static/js/lib/jquery.fileupload.js"),
                    "jquery.ui.widget": path.join(__dirname, "./static/js/lib/jquery.ui.widget.js"),
                    iframe: path.join(__dirname, "./static/js/lib/jquery.iframe-transport.js"),
                    networkAction: path.join(__dirname, "./static/js/app/src/common/networkAction.js")
                }
            }
        }, null, function (err, stats) {
            if (err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({}));
        }, webpack))
        .pipe(gulp.dest('static/js/app/dist/'));
});

gulp.task('webpack', function () {
    return gulp.src('static/js/app/src/entry.js')
        .pipe(gulpWebpack({
            plugins: [
                new webpack.ProvidePlugin({
                    "$": 'jquery',
                    "jQuery": 'jquery'
                }),
                new webpack.optimize.CommonsChunkPlugin('common.js')
            ],
            entry: {
                "login/login": "./static/js/app/src/login/login.js",
                "price/roomEntry": "./static/js/app/src/business/price/roomEntry.js",
                "price/foodETEntry": "./static/js/app/src/business/price/foodETEntry.js",
                "inventory/room": "./static/js/app/src/business/inventory/room.js",
                "inventory/food": "./static/js/app/src/business/inventory/food.js",
                "inventory/entertainment": "./static/js/app/src/business/inventory/entertainment.js",
                "category/roomEntry": "./static/js/app/src/business/category/room/roomEntry.js",
                "category/foodEntry": "./static/js/app/src/business/category/food/foodEntry.js",
                "category/ETEntry": "./static/js/app/src/business/category/entertainment/ETEntry.js",
                "category/shopEntry": "./static/js/app/src/business/category/shop/shopEntry.js",
                "salesite/info": "./static/js/app/src/salesite/info/info.js",
                "salesite/operation": "./static/js/app/src/salesite/operation/operation.js"
            },
            output: {
                filename: "[name].js",
                publicPath: "./dist/"
            },
            module: {
              loaders: [

                  {test: /\.html$/,  loader: 'raw-loader', exclude: [ path.join(__dirname, "./view")] }

              ]
            },
            resolve: {
                extensions: ['.js', ""],
                alias: {
                    cookie: path.join(__dirname, "./static/js/lib/jquery.cookie.js"),
                    jquery: path.join(__dirname, "./static/js/lib/jquery.min.js"),
                    jqueryui: path.join(__dirname, "./static/js/lib/jquery-ui.min.js"),
                    "datepicker-zh": path.join(__dirname, "./static/js/lib/datepicker-zh-CN.js"),
                    bootstrap: path.join(__dirname, "./static/js/lib/bootstrap.min.js"),
                    header: path.join(__dirname, "./static/js/app/src/common/header.js"),
                    leftMenu: path.join(__dirname, "./static/js/app/src/common/leftMenu.js"),
                    util: path.join(__dirname, "./static/js/app/src/common/util.js"),
                    logout: path.join(__dirname, "./static/js/app/src/common/logout.js"),
                    AJAXService: path.join(__dirname, "./static/js/app/src/common/AJAXService.js"),
                    accommodationPriceList: path.join(__dirname, "./static/js/app/src/business/price/accommodationPriceList.js"),
                    foodETPriceList: path.join(__dirname, "./static/js/app/src/business/price/foodETPriceList.js"),
                    trToggle: path.join(__dirname, "./static/js/app/src/common/trToggle.js"),
                    loginValidate: path.join(__dirname, "./static/js/app/src/login/login.validate.js"),
                    modal: path.join(__dirname, "./static/js/app/src/common/modal.js"),
                    validate: path.join(__dirname, "./static/js/lib/jquery.validate.min.js"),
                    validation: path.join(__dirname, "./static/js/lib/validation.js"),
                    seasonManage: path.join(__dirname, "./static/js/app/src/business/price/seasonManage.js"),
                    monthManage: path.join(__dirname, "./static/js/app/src/business/price/monthManage.js"),
                    floatInfo: path.join(__dirname, "./static/js/app/src/common/floatInfo.js"),
                    roomCategoryList: path.join(__dirname, "./static/js/app/src/business/category/room/roomCategoryList.js"),
                    fileupload: path.join(__dirname, "./static/js/lib/jquery.fileupload.js"),
                    "jquery.ui.widget": path.join(__dirname, "./static/js/lib/jquery.ui.widget.js"),
                    iframe: path.join(__dirname, "./static/js/lib/jquery.iframe-transport.js"),
                    networkAction: path.join(__dirname, "./static/js/app/src/common/networkAction.js"),
                    dsy: path.join(__dirname, "./static/js/app/src/common/dsy.js"),
                    angular: path.join(__dirname, "./node_modules/angular/angular.min.js"),
                }
            },
            devtool: "sourcemap"
        }, null, function (err, stats) {
            if (err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({}));
        }, webpack))
        .pipe(gulp.dest('static/js/app/dist/'))
        .pipe(reload({stream: true}))
        .pipe(notify({title: '好棒啊！', message: '<%= file.relative %>编译完成，站起来活动活动'}));
});


gulp.task('watch', function () {
    gulp.watch('static/sass/**/*.scss', ['styles']);
    gulp.watch('static/js/app/src/**/*.js', ['webpack']);
    gulp.watch("**/*.html").on('change', reload);
});

gulp.task('default', ['watch'], function () {
    gulp.start('browser-sync');
    gulp.start('styles');
    gulp.start('webpack');
    gulp.start('watch');
});

